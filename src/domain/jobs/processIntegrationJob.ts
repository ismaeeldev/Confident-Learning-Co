import "server-only";
import { z } from "zod";
import { eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import { contacts, accessGrants } from "@/db/schema";
import type { EmailProvider } from "@/integrations/kit/types";
import type { CommunityProvider } from "@/integrations/circle/types";
import { assertTagRemovable } from "@/domain/contacts/kitTags";
import { logger } from "@/lib/logger";

type Database = NeonHttpDatabase<typeof schema>;
type Contact = typeof contacts.$inferSelect;

export interface JobProviders {
  email: EmailProvider;
  community: CommunityProvider;
}

export interface JobToProcess {
  id: string;
  action: string;
  input: Record<string, unknown>;
  contactId: string | null;
  accessGrantId: string | null;
}

const fulfilGuidePurchaseInput = z.object({ tags: z.array(z.string()).min(1) });
const provisionGuideAccessInput = z.object({ spaceGroupId: z.string().min(1) });
const applyMembershipTagInput = z.object({
  applyTags: z.array(z.string()).default([]),
  removeTags: z.array(z.string()).default([]),
});

/**
 * Dispatches one claimed integration job to the correct handler and makes
 * the real (or mock, per src/lib/providers.ts flags) provider call. Each
 * handler is idempotent-safe to re-run: applying an existing tag or
 * granting existing access is a no-op on both real providers and the
 * mocks, so a retried job after a transient failure never double-applies
 * anything user-visible.
 */
export async function processIntegrationJob(
  db: Database,
  providers: JobProviders,
  job: JobToProcess,
): Promise<void> {
  switch (job.action) {
    case "kit.fulfilGuidePurchase":
      return handleFulfilGuidePurchase(db, providers.email, job);
    case "kit.applyMembershipTag":
      return handleApplyMembershipTag(db, providers.email, job);
    case "circle.provisionGuideAccess":
      return handleProvisionGuideAccess(db, providers.community, job);
    default:
      throw new Error(`Unknown integration job action "${job.action}"`);
  }
}

async function getContactOrThrow(db: Database, contactId: string | null): Promise<Contact> {
  if (!contactId) throw new Error("Job is missing contactId");
  const [contact] = await db.select().from(contacts).where(eq(contacts.id, contactId)).limit(1);
  if (!contact) throw new Error(`Contact ${contactId} not found`);
  return contact;
}

/** Resolves (and caches on the contact row) the Kit subscriber id for a contact, so repeat jobs don't re-upsert every time. */
async function ensureKitSubscriberId(db: Database, email: EmailProvider, contact: Contact): Promise<string> {
  if (contact.kitSubscriberId) return contact.kitSubscriberId;

  const subscriber = await email.upsertSubscriber({
    email: contact.email,
    firstName: contact.firstName ?? undefined,
  });

  await db.update(contacts).set({ kitSubscriberId: subscriber.id }).where(eq(contacts.id, contact.id));
  return subscriber.id;
}

async function handleFulfilGuidePurchase(db: Database, email: EmailProvider, job: JobToProcess): Promise<void> {
  const input = fulfilGuidePurchaseInput.parse(job.input);
  const contact = await getContactOrThrow(db, job.contactId);
  const subscriberId = await ensureKitSubscriberId(db, email, contact);

  for (const tag of input.tags) {
    await email.applyTag({ subscriberId, tag });
  }
}

async function handleApplyMembershipTag(db: Database, email: EmailProvider, job: JobToProcess): Promise<void> {
  const input = applyMembershipTagInput.parse(job.input);
  const contact = await getContactOrThrow(db, job.contactId);
  const subscriberId = await ensureKitSubscriberId(db, email, contact);

  for (const tag of input.applyTags) {
    await email.applyTag({ subscriberId, tag });
  }

  for (const tag of input.removeTags) {
    if (!canRemoveTagSafely(tag)) {
      logger.warn("Skipping removal of a permanent tag from an integration job", {
        provider: "kit",
        action: "kit.applyMembershipTag",
        errorCode: "permanent_tag_removal_skipped",
      });
      continue;
    }
    await email.removeTag({ subscriberId, tag });
  }
}

function canRemoveTagSafely(tag: string): boolean {
  try {
    assertTagRemovable(tag);
    return true;
  } catch {
    return false;
  }
}

async function handleProvisionGuideAccess(
  db: Database,
  community: CommunityProvider,
  job: JobToProcess,
): Promise<void> {
  const input = provisionGuideAccessInput.parse(job.input);
  const contact = await getContactOrThrow(db, job.contactId);

  // Handles all four cases Step 7 requires: existing member (grant only),
  // brand-new member (invite, which grants in the same call), and
  // already-authorized access (grantAccess is a safe no-op if repeated).
  let member = await community.findMemberByEmail(contact.email);
  if (member) {
    await community.grantAccess({ memberId: member.id, spaceGroupId: input.spaceGroupId });
  } else {
    member = await community.inviteMember({
      email: contact.email,
      firstName: contact.firstName ?? undefined,
      spaceGroupId: input.spaceGroupId,
    });
  }

  await db.update(contacts).set({ circleMemberId: member.id }).where(eq(contacts.id, contact.id));

  if (job.accessGrantId) {
    await db
      .update(accessGrants)
      .set({ status: "active", circleMemberId: member.id, provisionedAt: new Date() })
      .where(eq(accessGrants.id, job.accessGrantId));
  }
}
