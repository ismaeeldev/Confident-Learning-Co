import { afterAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { integrationJobs } from "@/db/schema";
import {
  claimDueJobs,
  completeIntegrationJob,
  enqueueIntegrationJob,
  failIntegrationJob,
} from "@/lib/integrationJobs";

describe("integration job queue against a real Neon connection", () => {
  const createdJobIds: string[] = [];

  afterAll(async () => {
    for (const id of createdJobIds) {
      await db.delete(integrationJobs).where(eq(integrationJobs.id, id));
    }
  });

  it("enqueues a job as queued, then claims and completes it", async () => {
    const jobId = await enqueueIntegrationJob(db, {
      provider: "kit",
      action: "kit.applyTag",
      input: { tag: "archetype-pressure", subscriberId: "42" },
    });
    createdJobIds.push(jobId);

    const [before] = await db.select().from(integrationJobs).where(eq(integrationJobs.id, jobId));
    expect(before?.status).toBe("queued");
    expect(before?.attempts).toBe(0);

    const claimed = await claimDueJobs(db, "kit", 50);
    const ours = claimed.find((job) => job.id === jobId);
    expect(ours).toBeDefined();
    expect(ours?.attempts).toBe(1);

    await completeIntegrationJob(db, jobId);

    const [after] = await db.select().from(integrationJobs).where(eq(integrationJobs.id, jobId));
    expect(after?.status).toBe("succeeded");
    expect(after?.completedAt).not.toBeNull();
  });

  it("does not let a second concurrent claim pick up an already-running job", async () => {
    const jobId = await enqueueIntegrationJob(db, {
      provider: "kit",
      action: "kit.applyTag",
      input: {},
    });
    createdJobIds.push(jobId);

    const firstClaim = await claimDueJobs(db, "kit", 50);
    const secondClaim = await claimDueJobs(db, "kit", 50);

    expect(firstClaim.some((job) => job.id === jobId)).toBe(true);
    expect(secondClaim.some((job) => job.id === jobId)).toBe(false);
  });

  it("schedules a retry with a future runAfter when attempts remain", async () => {
    const jobId = await enqueueIntegrationJob(db, {
      provider: "kit",
      action: "kit.applyTag",
      input: {},
      maxAttempts: 5,
    });
    createdJobIds.push(jobId);

    const [claimed] = await claimDueJobs(db, "kit", 50);
    expect(claimed.id).toBe(jobId);

    const nextStatus = await failIntegrationJob(
      db,
      { id: jobId, attempts: claimed.attempts, maxAttempts: 5 },
      { code: "http_503", message: "temporarily unavailable" },
    );
    expect(nextStatus).toBe("retrying");

    const [row] = await db.select().from(integrationJobs).where(eq(integrationJobs.id, jobId));
    expect(row?.status).toBe("retrying");
    expect(row?.runAfter.getTime()).toBeGreaterThan(Date.now());
    expect(row?.lastErrorCode).toBe("http_503");
  });

  it("marks a job dead once attempts reach maxAttempts", async () => {
    const jobId = await enqueueIntegrationJob(db, {
      provider: "kit",
      action: "kit.applyTag",
      input: {},
      maxAttempts: 1,
    });
    createdJobIds.push(jobId);

    const [claimed] = await claimDueJobs(db, "kit", 50);
    expect(claimed.attempts).toBe(1);

    const nextStatus = await failIntegrationJob(
      db,
      { id: jobId, attempts: claimed.attempts, maxAttempts: 1 },
      { code: "http_500", message: "server error" },
    );
    expect(nextStatus).toBe("dead");

    const [row] = await db.select().from(integrationJobs).where(eq(integrationJobs.id, jobId));
    expect(row?.status).toBe("dead");
  });
});
