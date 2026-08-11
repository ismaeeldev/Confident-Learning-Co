import "server-only";
import { and, eq, lte } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import {
  integrationJobs,
  type integrationJobProviderEnum,
  type integrationJobStatusEnum,
} from "@/db/schema";
import * as schema from "@/db/schema";

type Provider = (typeof integrationJobProviderEnum.enumValues)[number];
type Status = (typeof integrationJobStatusEnum.enumValues)[number];
type Database = NeonHttpDatabase<typeof schema>;

export interface EnqueueJobInput {
  provider: Provider;
  action: string;
  input: Record<string, unknown>;
  contactId?: string;
  purchaseId?: string;
  accessGrantId?: string;
  subscriptionId?: string;
  maxAttempts?: number;
  runAfter?: Date;
}

/** Enqueues a retryable side-effect job (e.g. "kit.applyTag") for later processing. */
export async function enqueueIntegrationJob(
  db: Database,
  input: EnqueueJobInput,
): Promise<string> {
  const [row] = await db
    .insert(integrationJobs)
    .values({
      provider: input.provider,
      action: input.action,
      input: input.input,
      contactId: input.contactId,
      purchaseId: input.purchaseId,
      accessGrantId: input.accessGrantId,
      subscriptionId: input.subscriptionId,
      maxAttempts: input.maxAttempts ?? 8,
      runAfter: input.runAfter ?? new Date(),
      status: "queued",
    })
    .returning({ id: integrationJobs.id });

  if (!row) throw new Error("Failed to enqueue integration job");
  return row.id;
}

export interface ClaimedJob {
  id: string;
  provider: Provider;
  action: string;
  input: Record<string, unknown>;
  attempts: number;
  maxAttempts: number;
}

/**
 * Claims up to `limit` due jobs (status queued/retrying, runAfter <= now)
 * for a given provider, marking them "running" so a concurrent worker run
 * can't double-process the same job. Callers must call completeJob or
 * failJob on every claimed job.
 */
export async function claimDueJobs(
  db: Database,
  provider: Provider,
  limit = 20,
): Promise<ClaimedJob[]> {
  const due = await db
    .select()
    .from(integrationJobs)
    .where(
      and(
        eq(integrationJobs.provider, provider),
        lte(integrationJobs.runAfter, new Date()),
      ),
    )
    .limit(limit);

  const claimable = due.filter((job) => job.status === "queued" || job.status === "retrying");
  const claimed: ClaimedJob[] = [];

  for (const job of claimable) {
    const [updated] = await db
      .update(integrationJobs)
      .set({ status: "running", attempts: job.attempts + 1 })
      .where(and(eq(integrationJobs.id, job.id), eq(integrationJobs.status, job.status)))
      .returning({ id: integrationJobs.id, attempts: integrationJobs.attempts });

    // Row may have already been claimed by a concurrent worker between the
    // select and this update — skip it rather than double-process.
    if (!updated) continue;

    claimed.push({
      id: job.id,
      provider: job.provider,
      action: job.action,
      input: job.input as Record<string, unknown>,
      attempts: updated.attempts,
      maxAttempts: job.maxAttempts,
    });
  }

  return claimed;
}

export async function completeIntegrationJob(db: Database, jobId: string): Promise<void> {
  await db
    .update(integrationJobs)
    .set({ status: "succeeded", completedAt: new Date() })
    .where(eq(integrationJobs.id, jobId));
}

/**
 * Marks a job attempt failed. Schedules a retry with exponential backoff
 * (capped at 1 hour) unless attempts has reached maxAttempts, in which
 * case the job is marked "dead" and needs manual/alerted attention.
 */
export async function failIntegrationJob(
  db: Database,
  job: { id: string; attempts: number; maxAttempts: number },
  error: { code: string; message: string },
): Promise<Status> {
  const exhausted = job.attempts >= job.maxAttempts;
  const nextStatus: Status = exhausted ? "dead" : "retrying";
  const backoffMs = Math.min(2 ** job.attempts * 60_000, 60 * 60_000);

  await db
    .update(integrationJobs)
    .set({
      status: nextStatus,
      lastErrorCode: error.code,
      lastErrorMessage: error.message,
      runAfter: new Date(Date.now() + backoffMs),
    })
    .where(eq(integrationJobs.id, job.id));

  return nextStatus;
}
