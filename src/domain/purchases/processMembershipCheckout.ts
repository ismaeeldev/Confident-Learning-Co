import "server-only";
import { eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import { contacts, purchases, accessGrants, subscriptions } from "@/db/schema";
import type { CommunityProvider } from "@/integrations/circle/types";
import { issueSingleUseInvitation } from "@/domain/circle/issueSingleUseInvitation";
import { enqueueIntegrationJob } from "@/lib/integrationJobs";
import { sendAdminNotificationEmail } from "@/lib/email";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { KIT_TAGS } from "@/config/canon";

type Database = NeonHttpDatabase<typeof schema>;

export interface MembershipCheckoutCompletedInput {
  stripeCheckoutSessionId: string;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  stripeProductId: string;
  stripePriceId: string;
  amountTotal: number;
  currency: string;
  customerEmail: string | null;
  productKeyFromMetadata: string | undefined;
}

export type ProcessMembershipCheckoutResult =
  | { outcome: "ignored_wrong_product"; productKeyFromMetadata: string | undefined }
  | { outcome: "duplicate_purchase"; purchaseId: string }
  | { outcome: "missing_email" }
  | { outcome: "missing_subscription_id" }
  | { outcome: "invitation_issued"; purchaseId: string; accessGrantId: string; contactId: string }
  | { outcome: "invitation_failed"; purchaseId: string; accessGrantId: string; contactId: string };

/**
 * Handles a Stripe `checkout.session.completed` event for the membership
 * subscription — the R3 rebuild (Build Addendum A v2.2, client-confirmed
 * 20 Aug 2026). Payment happens on our own site (this event firing IS the
 * successful payment), then a single-use Circle invitation is issued
 * synchronously, in-request — not queued — because `vercel.json`'s
 * integration-jobs cron only runs once daily, far too slow for R3's
 * "alert within five minutes" requirement on failure.
 */
export async function processMembershipCheckoutCompleted(
  db: Database,
  community: CommunityProvider,
  input: MembershipCheckoutCompletedInput,
): Promise<ProcessMembershipCheckoutResult> {
  if (input.productKeyFromMetadata !== "membership") {
    logger.warn("Ignoring checkout.session.completed for an unexpected product", {
      provider: "stripe",
      action: "processMembershipCheckoutCompleted",
      errorCode: "wrong_product",
    });
    return { outcome: "ignored_wrong_product", productKeyFromMetadata: input.productKeyFromMetadata };
  }

  if (!input.customerEmail) {
    logger.error("Membership checkout.session.completed had no customer email", {
      provider: "stripe",
      action: "processMembershipCheckoutCompleted",
    });
    return { outcome: "missing_email" };
  }

  if (!input.stripeSubscriptionId) {
    logger.error("Membership checkout.session.completed had no subscription id", {
      provider: "stripe",
      action: "processMembershipCheckoutCompleted",
    });
    return { outcome: "missing_subscription_id" };
  }

  // Defence in depth: the outer webhook route already enforces idempotency
  // via webhookEvents, but a duplicate Checkout Session id must never
  // produce two purchase rows regardless of how it got here.
  const [existingPurchase] = await db
    .select({ id: purchases.id })
    .from(purchases)
    .where(eq(purchases.stripeCheckoutSessionId, input.stripeCheckoutSessionId))
    .limit(1);

  if (existingPurchase) {
    return { outcome: "duplicate_purchase", purchaseId: existingPurchase.id };
  }

  if (!env.CIRCLE_INSIDE_LOOP_SPACE_GROUP_ID) {
    throw new Error(
      "CIRCLE_INSIDE_LOOP_SPACE_GROUP_ID is not configured; cannot create an access grant without knowing which Circle space group to provision.",
    );
  }

  const contactId = await upsertContactByEmail(db, input.customerEmail);

  const [purchase] = await db
    .insert(purchases)
    .values({
      contactId,
      kind: "membership",
      status: "paid",
      stripeCheckoutSessionId: input.stripeCheckoutSessionId,
      stripeCustomerId: input.stripeCustomerId,
      stripeProductId: input.stripeProductId,
      stripePriceId: input.stripePriceId,
      amountTotal: input.amountTotal,
      currency: input.currency,
      paidAt: new Date(),
    })
    .returning({ id: purchases.id });
  if (!purchase) throw new Error("Failed to insert membership purchase row");

  // Minimal row now — customer.subscription.updated (fires moments later)
  // fills in status/currentPeriodStart/currentPeriodEnd. Unique index on
  // stripeSubscriptionId makes this safe if that event somehow arrives
  // first and inserts before this does.
  await db
    .insert(subscriptions)
    .values({
      contactId,
      stripeSubscriptionId: input.stripeSubscriptionId,
      stripeCustomerId: input.stripeCustomerId ?? "",
      stripePriceId: input.stripePriceId,
      status: "active",
    })
    .onConflictDoNothing({ target: subscriptions.stripeSubscriptionId });

  const [grant] = await db
    .insert(accessGrants)
    .values({
      contactId,
      purchaseId: purchase.id,
      kind: "paid_membership",
      status: "pending",
      startsAt: new Date(),
      expiresAt: null,
      circleSpaceGroupId: env.CIRCLE_INSIDE_LOOP_SPACE_GROUP_ID,
    })
    .returning({ id: accessGrants.id });
  if (!grant) throw new Error("Failed to insert membership access grant row");

  await enqueueIntegrationJob(db, {
    provider: "kit",
    action: "kit.applyMembershipTag",
    contactId,
    purchaseId: purchase.id,
    input: { applyTags: [KIT_TAGS.memberInsideTheLoop], removeTags: [KIT_TAGS.ilLapsed] },
  });

  const [contact] = await db
    .select({ firstName: contacts.firstName })
    .from(contacts)
    .where(eq(contacts.id, contactId))
    .limit(1);

  try {
    await issueSingleUseInvitation(db, community, {
      contactId,
      accessGrantId: grant.id,
      spaceGroupId: env.CIRCLE_INSIDE_LOOP_SPACE_GROUP_ID,
      email: input.customerEmail,
      firstName: contact?.firstName ?? undefined,
    });

    return { outcome: "invitation_issued", purchaseId: purchase.id, accessGrantId: grant.id, contactId };
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";

    await db
      .update(accessGrants)
      .set({ status: "failed", failureReason: message })
      .where(eq(accessGrants.id, grant.id));

    // R3: alert within 5 minutes and add to an exception list. This fires
    // immediately, from the request itself — do not rely on the
    // once-daily integration-jobs cron for this alert.
    await sendAdminNotificationEmail({
      subject: "URGENT: Membership invitation failed to issue after payment",
      text: [
        `A parent paid for Inside the Loop membership but the Circle invitation failed to issue.`,
        `Contact id: ${contactId}`,
        `Purchase id: ${purchase.id}`,
        `Access grant id: ${grant.id}`,
        `Error: ${message}`,
        ``,
        `This has been queued for automatic retry. If it does not resolve itself, this member has paid and has no access — please action manually via Circle's admin.`,
      ].join("\n"),
    }).catch((alertError) => {
      // The alert failing must never crash the webhook or hide the
      // original failure — logged so a human can still catch it via logs.
      logger.error("Failed to send the immediate invitation-failure alert itself", {
        provider: "internal",
        action: "processMembershipCheckoutCompleted.alert",
        safeErrorMessage: alertError instanceof Error ? alertError.message : "unknown error",
      });
    });

    logger.error("Membership Circle invitation failed to issue after successful payment", {
      provider: "circle",
      action: "processMembershipCheckoutCompleted",
      errorCode: "invitation_failed",
      safeErrorMessage: message,
    });

    // Background catch-up retry — the once-daily cron is a safety net, not
    // the primary path; the immediate alert above is what actually meets
    // R3's 5-minute requirement.
    await enqueueIntegrationJob(db, {
      provider: "circle",
      action: "circle.issueMembershipInvitation",
      contactId,
      accessGrantId: grant.id,
      input: { spaceGroupId: env.CIRCLE_INSIDE_LOOP_SPACE_GROUP_ID },
    });

    return { outcome: "invitation_failed", purchaseId: purchase.id, accessGrantId: grant.id, contactId };
  }
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

  const [raceWinner] = await db.select({ id: contacts.id }).from(contacts).where(eq(contacts.email, email)).limit(1);
  if (!raceWinner) throw new Error(`Failed to upsert contact for ${email}`);
  return raceWinner.id;
}
