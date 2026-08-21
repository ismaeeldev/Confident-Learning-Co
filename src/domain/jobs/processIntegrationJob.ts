import "server-only";
import { z } from "zod";
import { eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import { contacts } from "@/db/schema";
import type { EmailProvider } from "@/integrations/kit/types";
import type { CommunityProvider } from "@/integrations/circle/types";
import { assertTagRemovable } from "@/domain/contacts/kitTags";
import { issueSingleUseInvitation } from "@/domain/circle/issueSingleUseInvitation";
import { logger } from "@/lib/logger";
import { createSignedLink } from "@/lib/signedLinks";
import { env } from "@/lib/env";
import { PUBLIC_ROUTES, KIT_TAGS } from "@/config/canon";
import { sendAdminNotificationEmail } from "@/lib/email";

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
const notifyAdminResetEnquiryInput = z.object({
  email: z.string().email(),
  firstName: z.string(),
  interest: z.string(),
  message: z.string(),
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
    case "kit.syncNewsletterContact":
      return handleSyncNewsletterContact(db, providers.email, job);
    case "kit.applyResetInterestTag":
      return handleApplyResetInterestTag(db, providers.email, job);
    case "circle.provisionGuideAccess":
      return handleProvisionGuideAccess(db, providers.community, job);
    case "circle.issueMembershipInvitation":
      return handleIssueMembershipInvitation(db, providers.community, job);
    case "internal.notifyAdminResetEnquiry":
      return handleNotifyAdminResetEnquiry(job);
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

  // Generate both signed links now, at purchase time, and push them onto
  // the Kit subscriber as custom fields — Kit's own Day 25/Day 30 timed
  // emails (Sequence 2) reference these via merge tags
  // ({{ subscriber.continuation_link }} / {{ subscriber.reentry_link }})
  // since Kit can't call our signing code at send time itself. 35/45-day
  // expiries comfortably cover the included 30-day window; a re-entry
  // request long after that (per the spec, "even a year from now") needs
  // a freshly generated link, not this one still being valid.
  const [continuation, reentry] = await Promise.all([
    createSignedLink(contact.id, "continuation", 60 * 60 * 24 * 35),
    createSignedLink(contact.id, "reentry", 60 * 60 * 24 * 45),
  ]);

  await email.upsertSubscriber({
    email: contact.email,
    firstName: contact.firstName ?? undefined,
    fields: {
      continuation_link: `${env.NEXT_PUBLIC_SITE_URL}${PUBLIC_ROUTES.checkoutMembership}/${continuation.token}`,
      reentry_link: `${env.NEXT_PUBLIC_SITE_URL}${PUBLIC_ROUTES.checkoutReEntry}/${reentry.token}`,
    },
  });
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

/** Newsletter signup — dedicated source tag only, never the Reflection nurture tags (docs/07-IntegrationContracts.md 7.8). */
async function handleSyncNewsletterContact(db: Database, email: EmailProvider, job: JobToProcess): Promise<void> {
  const contact = await getContactOrThrow(db, job.contactId);
  const subscriberId = await ensureKitSubscriberId(db, email, contact);
  await email.applyTag({ subscriberId, tag: KIT_TAGS.newsletterSource });
}

/** Reset enquiry — applies interest-confidence-reset only; no sales sequence (docs/07-IntegrationContracts.md 7.9). */
async function handleApplyResetInterestTag(db: Database, email: EmailProvider, job: JobToProcess): Promise<void> {
  const contact = await getContactOrThrow(db, job.contactId);
  const subscriberId = await ensureKitSubscriberId(db, email, contact);
  await email.applyTag({ subscriberId, tag: KIT_TAGS.interestConfidenceReset });
}

/**
 * Notifies Jane/admin of a Reset enquiry. Safely no-ops (logs only) when
 * RESEND_API_KEY isn't configured — the enquiry is always stored in
 * form_submissions regardless, so nothing is lost, just not yet emailed.
 */
async function handleNotifyAdminResetEnquiry(job: JobToProcess): Promise<void> {
  const input = notifyAdminResetEnquiryInput.parse(job.input);
  await sendAdminNotificationEmail({
    subject: `New Reset enquiry: ${input.interest.replace("_", " ")}`,
    text: [
      `From: ${input.firstName} <${input.email}>`,
      `Interest: ${input.interest}`,
      "",
      input.message,
    ].join("\n"),
  });
}

async function handleProvisionGuideAccess(
  db: Database,
  community: CommunityProvider,
  job: JobToProcess,
): Promise<void> {
  const input = provisionGuideAccessInput.parse(job.input);
  const contact = await getContactOrThrow(db, job.contactId);
  if (!job.accessGrantId) throw new Error("circle.provisionGuideAccess job is missing accessGrantId");

  await issueSingleUseInvitation(db, community, {
    contactId: contact.id,
    accessGrantId: job.accessGrantId,
    spaceGroupId: input.spaceGroupId,
    email: contact.email,
    firstName: contact.firstName ?? undefined,
  });
}

/**
 * Background retry path for membership invitation issuance (R3 rebuild).
 * The primary path is synchronous, in the Stripe webhook itself
 * (processMembershipCheckout.ts) — this job only exists to catch up if
 * that synchronous attempt failed. Same idempotent-safe shape as
 * handleProvisionGuideAccess: re-running is always safe.
 */
async function handleIssueMembershipInvitation(
  db: Database,
  community: CommunityProvider,
  job: JobToProcess,
): Promise<void> {
  const input = provisionGuideAccessInput.parse(job.input);
  const contact = await getContactOrThrow(db, job.contactId);
  if (!job.accessGrantId) throw new Error("circle.issueMembershipInvitation job is missing accessGrantId");

  await issueSingleUseInvitation(db, community, {
    contactId: contact.id,
    accessGrantId: job.accessGrantId,
    spaceGroupId: input.spaceGroupId,
    email: contact.email,
    firstName: contact.firstName ?? undefined,
  });
}
