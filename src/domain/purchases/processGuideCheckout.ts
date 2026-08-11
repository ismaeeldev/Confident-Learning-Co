import "server-only";
import { eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import { contacts, purchases, accessGrants } from "@/db/schema";
import { enqueueIntegrationJob } from "@/lib/integrationJobs";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { IMMUTABLE_RULES } from "@/config/canon";

type Database = NeonHttpDatabase<typeof schema>;

export interface CheckoutCompletedInput {
  stripeCheckoutSessionId: string;
  stripePaymentIntentId: string | null;
  stripeCustomerId: string | null;
  stripeProductId: string;
  stripePriceId: string;
  amountTotal: number;
  currency: string;
  customerEmail: string | null;
  /** "paid" for card payments; other values (e.g. "unpaid") mean an async payment method is pending. */
  paymentStatus: string;
  /** The productKey set in Checkout Session metadata by our own checkout route. */
  productKeyFromMetadata: string | undefined;
}

export type ProcessCheckoutResult =
  | { outcome: "ignored_wrong_product"; productKeyFromMetadata: string | undefined }
  | { outcome: "duplicate_purchase"; purchaseId: string }
  | { outcome: "missing_email" }
  | { outcome: "pending_async_payment"; purchaseId: string }
  | { outcome: "completed"; purchaseId: string; accessGrantId: string; contactId: string };

/**
 * Handles a Stripe `checkout.session.completed` event for the Guide — the
 * single public paid entry point (docs/02-CanonicalDecisions.md). Any other
 * product key is rejected rather than guessed at, per Step 8's stop
 * condition. Caller is responsible for webhook signature verification and
 * event-level idempotency (src/lib/idempotency.ts) before calling this.
 */
export async function processGuideCheckoutCompleted(
  db: Database,
  input: CheckoutCompletedInput,
): Promise<ProcessCheckoutResult> {
  if (input.productKeyFromMetadata !== IMMUTABLE_RULES.singlePublicPaidEntryPoint) {
    logger.warn("Ignoring checkout.session.completed for an unexpected product", {
      provider: "stripe",
      action: "processGuideCheckoutCompleted",
      errorCode: "wrong_product",
    });
    return { outcome: "ignored_wrong_product", productKeyFromMetadata: input.productKeyFromMetadata };
  }

  if (!input.customerEmail) {
    logger.error("checkout.session.completed had no customer email", {
      provider: "stripe",
      action: "processGuideCheckoutCompleted",
    });
    return { outcome: "missing_email" };
  }

  // Defence in depth: the outer webhook route already enforces idempotency
  // via webhookEvents, but a duplicate Checkout Session id must never
  // produce two purchase rows regardless of how it got here.
  const [existingPurchase] = await db
    .select({ id: purchases.id, status: purchases.status })
    .from(purchases)
    .where(eq(purchases.stripeCheckoutSessionId, input.stripeCheckoutSessionId))
    .limit(1);

  if (existingPurchase) {
    return { outcome: "duplicate_purchase", purchaseId: existingPurchase.id };
  }

  const contactId = await upsertContactByEmail(db, input.customerEmail);
  const isPaid = input.paymentStatus === "paid";

  const [purchase] = await db
    .insert(purchases)
    .values({
      contactId,
      kind: "guide",
      status: isPaid ? "paid" : "pending",
      stripeCheckoutSessionId: input.stripeCheckoutSessionId,
      stripePaymentIntentId: input.stripePaymentIntentId,
      stripeCustomerId: input.stripeCustomerId,
      stripeProductId: input.stripeProductId,
      stripePriceId: input.stripePriceId,
      amountTotal: input.amountTotal,
      currency: input.currency,
      paidAt: isPaid ? new Date() : null,
    })
    .returning({ id: purchases.id });

  if (!purchase) throw new Error("Failed to insert purchase row");

  if (!isPaid) {
    // Async payment method (e.g. bank debit) — wait for
    // checkout.session.async_payment_succeeded before granting anything.
    return { outcome: "pending_async_payment", purchaseId: purchase.id };
  }

  const accessGrantId = await completeGuidePurchase(db, contactId, purchase.id);
  return { outcome: "completed", purchaseId: purchase.id, accessGrantId, contactId };
}

/** Handles `checkout.session.async_payment_succeeded`. */
export async function processAsyncPaymentSucceeded(
  db: Database,
  stripeCheckoutSessionId: string,
): Promise<ProcessCheckoutResult> {
  const [purchase] = await db
    .select({ id: purchases.id, contactId: purchases.contactId, status: purchases.status })
    .from(purchases)
    .where(eq(purchases.stripeCheckoutSessionId, stripeCheckoutSessionId))
    .limit(1);

  if (!purchase) {
    logger.error("async_payment_succeeded for unknown checkout session", {
      provider: "stripe",
      action: "processAsyncPaymentSucceeded",
    });
    return { outcome: "missing_email" };
  }

  if (purchase.status === "paid") {
    return { outcome: "duplicate_purchase", purchaseId: purchase.id };
  }

  await db
    .update(purchases)
    .set({ status: "paid", paidAt: new Date() })
    .where(eq(purchases.id, purchase.id));

  const accessGrantId = await completeGuidePurchase(db, purchase.contactId, purchase.id);
  return { outcome: "completed", purchaseId: purchase.id, accessGrantId, contactId: purchase.contactId };
}

/** Handles `checkout.session.async_payment_failed`. */
export async function processAsyncPaymentFailed(
  db: Database,
  stripeCheckoutSessionId: string,
): Promise<void> {
  await db
    .update(purchases)
    .set({ status: "cancelled", metadata: { asyncPaymentFailed: true } })
    .where(eq(purchases.stripeCheckoutSessionId, stripeCheckoutSessionId));
}

/**
 * Creates the one 30-day access grant and queues the Kit tag/fulfilment
 * and Circle provisioning jobs. Never applied twice for the same purchase —
 * callers only reach this once a purchase has just transitioned to paid.
 */
async function completeGuidePurchase(
  db: Database,
  contactId: string,
  purchaseId: string,
): Promise<string> {
  if (!env.CIRCLE_INSIDE_LOOP_SPACE_GROUP_ID) {
    throw new Error(
      "CIRCLE_INSIDE_LOOP_SPACE_GROUP_ID is not configured; cannot create an access grant without knowing which Circle space group to provision.",
    );
  }

  const startsAt = new Date();
  const expiresAt = new Date(startsAt.getTime() + IMMUTABLE_RULES.includedAccessDays * 24 * 60 * 60 * 1000);

  const [grant] = await db
    .insert(accessGrants)
    .values({
      contactId,
      purchaseId,
      kind: "included_30_day",
      status: "pending",
      startsAt,
      expiresAt,
      circleSpaceGroupId: env.CIRCLE_INSIDE_LOOP_SPACE_GROUP_ID,
    })
    .returning({ id: accessGrants.id });

  if (!grant) throw new Error("Failed to insert access grant row");

  // client-guide is permanent (never removed) and il-30day-active marks the
  // included window; both applied by a retryable job, never inline here,
  // so a transient Kit outage doesn't fail the whole webhook.
  await enqueueIntegrationJob(db, {
    provider: "kit",
    action: "kit.fulfilGuidePurchase",
    contactId,
    purchaseId,
    input: { tags: ["client-guide", "il-30day-active"] },
  });

  await enqueueIntegrationJob(db, {
    provider: "circle",
    action: "circle.provisionGuideAccess",
    contactId,
    purchaseId,
    accessGrantId: grant.id,
    input: { spaceGroupId: env.CIRCLE_INSIDE_LOOP_SPACE_GROUP_ID },
  });

  return grant.id;
}

async function upsertContactByEmail(db: Database, email: string): Promise<string> {
  const [existing] = await db.select({ id: contacts.id }).from(contacts).where(eq(contacts.email, email)).limit(1);
  if (existing) return existing.id;

  const [created] = await db
    .insert(contacts)
    .values({ email })
    .onConflictDoNothing({ target: contacts.email })
    .returning({ id: contacts.id });

  if (created) return created.id;

  // Lost the insert race to a concurrent request — read the row it created.
  const [raceWinner] = await db.select({ id: contacts.id }).from(contacts).where(eq(contacts.email, email)).limit(1);
  if (!raceWinner) throw new Error(`Failed to upsert contact for ${email}`);
  return raceWinner.id;
}
