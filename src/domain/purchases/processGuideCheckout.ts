import "server-only";
import { eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import { contacts, purchases, accessGrants } from "@/db/schema";
import { enqueueIntegrationJob } from "@/lib/integrationJobs";
import { attachEmailToPurchaseConsent } from "@/domain/checkout/recordPurchaseConsent";
import { sendTransactionalEmail } from "@/lib/email";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { IMMUTABLE_RULES, DELIVERY_HOLD_DAYS, KIT_TAGS } from "@/config/canon";

/**
 * Exact wording, client-supplied 20 Aug 2026 — must not be paraphrased.
 * Sent the moment a purchase completes with the immediate-delivery box
 * ticked. This is a legal confirmation, not a marketing touch, so it must
 * send regardless of marketing consent. The final line (the refunds page
 * link) is an addition, not part of the quoted copy — Build Change
 * Request 01 requires this page linked from every order confirmation
 * email, so it's appended after the exact required paragraph, never
 * inserted into it.
 */
function buildImmediateDeliveryConfirmationEmail(siteUrl: string): string {
  return `A note about your right to cancel.

At checkout you asked us to give you your download immediately, rather than waiting for the 14 day cancellation period to end, and you confirmed that you understood this means you lose the right to change your mind and cancel for a refund.

We are confirming that here for your records.

This does not affect your rights if what you bought turns out to be faulty, not as we described it, or not fit for a purpose you told us about. Those rights are set out in section 11 of our Terms and Conditions of Sale, and they always apply.

Read our refunds and cancellations page: ${siteUrl}/refund-policy`;
}

/**
 * Draft copy — Build Change Request 01 requires this email but doesn't
 * supply exact wording for it (unlike the ticked-box confirmation above,
 * which is verbatim client copy). Flag for client confirmation before
 * launch, per the established "don't invent legal wording silently" rule.
 */
function buildHoldConfirmationEmail(releaseDate: Date, siteUrl: string): string {
  const formattedDate = releaseDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/London",
  });

  return `Your order is confirmed — here's what happens next.

You chose not to receive your download immediately, so you keep your full 14-day right to change your mind. Your download will be released automatically on ${formattedDate}.

If you change your mind before then and would rather have it now, you can release it early from your account — that ends your right to cancel, and we'll say so before you do it.

If you cancel before ${formattedDate}, you'll get a full refund.

Read our refunds and cancellations page: ${siteUrl}/refund-policy`;
}

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
  /** "true"/"false" string from Checkout Session metadata (Phase 6) — whether the immediate-delivery box was ticked. Absent on any pre-Phase-6 session; treated as "false" (safest default — hold delivery) rather than assuming immediate. */
  immediateDeliveryFromMetadata?: string | undefined;
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

  // Backfills the real email onto the Phase 6 consent record written
  // before payment (recordPurchaseConsent) — a no-op if this checkout
  // session predates Phase 6's consent step, or wasn't reached via it.
  await attachEmailToPurchaseConsent(db, input.stripeCheckoutSessionId, input.customerEmail);

  if (!isPaid) {
    // Async payment method (e.g. bank debit) — wait for
    // checkout.session.async_payment_succeeded before granting anything.
    return { outcome: "pending_async_payment", purchaseId: purchase.id };
  }

  const immediateDelivery = input.immediateDeliveryFromMetadata === "true";
  const isFounderPurchase = input.stripePriceId === env.STRIPE_GUIDE_PRICE_ID;
  const { accessGrantId, releaseDate } = await completeGuidePurchase(
    db,
    contactId,
    purchase.id,
    immediateDelivery,
    isFounderPurchase,
  );

  // Legal confirmation, sent inline — not queued — since it must reach
  // the buyer right away, the same reasoning as the login-link email.
  // Build Change Request 01: both outcomes get their own email — ticked
  // confirms the waiver, declined states the actual release date.
  await sendTransactionalEmail({
    to: input.customerEmail,
    subject: immediateDelivery ? "A note about your right to cancel" : "Your order is confirmed",
    text: immediateDelivery
      ? buildImmediateDeliveryConfirmationEmail(env.NEXT_PUBLIC_SITE_URL)
      : buildHoldConfirmationEmail(releaseDate, env.NEXT_PUBLIC_SITE_URL),
  }).catch((error) => {
    // Never let the confirmation email's failure block or fail the
    // webhook itself — the purchase and access grant are already valid.
    logger.error("Failed to send the order confirmation email", {
      provider: "internal",
      action: "processGuideCheckoutCompleted.confirmationEmail",
      safeErrorMessage: error instanceof Error ? error.message : "unknown error",
    });
  });

  return { outcome: "completed", purchaseId: purchase.id, accessGrantId, contactId };
}

