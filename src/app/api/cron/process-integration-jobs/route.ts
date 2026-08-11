import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { getCommunityProvider, getEmailProvider } from "@/lib/providers";
import { claimDueJobs, completeIntegrationJob, failIntegrationJob } from "@/lib/integrationJobs";
import { processIntegrationJob } from "@/domain/jobs/processIntegrationJob";

const JOBS_PER_PROVIDER_PER_RUN = 20;

/**
 * Processes due integration_jobs rows (Kit tag application/fulfilment,
 * Circle access provisioning) queued by the Stripe and Circle webhooks.
 * Triggered on a schedule by Vercel Cron (see vercel.json), authenticated
 * via CRON_SECRET the same way Vercel's own docs recommend. Can also be
 * hit manually with the same header for local testing.
 */
export async function GET(request: Request) {
  if (!env.CRON_SECRET) {
    logger.error("Job processor called but CRON_SECRET is not configured", {
      provider: "internal",
      action: "cron.processIntegrationJobs",
    });
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const providers = { email: getEmailProvider(), community: getCommunityProvider() };
  const summary = { kit: { succeeded: 0, failed: 0 }, circle: { succeeded: 0, failed: 0 } };

  for (const providerName of ["kit", "circle"] as const) {
    const jobs = await claimDueJobs(db, providerName, JOBS_PER_PROVIDER_PER_RUN);

    for (const job of jobs) {
      try {
        await processIntegrationJob(db, providers, job);
        await completeIntegrationJob(db, job.id);
        summary[providerName].succeeded += 1;
      } catch (error) {
        const message = error instanceof Error ? error.message : "unknown error";
        logger.error("Integration job failed", {
          provider: providerName,
          action: job.action,
          attempt: job.attempts,
          safeErrorMessage: message,
        });
        const nextStatus = await failIntegrationJob(db, job, { code: "processing_error", message });
        summary[providerName].failed += 1;
        if (nextStatus === "dead" && env.ADMIN_ALERT_EMAIL) {
          // Alerting itself (actually sending an email) is out of scope
          // here — this log line is the hook a real alerting pipeline
          // (Sentry, a Slack webhook, etc.) would watch for.
          logger.error("Integration job exhausted all retries and is now dead", {
            provider: providerName,
            action: job.action,
            errorCode: "job_dead",
          });
        }
      }
    }
  }

  return NextResponse.json({ processed: summary }, { status: 200 });
}
