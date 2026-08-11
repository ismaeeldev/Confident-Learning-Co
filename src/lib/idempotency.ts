import "server-only";
import { and, eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { webhookEvents, type webhookProviderEnum } from "@/db/schema";
import * as schema from "@/db/schema";

type Provider = (typeof webhookProviderEnum.enumValues)[number];
type Database = NeonHttpDatabase<typeof schema>;

export type ClaimResult =
  | { claimed: true; eventRowId: string }
  | { claimed: false; reason: "duplicate" };

/**
 * Claims a webhook event for processing. Returns claimed: false when the
 * (provider, providerEventId) pair has already been received, so callers can
 * return a 2xx without repeating side effects.
 */
export async function claimWebhookEvent(
  db: Database,
  input: { provider: Provider; providerEventId: string; eventType: string },
): Promise<ClaimResult> {
  const existing = await db
    .select({ id: webhookEvents.id })
    .from(webhookEvents)
    .where(
      and(
        eq(webhookEvents.provider, input.provider),
        eq(webhookEvents.providerEventId, input.providerEventId),
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    return { claimed: false, reason: "duplicate" };
  }

  const [row] = await db
    .insert(webhookEvents)
    .values({
      provider: input.provider,
      providerEventId: input.providerEventId,
      eventType: input.eventType,
      status: "processing",
    })
    .onConflictDoNothing({ target: [webhookEvents.provider, webhookEvents.providerEventId] })
    .returning({ id: webhookEvents.id });

  if (!row) {
    return { claimed: false, reason: "duplicate" };
  }

  return { claimed: true, eventRowId: row.id };
}

export async function completeWebhookEvent(db: Database, eventRowId: string): Promise<void> {
  await db
    .update(webhookEvents)
    .set({ status: "processed", processedAt: new Date() })
    .where(eq(webhookEvents.id, eventRowId));
}

export async function failWebhookEvent(
  db: Database,
  eventRowId: string,
  error: { code: string; message: string },
): Promise<void> {
  await db
    .update(webhookEvents)
    .set({
      status: "failed",
      lastErrorCode: error.code,
      lastErrorMessage: error.message,
    })
    .where(eq(webhookEvents.id, eventRowId));
}
