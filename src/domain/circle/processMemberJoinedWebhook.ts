import "server-only";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import { contacts, accessGrants } from "@/db/schema";
import { enqueueIntegrationJob } from "@/lib/integrationJobs";
import { logger } from "@/lib/logger";
import { KIT_TAGS } from "@/config/canon";

type Database = NeonHttpDatabase<typeof schema>;

export type ProcessCircleAccessEventResult =
  | { outcome: "invalid_payload" }
  | { outcome: "unrecognized_event_type"; eventType: string }
  | { outcome: "unknown_member"; circleMemberId: string }
  | { outcome: "queued"; contactId: string };

/**
 * Handles Circle's "Send to webhook" payloads for both membership
 * workflows sharing this one endpoint:
 * - Workflow 2 ("Member tag back to Kit"): member joins the Inside the
 *   Loop paywall/access group — event type "access_groups_added".
 * - Workflow 3 ("Member removed from Kit" — Step 9): member's access is
 *   removed, e.g. their card-required trial wasn't kept or they cancelled
 *   — event type "access_groups_removed".
 *
 * Circle has no native Kit/ConvertKit action on this plan (confirmed by
 * inspecting every available Workflow action type), so this webhook is
 * the documented fallback for both directions.
 *
 * Confirmed against a real Circle webhook test send (2026-08-11) — the
 * "added" payload carries only numeric IDs, no email:
 *   { type: "access_groups_added", data: { community_id, community_member_id, access_group_id } }
 * The "removed" event is assumed to share the same shape with
 * type: "access_groups_removed" (Circle's own naming convention for the
 * mirror event) — ASSUMPTION / DEVIATION, flag for a real test send once
 * Workflow 3 is built, same as "added" was verified.
 *
 * Every member who reaches this access group already came through the
 * Guide purchase first (per docs/02-CanonicalDecisions.md — "no joining
 * without the Guide"), so their community_member_id should already be
 * stored on contacts.circleMemberId from the circle.provisionGuideAccess
 * job. Both directions look up by that match rather than by email, since
 * email isn't in this payload at all.
 */
const circleWebhookPayloadSchema = z.object({
  type: z.string(),
  data: z.object({
    community_id: z.union([z.string(), z.number()]),
    community_member_id: z.union([z.string(), z.number()]),
    access_group_id: z.union([z.string(), z.number()]),
  }),
});

async function findContactByCircleMemberId(db: Database, circleMemberId: string) {
  const [contact] = await db
    .select({ id: contacts.id })
    .from(contacts)
    .where(eq(contacts.circleMemberId, circleMemberId))
    .limit(1);
  return contact ?? null;
}

/** Dispatches a raw Circle webhook payload to the correct handler by event type. */
export async function processCircleAccessEvent(
  db: Database,
  rawPayload: unknown,
): Promise<ProcessCircleAccessEventResult> {
  const parsed = circleWebhookPayloadSchema.safeParse(rawPayload);
  if (!parsed.success) {
    logger.error("Circle webhook payload did not match the expected shape", {
      provider: "circle",
      action: "webhook.receive",
      errorCode: "invalid_payload",
    });
    return { outcome: "invalid_payload" };
  }

  switch (parsed.data.type) {
    case "access_groups_added":
      return handleMemberJoined(db, parsed.data.data.community_member_id);
    case "access_groups_removed":
      return handleMemberRemoved(db, parsed.data.data.community_member_id);
    default:
      logger.warn("Circle webhook: unrecognized event type, ignoring", {
        provider: "circle",
        action: "webhook.receive",
      });
      return { outcome: "unrecognized_event_type", eventType: parsed.data.type };
  }
}

async function handleMemberJoined(
  db: Database,
  rawMemberId: string | number,
): Promise<ProcessCircleAccessEventResult> {
  const circleMemberId = String(rawMemberId);
  const contact = await findContactByCircleMemberId(db, circleMemberId);

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

async function handleMemberRemoved(
  db: Database,
  rawMemberId: string | number,
): Promise<ProcessCircleAccessEventResult> {
  const circleMemberId = String(rawMemberId);
  const contact = await findContactByCircleMemberId(db, circleMemberId);

  if (!contact) {
    logger.error("Circle member-removed webhook: no contact found for this Circle member id", {
      provider: "circle",
      action: "webhook.receive",
      errorCode: "unknown_member",
    });
    return { outcome: "unknown_member", circleMemberId };
  }

  // Per DEC-005, cancellation is immediate — Circle has already revoked
  // the member's own access by the time this event fires. This just
  // brings our own records and Kit's tags in line with that reality; it
  // never itself decides to revoke anything.
  await db
    .update(accessGrants)
    .set({ status: "expired", revokedAt: new Date() })
    .where(and(eq(accessGrants.contactId, contact.id), eq(accessGrants.status, "active")));

  await enqueueIntegrationJob(db, {
    provider: "kit",
    action: "kit.applyMembershipTag",
    contactId: contact.id,
    input: {
      applyTags: [KIT_TAGS.ilLapsed],
      removeTags: [KIT_TAGS.memberInsideTheLoop],
    },
  });

  return { outcome: "queued", contactId: contact.id };
}
