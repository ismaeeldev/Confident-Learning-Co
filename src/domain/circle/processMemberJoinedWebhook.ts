import "server-only";
import { z } from "zod";
import { eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import { contacts } from "@/db/schema";
import { enqueueIntegrationJob } from "@/lib/integrationJobs";
import { logger } from "@/lib/logger";
import { KIT_TAGS } from "@/config/canon";

type Database = NeonHttpDatabase<typeof schema>;

export type ProcessMemberJoinedResult =
  | { outcome: "invalid_payload" }
  | { outcome: "unknown_member"; circleMemberId: string }
  | { outcome: "queued"; contactId: string };

/**
 * Handles Circle's "Send to webhook" payload for Workflow 2 (member joins
 * the Inside the Loop paywall/access group). Circle has no native
 * Kit/ConvertKit action on this plan (confirmed by inspecting every
 * available Workflow action type), so this webhook is the documented
 * fallback: Circle calls our own site, and we call Kit's API ourselves.
 *
 * Confirmed against a real Circle webhook test send (2026-08-11) — the
 * payload carries only numeric IDs, no email:
 *   { type: "access_groups_added", data: { community_id, community_member_id, access_group_id } }
 *
 * Every member who reaches this access group already came through the
 * Guide purchase first (per docs/02-CanonicalDecisions.md — "no joining
 * without the Guide"), so their community_member_id should already be
 * stored on contacts.circleMemberId from that earlier
 * circle.provisionGuideAccess job. We look up by that match rather than by
 * email, since email isn't in this payload at all.
 */
const circleWebhookPayloadSchema = z.object({
  type: z.string(),
  data: z.object({
    community_id: z.union([z.string(), z.number()]),
    community_member_id: z.union([z.string(), z.number()]),
    access_group_id: z.union([z.string(), z.number()]),
  }),
});

export async function processMemberJoinedWebhook(
  db: Database,
  rawPayload: unknown,
): Promise<ProcessMemberJoinedResult> {
  const parsed = circleWebhookPayloadSchema.safeParse(rawPayload);
  if (!parsed.success) {
    logger.error("Circle member-joined webhook payload did not match the expected shape", {
      provider: "circle",
      action: "webhook.receive",
      errorCode: "invalid_payload",
    });
    return { outcome: "invalid_payload" };
  }

  const circleMemberId = String(parsed.data.data.community_member_id);

  const [contact] = await db
    .select({ id: contacts.id })
    .from(contacts)
    .where(eq(contacts.circleMemberId, circleMemberId))
    .limit(1);

  if (!contact) {
    // A member reached the paywall without an internal contact record
    // pointing at this Circle member id — most likely someone Adam added
    // manually in Circle rather than through the Guide purchase flow.
    // Nothing to tag automatically; needs a human to reconcile.
    logger.error("Circle member-joined webhook: no contact found for this Circle member id", {
      provider: "circle",
      action: "webhook.receive",
      errorCode: "unknown_member",
    });
    return { outcome: "unknown_member", circleMemberId };
  }

  await enqueueIntegrationJob(db, {
    provider: "kit",
    action: "kit.applyMembershipTag",
    contactId: contact.id,
    input: {
      applyTags: [KIT_TAGS.memberInsideTheLoop],
      removeTags: [KIT_TAGS.ilLapsed],
    },
  });

  return { outcome: "queued", contactId: contact.id };
}
