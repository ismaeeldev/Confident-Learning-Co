import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { getCommunityProvider } from "@/lib/providers";
import { reconcileSpaceGroupAccess, type ReconciliationReport } from "@/domain/circle/reconciliation";
import { sendAdminNotificationEmail } from "@/lib/email";

/**
 * Builds the plain-text weekly reconciliation report. Draft copy — the
 * client hasn't supplied exact wording for this report, only the
 * requirement that it "actually reach them automatically" rather than
 * just being logged (see V2-BUILD-REQUIREMENTS §5). Flag before launch
 * if they want different formatting/content.
 */
function buildReconciliationReportEmail(report: ReconciliationReport, spaceGroupId: string) {
  const subject =
    report.findings.length > 0
      ? `Weekly Circle access report: ${report.findings.length} discrepancies found`
      : "Weekly Circle access report: no discrepancies found";

  const lines = [
    `Weekly reconciliation report for Inside the Loop (space group ${spaceGroupId}).`,
    "",
    `Active access grants checked: ${report.checked}`,
    `Discrepancies found: ${report.findings.length}`,
    "",
  ];

  if (report.findings.length > 0) {
    lines.push("This is a read-only check — nothing has been changed automatically. Each finding below needs manual review:", "");
    for (const finding of report.findings) {
      lines.push(
        finding.kind === "missing"
          ? `- MISSING: ${finding.email} should have access but Circle doesn't show it (accessGrantId: ${finding.accessGrantId ?? "none — never provisioned"})`
          : `- EXTRA: ${finding.email} has Circle access we no longer expect for this space group`,
      );
    }
  } else {
    lines.push("Everything matches — no action needed.");
  }

  return { subject, text: lines.join("\n") };
}

/**
 * Reconciliation: compares our internal accessGrants records against
 * Circle's actual membership state for the Inside the Loop space group.
 * Deliberately read-only — it never auto-fixes anything itself. A
 * "missing" or "extra" finding means either the join/removal webhook was
 * missed, or someone's access was changed manually in Circle — both need
 * a human to review before acting (see DEC-007: refund/dispute access is
 * manual review, not automatic).
 *
 * Runs weekly per vercel.json and always emails the report to
 * ADMIN_ALERT_EMAIL (see sendAdminNotificationEmail) — logging alone was
 * not sufficient per the client's explicit requirement that this "reach
 * them automatically." Safely no-ops the email (logs only) if
 * RESEND_API_KEY/ADMIN_ALERT_EMAIL aren't configured, same stance as
 * every other email in this codebase.
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

  try {
    const email = buildReconciliationReportEmail(report, env.CIRCLE_INSIDE_LOOP_SPACE_GROUP_ID);
    await sendAdminNotificationEmail(email);
  } catch (error) {
    // Never fail the cron run over the email itself — the reconciliation
    // check already happened and is already logged; losing the email
    // notification for one run isn't a reason to also drop the report.
    logger.error("Failed to send weekly reconciliation report email", {
      provider: "internal",
      action: "cron.reconcile",
      safeErrorMessage: error instanceof Error ? error.message : "unknown error",
    });
  }

  return NextResponse.json({ checked: report.checked, findings: report.findings }, { status: 200 });
}
