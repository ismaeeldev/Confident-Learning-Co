import "server-only";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import { auditLog } from "@/db/schema";
import { FIT_CHECK_PROCESSING_NOTICE_VERSION } from "@/config/canon";

type Database = NeonHttpDatabase<typeof schema>;

/**
 * Records the Fit Check's required acknowledgement tick (Phase 11, Annexe
 * A/B §8.1/§8.2) — proof that this member saw this exact wording on this
 * date. Reuses `auditLog` rather than a new table (top-level §2's
 * schema-reuse mapping): `actorType: "system"` records a member-initiated
 * event server-side, `action: "fit_check_acknowledged"` is the trigger,
 * `after.noticeVersion` is what makes the record legally meaningful —
 * there is no "false"/declined case, since the member cannot continue
 * without ticking.
 */
export async function recordFitCheckAcknowledgement(db: Database, contactId: string): Promise<void> {
  await db.insert(auditLog).values({
    actorType: "system",
    actorId: contactId,
    action: "fit_check_acknowledged",
    entityType: "contact",
    entityId: contactId,
    after: { acknowledged: true, noticeVersion: FIT_CHECK_PROCESSING_NOTICE_VERSION },
  });
}
