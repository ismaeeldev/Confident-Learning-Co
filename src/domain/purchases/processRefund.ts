import "server-only";
import { and, eq, inArray } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import { purchases, accessGrants, integrationJobs, auditLog, contacts } from "@/db/schema";
import type { CommunityProvider } from "@/integrations/circle/types";
import { sendTransactionalEmail } from "@/lib/email";
import { logger } from "@/lib/logger";

type Database = NeonHttpDatabase<typeof schema>;

export interface RefundInput {
  stripePaymentIntentId: string;
  amountRefunded: number;
  currency: string;
  fullyRefunded: boolean;
}

export type ProcessRefundResult =
  | { outcome: "no_matching_purchase" }
  | { outcome: "not_fully_refunded" }
  | { outcome: "already_refunded"; purchaseId: string }
  | { outcome: "revoked"; purchaseId: string };

/**
 * Handles a Stripe `charge.refunded` event — R5's "on refund, access is
 * removed immediately" (Phase 5) and Build Change Request 01's
 * "cancellation during the wait removes the pending download and cancels
 * the scheduled release" (Phase 6), both closed by the same handler since
 * they're the same underlying event.
 *
 * Scoped to the *initial* one-time payment matched by
 * `purchases.stripePaymentIntentId` — this covers a Guide refund, a pack
 * refund, and a first-month membership refund (all genuine one-time
 * PaymentIntents at checkout). A refund on a *later* recurring membership
 * invoice is a different case, already covered by
 * `handleSubscriptionDeleted` (subscription lifecycle), not this path.
 */
export async function processRefund(
  db: Database,
  community: CommunityProvider,
  input: RefundInput,
): Promise<ProcessRefundResult> {
  if (!input.fullyRefunded) {
    // A partial refund doesn't revoke access — matches R5's "proportionate
    // refund" cases (e.g. mid-month membership cancellation), which are
    // handled by the cancellation flow itself, not by this webhook.
    return { outcome: "not_fully_refunded" };
  }

  const [purchase] = await db
    .select({ id: purchases.id, contactId: purchases.contactId, status: purchases.status })
    .from(purchases)
    .where(eq(purchases.stripePaymentIntentId, input.stripePaymentIntentId))
    .limit(1);

  if (!purchase) {
    logger.warn("charge.refunded for a payment intent with no matching purchase", {
      provider: "stripe",
      action: "processRefund",
    });
    return { outcome: "no_matching_purchase" };
  }

  if (purchase.status === "refunded") {
    return { outcome: "already_refunded", purchaseId: purchase.id };
  }

  await db
    .update(purchases)
    .set({ status: "refunded", refundedAt: new Date() })
    .where(eq(purchases.id, purchase.id));

  // Cancel any not-yet-run Kit/Circle jobs for this purchase — this is the
  // actual mechanism behind "cancels the scheduled release": a held
  // (declined-waiver) download that's refunded before its 14 days pass
  // must never fire its delivery job at all.
  await db
    .update(integrationJobs)
    .set({ status: "cancelled" })
    .where(
      and(eq(integrationJobs.purchaseId, purchase.id), inArray(integrationJobs.status, ["queued", "retrying"])),
    );

  // Revoke every grant tied to this purchase — active (already provisioned)
  // or pending (still held, never yet provisioned) both need to stop.
  const grants = await db
    .select({ id: accessGrants.id, circleMemberId: accessGrants.circleMemberId, circleSpaceGroupId: accessGrants.circleSpaceGroupId, status: accessGrants.status })
    .from(accessGrants)
    .where(and(eq(accessGrants.purchaseId, purchase.id), inArray(accessGrants.status, ["active", "pending"])));

  for (const grant of grants) {
    let outcome: "revoked" | "revoke_failed" = "revoked";
    if (grant.circleMemberId) {
      try {
        await community.revokeAccess({ memberId: grant.circleMemberId, spaceGroupId: grant.circleSpaceGroupId });
      } catch (error) {
        outcome = "revoke_failed";
        logger.error("Failed to revoke Circle access for a refunded purchase", {
          provider: "circle",
          action: "processRefund",
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
      before: { status: grant.status },
      after: { status: "revoked", trigger: "refund", outcome },
    });
  }

  // Build Change Request 01, §4.3: "Confirm the cancellation and the
  // refund by email." Draft copy — not client-supplied verbatim wording,
  // flag before launch.
  const [contact] = await db.select({ email: contacts.email }).from(contacts).where(eq(contacts.id, purchase.contactId)).limit(1);
  if (contact) {
    await sendTransactionalEmail({
      to: contact.email,
      subject: "Your cancellation and refund are confirmed",
      text: `We've cancelled your order and refunded your payment in full.\n\nYou should see the refund on your statement within a few days, using the same payment method you used to pay. If access had already started, it's now been switched off.\n\nIf this wasn't you, or you have any questions, reply to this email or contact us at complaints@theconfidentlearningco.org.`,
    }).catch((error) => {
      logger.error("Failed to send the refund confirmation email", {
        provider: "internal",
        action: "processRefund.confirmationEmail",
        safeErrorMessage: error instanceof Error ? error.message : "unknown error",
      });
    });
  }

  return { outcome: "revoked", purchaseId: purchase.id };
}
