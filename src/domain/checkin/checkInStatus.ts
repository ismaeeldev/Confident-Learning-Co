import "server-only";
import { and, eq, sql } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import { accessGrants, formSubmissions } from "@/db/schema";

type Database = NeonHttpDatabase<typeof schema>;

export const CHECKIN_DAYS = [14, 30] as const;
export type CheckInDay = (typeof CHECKIN_DAYS)[number];

export interface CheckInStatus {
  /** null if this member has no membership grant to measure from, or every check-in due so far is already submitted. */
  dueDay: CheckInDay | null;
}

/**
 * Phase 12 — Day 14 / Day 30 member check-ins. Measured from the
 * membership access grant's `startsAt` (the real join date), not the
 * Guide purchase date — a member who joined weeks after buying the Guide
 * should be checked in on relative to when membership actually began.
 * Draft content only (client hasn't supplied exact wording) — see
 * MemberCheckInForm.tsx for the flagged placeholder copy.
 */
export async function getDueCheckIn(db: Database, contactId: string): Promise<CheckInStatus> {
  const [grant] = await db
    .select({ startsAt: accessGrants.startsAt })
    .from(accessGrants)
    .where(and(eq(accessGrants.contactId, contactId), eq(accessGrants.kind, "paid_membership")))
    .orderBy(accessGrants.startsAt)
    .limit(1);

  if (!grant) return { dueDay: null };

  const daysSinceJoin = Math.floor((Date.now() - grant.startsAt.getTime()) / (24 * 60 * 60 * 1000));

  // contactId is stored inside payload (not the email column, which holds
  // a real email address elsewhere) — same lookup pattern as
  // attachEmailToPurchaseConsent's JSONB query.
  const submitted = await db
    .select({ day: sql<number>`(${formSubmissions.payload}->>'day')::int` })
    .from(formSubmissions)
    .where(
      and(
        eq(formSubmissions.kind, "member_checkin"),
        sql`${formSubmissions.payload}->>'contactId' = ${contactId}`,
      ),
    );
  const submittedDays = new Set(submitted.map((row) => row.day));

  for (const day of CHECKIN_DAYS) {
    if (daysSinceJoin >= day && !submittedDays.has(day)) {
      return { dueDay: day };
    }
  }

  return { dueDay: null };
}
