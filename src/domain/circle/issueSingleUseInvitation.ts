import "server-only";
import { eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import { accessGrants, contacts } from "@/db/schema";
import type { CommunityProvider } from "@/integrations/circle/types";

type Database = NeonHttpDatabase<typeof schema>;

export interface IssueSingleUseInvitationInput {
  contactId: string;
  accessGrantId: string;
  spaceGroupId: string;
  email: string;
  firstName?: string;
}

/**
 * Issues Circle access for a membership purchase (Build Addendum A v2.2,
 * R3) — single-use invitation for a brand-new member, or a direct grant if
 * this contact already has a stored Circle identifier (e.g. a rejoining
 * lapsed member). **Never calls `findMemberByEmail`** — the only place an
 * email is used is Circle's own `inviteMember` call, which requires one to
 * create a new member; every other decision and every future lookup goes
 * through the identifier stored on `contacts.circleMemberId`, never
 * re-derived from email at read time (R3: "Do not link by matching an
 * email string, at any point, including in reconciliation and
 * revocation").
 *
 * Deliberately synchronous, called directly from the Stripe webhook rather
 * than only queued — `vercel.json`'s integration-jobs cron only runs once
 * daily, far too slow for R3's "alert within five minutes" requirement on
 * failure. Callers should also enqueue a `circle.issueMembershipInvitation`
 * background job as a catch-up retry; this function itself does not retry.
 */
export async function issueSingleUseInvitation(
  db: Database,
  community: CommunityProvider,
  input: IssueSingleUseInvitationInput,
): Promise<{ circleMemberId: string }> {
  const [contact] = await db
    .select({ circleMemberId: contacts.circleMemberId })
    .from(contacts)
    .where(eq(contacts.id, input.contactId))
    .limit(1);

  let circleMemberId = contact?.circleMemberId ?? null;

  if (circleMemberId) {
    // Rejoining member with a Circle account from an earlier grant — grant
    // directly against the stored id, no email lookup involved.
    await community.grantAccess({ memberId: circleMemberId, spaceGroupId: input.spaceGroupId });
  } else {
    const member = await community.inviteMember({
      email: input.email,
      firstName: input.firstName,
      spaceGroupId: input.spaceGroupId,
    });
    circleMemberId = member.id;
    await db.update(contacts).set({ circleMemberId }).where(eq(contacts.id, input.contactId));
  }

  await db
    .update(accessGrants)
    .set({ status: "active", circleMemberId, provisionedAt: new Date(), failureReason: null })
    .where(eq(accessGrants.id, input.accessGrantId));

  return { circleMemberId };
}
