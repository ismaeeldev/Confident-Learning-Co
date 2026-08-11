import "server-only";
import { eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import { contacts } from "@/db/schema";
import { enqueueIntegrationJob } from "@/lib/integrationJobs";
import { KIT_TAGS } from "@/config/canon";

type Database = NeonHttpDatabase<typeof schema>;

export type ProcessMemberJoinedResult =
  | { outcome: "missing_email" }
  | { outcome: "queued"; contactId: string };

/**
 * Handles Circle's generic "Send to webhook" payload for Workflow 2
 * (member joins the Inside the Loop paywall/access group). Circle has no
 * native Kit/ConvertKit action on this plan (confirmed by inspecting every
 * available Workflow action type), so this webhook is the documented
 * fallback: Circle calls our own site, and we call Kit's API ourselves.
 *
 * The exact payload shape from Circle's webhook action was not verified
 * against a live send at build time (ASSUMPTION / DEVIATION — flag for
 * client review). This defensively checks several plausible field paths
 * for the member's email; if none match, the caller should log the raw
 * payload once during the first real test to confirm the actual shape.
 */
export async function processMemberJoinedWebhook(
  db: Database,
  payload: Record<string, unknown>,
): Promise<ProcessMemberJoinedResult> {
  const email = extractEmail(payload);
  if (!email) {
    return { outcome: "missing_email" };
  }

  const contactId = await upsertContactByEmail(db, email);

  await enqueueIntegrationJob(db, {
    provider: "kit",
    action: "kit.applyMembershipTag",
    contactId,
    input: {
      applyTags: [KIT_TAGS.memberInsideTheLoop],
      removeTags: [KIT_TAGS.ilLapsed],
    },
  });

  return { outcome: "queued", contactId };
}

function extractEmail(payload: Record<string, unknown>): string | null {
  const candidates = [
    payload.email,
    (payload.member as { email?: string } | undefined)?.email,
    (payload.community_member as { email?: string } | undefined)?.email,
    (payload.data as { email?: string } | undefined)?.email,
    ((payload.data as { member?: { email?: string } } | undefined)?.member)?.email,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.includes("@")) {
      return candidate;
    }
  }
  return null;
}

async function upsertContactByEmail(db: Database, email: string): Promise<string> {
  const [existing] = await db.select({ id: contacts.id }).from(contacts).where(eq(contacts.email, email)).limit(1);
  if (existing) return existing.id;

  const [created] = await db
    .insert(contacts)
    .values({ email })
    .onConflictDoNothing({ target: contacts.email })
    .returning({ id: contacts.id });

  if (created) return created.id;

  const [raceWinner] = await db.select({ id: contacts.id }).from(contacts).where(eq(contacts.email, email)).limit(1);
  if (!raceWinner) throw new Error(`Failed to upsert contact for ${email}`);
  return raceWinner.id;
}
