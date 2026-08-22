import "server-only";
import { and, eq, gt } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import { accessGrants, integrationJobs } from "@/db/schema";
import { recordPurchaseConsent, attachEmailToPurchaseConsent } from "./recordPurchaseConsent";
import { IMMUTABLE_RULES } from "@/config/canon";

type Database = NeonHttpDatabase<typeof schema>;

export interface PendingDownload {
  accessGrantId: string;
  purchaseId: string;
  releaseDate: Date;
}

/**
 * Build Change Request 01: "The member account must show the pending
 * download and its release date, so a buyer who forgets does not think
 * the purchase failed." A grant is "pending download" when it's an
 * `included_30_day` grant still in `pending` status with a `startsAt` in
 * the future — the exact state `completeGuidePurchase` leaves a
 * declined-waiver purchase in.
 */
export async function getPendingDownload(db: Database, contactId: string): Promise<PendingDownload | null> {
  const [grant] = await db
    .select({ id: accessGrants.id, purchaseId: accessGrants.purchaseId, startsAt: accessGrants.startsAt })
    .from(accessGrants)
    .where(
      and(
        eq(accessGrants.contactId, contactId),
        eq(accessGrants.kind, "included_30_day"),
        eq(accessGrants.status, "pending"),
        gt(accessGrants.startsAt, new Date()),
      ),
    )
    .limit(1);

  if (!grant || !grant.purchaseId) return null;
  return { accessGrantId: grant.id, purchaseId: grant.purchaseId, releaseDate: grant.startsAt };
}

/**
 * Self-release (Build Change Request 01, §4.2): brings the held Kit-tag
 * and Circle-provisioning jobs forward to now, and records a **second**,
 * separate consent row — the original declined record is never
 * overwritten or amended, exactly as specified. Two dated entries, in
 * order.
 */
export async function releaseDownloadNow(
  db: Database,
  contactId: string,
  email: string,
  accessGrantId: string,
): Promise<void> {
  const now = new Date();
  // Bug fix: the 30-day included-access window must be recomputed from
  // the new (real) start, not left at the value completeGuidePurchase
  // originally set from the *held* start (purchase + 14-day hold). Left
  // untouched, an early self-release silently grants extra free days —
  // up to nearly 14 extra if released on day 0 of the hold — since
  // expiresAt would still be 30 days after the *original* delayed start,
  // not 30 days after access genuinely begins now.
  const expiresAt = new Date(now.getTime() + IMMUTABLE_RULES.includedAccessDays * 24 * 60 * 60 * 1000);

  await db
    .update(accessGrants)
    .set({ startsAt: now, expiresAt })
    .where(and(eq(accessGrants.id, accessGrantId), eq(accessGrants.contactId, contactId)));

  await db
    .update(integrationJobs)
    .set({ runAfter: now })
    .where(eq(integrationJobs.accessGrantId, accessGrantId));

  // recordPurchaseConsent's second param is named for its usual role (a
  // Stripe Checkout Session id) — here it's just reused as a unique
  // correlation key for this self-release event, since there's no
  // checkout session involved. Still unique, still queryable the same way.
  await recordPurchaseConsent(db, `self-release:${accessGrantId}:${now.toISOString()}`, {
    productKey: "guide",
    termsAgreed: true,
    immediateDelivery: true,
  });
  // recordPurchaseConsent writes email as a placeholder (it's designed for
  // pre-payment consent, where the real email isn't known yet) — this is a
  // post-payment event with a known email, so backfill it immediately
  // rather than waiting on a webhook that will never fire for this row.
  await attachEmailToPurchaseConsent(db, `self-release:${accessGrantId}:${now.toISOString()}`, email);
}
