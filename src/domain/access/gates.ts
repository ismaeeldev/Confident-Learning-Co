import "server-only";
import { and, eq, gt, isNull, or } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import { accessGrants, purchases } from "@/db/schema";

type Database = NeonHttpDatabase<typeof schema>;

/**
 * Membership gating (Phase 4 of the build guide — "gates fail closed").
 * Queries the existing `purchases`/`accessGrants` tables directly rather
 * than a new entitlement table, per the guide's "Reuse first" note.
 */

/** True only if the contact has a paid (not refunded/disputed/pending) Guide purchase on record. */
export async function isGuideOwner(db: Database, contactId: string): Promise<boolean> {
  const [purchase] = await db
    .select({ id: purchases.id })
    .from(purchases)
    .where(and(eq(purchases.contactId, contactId), eq(purchases.kind, "guide"), eq(purchases.status, "paid")))
    .limit(1);
  return !!purchase;
}

/**
 * True only if the contact has a currently-active access grant (the
 * included 30-day period or a paid membership) that hasn't expired.
 * `expiresAt IS NULL` is treated as "no expiry set" (e.g. an ongoing paid
 * membership), not as "never expires by omission" — the status column,
 * not the expiry, is the source of truth for whether a grant is active;
 * this only additionally excludes a grant whose expiry has already passed
 * but hasn't been swept to "expired" yet.
 */
export async function hasActiveMembership(db: Database, contactId: string): Promise<boolean> {
  const now = new Date();
  const [grant] = await db
    .select({ id: accessGrants.id })
    .from(accessGrants)
    .where(
      and(
        eq(accessGrants.contactId, contactId),
        eq(accessGrants.status, "active"),
        or(isNull(accessGrants.expiresAt), gt(accessGrants.expiresAt, now)),
      ),
    )
    .limit(1);
  return !!grant;
}
