import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { webhookEvents } from "@/db/schema";
import { claimWebhookEvent, completeWebhookEvent } from "@/lib/idempotency";

describe("webhook idempotency against a real Neon connection", () => {
  const providerEventId = `test-${randomUUID()}`;

  afterAll(async () => {
    await db.delete(webhookEvents).where(eq(webhookEvents.providerEventId, providerEventId));
  });

  it("claims a new event, then refuses to claim it twice", async () => {
    const first = await claimWebhookEvent(db, {
      provider: "stripe",
      providerEventId,
      eventType: "checkout.session.completed",
    });
    expect(first.claimed).toBe(true);

    const second = await claimWebhookEvent(db, {
      provider: "stripe",
      providerEventId,
      eventType: "checkout.session.completed",
    });
    expect(second.claimed).toBe(false);

    if (first.claimed) {
      await completeWebhookEvent(db, first.eventRowId);
      const [row] = await db
        .select()
        .from(webhookEvents)
        .where(eq(webhookEvents.id, first.eventRowId));
      expect(row?.status).toBe("processed");
    }
  });
});