/** Handles `checkout.session.async_payment_succeeded`. */
export async function processAsyncPaymentSucceeded(
  db: Database,
  stripeCheckoutSessionId: string,
  immediateDeliveryFromMetadata?: string | undefined,
): Promise<ProcessCheckoutResult> {
  const [purchase] = await db
    .select({
      id: purchases.id,
      contactId: purchases.contactId,
      status: purchases.status,
      stripePriceId: purchases.stripePriceId,
    })
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

  const immediateDelivery = immediateDeliveryFromMetadata === "true";
  const isFounderPurchase = purchase.stripePriceId === env.STRIPE_GUIDE_PRICE_ID;
  const { accessGrantId, releaseDate } = await completeGuidePurchase(
    db,
    purchase.contactId,
    purchase.id,
    immediateDelivery,
    isFounderPurchase,
  );

  const [contact] = await db
    .select({ email: contacts.email })
    .from(contacts)
    .where(eq(contacts.id, purchase.contactId))
    .limit(1);
  if (contact) {
    await sendTransactionalEmail({
      to: contact.email,
      subject: immediateDelivery ? "A note about your right to cancel" : "Your order is confirmed",
      text: immediateDelivery
        ? buildImmediateDeliveryConfirmationEmail(env.NEXT_PUBLIC_SITE_URL)
        : buildHoldConfirmationEmail(releaseDate, env.NEXT_PUBLIC_SITE_URL),
    }).catch((error) => {
      logger.error("Failed to send the order confirmation email", {
        provider: "internal",
        action: "processAsyncPaymentSucceeded.confirmationEmail",
        safeErrorMessage: error instanceof Error ? error.message : "unknown error",
      });
    });
  }

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
 *
 * Phase 6, client-confirmed 20 Aug 2026: declining the immediate-delivery
 * box means the parent must not receive the Guide email or Circle access
 * until the full 14-day cancellation period has passed — both the Kit tag
 * job (which triggers Kit's own delivery automation) and the Circle
 * provisioning job are scheduled with `runAfter` set 14 days out rather
 * than run immediately. The 30-day included-access window itself starts
 * from whenever access genuinely begins, not from purchase, when delayed.
 */
async function completeGuidePurchase(
  db: Database,
  contactId: string,
  purchaseId: string,
  immediateDelivery: boolean,
  isFounderPurchase: boolean,
): Promise<{ accessGrantId: string; releaseDate: Date }> {
  if (!env.CIRCLE_INSIDE_LOOP_SPACE_GROUP_ID) {
    throw new Error(
      "CIRCLE_INSIDE_LOOP_SPACE_GROUP_ID is not configured; cannot create an access grant without knowing which Circle space group to provision.",
    );
  }

  const runAfter = immediateDelivery
    ? new Date()
    : new Date(Date.now() + DELIVERY_HOLD_DAYS * 24 * 60 * 60 * 1000);
  const expiresAt = new Date(runAfter.getTime() + IMMUTABLE_RULES.includedAccessDays * 24 * 60 * 60 * 1000);

  const [grant] = await db
    .insert(accessGrants)
    .values({
      contactId,
      purchaseId,
      kind: "included_30_day",
      status: "pending",
      startsAt: runAfter,
      expiresAt,
      circleSpaceGroupId: env.CIRCLE_INSIDE_LOOP_SPACE_GROUP_ID,
    })
    .returning({ id: accessGrants.id });

  if (!grant) throw new Error("Failed to insert access grant row");

  // clientGuide (guide-owner) is permanent (never removed) and
  // il30DayActive marks the included window; both applied by a retryable
  // job, never inline here, so a transient Kit outage doesn't fail the
  // whole webhook. `runAfter` is the actual mechanism behind Phase 6's
  // 14-day delivery hold — Kit's own automation (which sends the Guide
  // email) only fires once this tag job actually runs. founder/
  // founderPriceLock (Annexe B §12, Phase 7/8) are added only when this
  // purchase was actually made at the founders price — both permanent.
  const tags: string[] = [KIT_TAGS.clientGuide, KIT_TAGS.il30DayActive];
  if (isFounderPurchase) {
    tags.push(KIT_TAGS.founder, KIT_TAGS.founderPriceLock);
  }

  await enqueueIntegrationJob(db, {
    provider: "kit",
    action: "kit.fulfilGuidePurchase",
    contactId,
    purchaseId,
    input: { tags },
    runAfter,
  });

  await enqueueIntegrationJob(db, {
    provider: "circle",
    action: "circle.provisionGuideAccess",
    contactId,
    purchaseId,
    accessGrantId: grant.id,
    input: { spaceGroupId: env.CIRCLE_INSIDE_LOOP_SPACE_GROUP_ID },
    runAfter,
  });

  return { accessGrantId: grant.id, releaseDate: runAfter };
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
