import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { getCommunityProvider } from "@/lib/providers";
import { reconcileSpaceGroupAccess } from "@/domain/circle/reconciliation";

/**
 * Daily reconciliation: compares our internal accessGrants records
 * against Circle's actual membership state for the Inside the Loop space
 * group, and logs any discrepancies. Deliberately read-only — it never
 * auto-fixes anything itself. A "missing" or "extra" finding means either
 * the join/removal webhook was missed, or someone's access was changed
 * manually in Circle — both need a human to review before acting (see
 * DEC-007: refund/dispute access is manual review, not automatic).
 * Triggered on a schedule by Vercel Cron (see vercel.json), authenticated
 * the same way as /api/cron/process-integration-jobs.
 */
export async function GET(request: Request) {
  if (!env.CRON_SECRET) {
    logger.error("Reconcile cron called but CRON_SECRET is not configured", {
      provider: "internal",
      action: "cron.reconcile",
    });
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!env.CIRCLE_INSIDE_LOOP_SPACE_GROUP_ID) {
    logger.error("Reconcile cron called but CIRCLE_INSIDE_LOOP_SPACE_GROUP_ID is not configured", {
      provider: "internal",
      action: "cron.reconcile",
    });
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const provider = getCommunityProvider();
  const report = await reconcileSpaceGroupAccess(db, provider, env.CIRCLE_INSIDE_LOOP_SPACE_GROUP_ID);

  if (report.findings.length > 0) {
    logger.error("Reconciliation found access discrepancies — needs manual review", {
      provider: "circle",
      action: "cron.reconcile",
      errorCode: "reconciliation_findings",
      status: `${report.findings.length} findings out of ${report.checked} checked`,
    });
  } else {
    logger.info("Reconciliation found no discrepancies", {
      provider: "circle",
      action: "cron.reconcile",
      status: `${report.checked} checked`,
    });
  }

  return NextResponse.json({ checked: report.checked, findings: report.findings }, { status: 200 });
}
