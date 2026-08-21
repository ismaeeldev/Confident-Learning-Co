import "server-only";
import { and, eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import { subscriptions, accessGrants, auditLog } from "@/db/schema";
import type { CommunityProvider } from "@/integrations/circle/types";
import { enqueueIntegrationJob } from "@/lib/integrationJobs";
import { logger } from "@/lib/logger";
import { KIT_TAGS } from "@/config/canon";

type Database = NeonHttpDatabase<typeof schema>;

export interface SubscriptionUpdatedInput {
  stripeSubscriptionId: string;
  status: (typeof schema.subscriptionStatusEnum.enumValues)[number];
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  canceledAt: Date | null;
}

/**
 * Handles `customer.subscription.updated` — keeps our record of the
 * subscription's period/cancellation state in sync with Stripe. This is
 * also how R5's "cancellation continues to the end of the paid period" is
 * satisfied: when a member cancels, Stripe sets `cancel_at_period_end`
 * true but the subscription stays active until the period genuinely ends
 * — access is not touched here, only the flag is recorded. The actual
 * revocation happens in handleSubscriptionDeleted, fired by Stripe exactly
 * when Stripe itself ends the subscription.
 */
export async function handleSubscriptionUpdated(
  db: Database,
  input: SubscriptionUpdatedInput,
): Promise<void> {
  await db
    .update(subscriptions)
    .set({
      status: input.status,
      currentPeriodStart: input.currentPeriodStart,
      currentPeriodEnd: input.currentPeriodEnd,
      cancelAtPeriodEnd: input.cancelAtPeriodEnd,
      canceledAt: input.canceledAt,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.stripeSubscriptionId, input.stripeSubscriptionId));
}

export interface SubscriptionDeletedInput {
  stripeSubscriptionId: string;
  /** Stripe's `cancellation_details.reason` where available — the R5 "trigger" for the audit record. */
  reason: string | null;
}

/**
 * Handles `customer.subscription.deleted` — Stripe fires this exactly when
 * a subscription truly ends, whether that's the natural end of a
 * cancelled-but-still-active period (R5's "continues to the end of the
 * paid period, then is revoked automatically") or an immediate end (e.g.
 * payment failure exhausting retries). Revokes the matching Circle access
 * grant, deactivating the Circle account only — never deleting it or its
 * content (`revokeAccess` is already scoped to one space group). Every
 * revocation writes to `auditLog` with the date, trigger, and outcome, per
 * R5's explicit requirement.
 *
 * Refund-triggered revocation (R5's other immediate-revoke case) is
 * handled separately, from the `charge.refunded` event — this function is
 * the subscription-lifecycle path only.
 */
export async function handleSubscriptionDeleted(
  db: Database,
  community: CommunityProvider,
  input: SubscriptionDeletedInput,
): Promise<void> {
  const [subscription] = await db
    .select({ id: subscriptions.id, contactId: subscriptions.contactId })
    .from(subscriptions)
    .where(eq(subscriptions.stripeSubscriptionId, input.stripeSubscriptionId))
    .limit(1);

  if (!subscription) {
    logger.error("customer.subscription.deleted for a subscription we have no record of", {
      provider: "stripe",
      action: "handleSubscriptionDeleted",
    });
    return;
  }

  await db
    .update(subscriptions)
    .set({ status: "canceled", endedAt: new Date(), updatedAt: new Date() })
    .where(eq(subscriptions.id, subscription.id));

  const [grant] = await db
    .select({ id: accessGrants.id, circleMemberId: accessGrants.circleMemberId, circleSpaceGroupId: accessGrants.circleSpaceGroupId })
    .from(accessGrants)
    .where(
      and(
        eq(accessGrants.contactId, subscription.contactId),
        eq(accessGrants.kind, "paid_membership"),
        eq(accessGrants.status, "active"),
      ),
    )
    .limit(1);

  if (!grant) {
    // Nothing active to revoke — most likely the invitation never
    // succeeded in the first place (still "failed"/"pending"). Logged, not
    // silently ignored, since it's still worth a human's attention.
    logger.warn("Subscription ended but no active access grant was found to revoke", {
      provider: "internal",
      action: "handleSubscriptionDeleted",
    });
    return;
  }

  let revokeOutcome: "revoked" | "revoke_failed" = "revoked";
  if (grant.circleMemberId) {
    try {
      await community.revokeAccess({ memberId: grant.circleMemberId, spaceGroupId: grant.circleSpaceGroupId });
    } catch (error) {
      // The DB grant is still marked revoked below regardless — Circle's
      // own side falling out of sync is exactly what the weekly
      // reconciliation report exists to catch and surface.
      revokeOutcome = "revoke_failed";
      logger.error("Failed to revoke Circle access for an ended subscription", {
        provider: "circle",
        action: "handleSubscriptionDeleted",
        safeErrorMessage: error instanceof Error ? error.message : "unknown error",
      });
    }
  }

  await db
    .update(accessGrants)
    .set({ status: "revoked", revokedAt: new Date() })
    .where(eq(accessGrants.id, grant.id));

  await db.insert(auditLog).values({
    actorType: "provider",
    actorId: "stripe",
    action: "membership.revoked",
    entityType: "access_grant",
    entityId: grant.id,
    before: { status: "active" },
    after: { status: "revoked", trigger: input.reason ?? "subscription_ended", outcome: revokeOutcome },
  });

  await enqueueIntegrationJob(db, {
    provider: "kit",
    action: "kit.applyMembershipTag",
    contactId: subscription.contactId,
    input: { applyTags: [KIT_TAGS.ilLapsed], removeTags: [KIT_TAGS.memberInsideTheLoop] },
  });
}
