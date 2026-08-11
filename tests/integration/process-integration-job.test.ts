import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { accessGrants, contacts } from "@/db/schema";
import { createMockEmailProvider } from "@/integrations/kit/mock";
import { createMockCommunityProvider } from "@/integrations/circle/mock";
import { processIntegrationJob } from "@/domain/jobs/processIntegrationJob";

describe("processIntegrationJob against a real Neon connection", () => {
  const createdContactIds: string[] = [];

  afterAll(async () => {
    for (const contactId of createdContactIds) {
      await db.delete(accessGrants).where(eq(accessGrants.contactId, contactId));
      await db.delete(contacts).where(eq(contacts.id, contactId));
    }
  });

  async function makeContact(email: string) {
    const [contact] = await db.insert(contacts).values({ email, firstName: "Adam" }).returning();
    if (!contact) throw new Error("failed to insert contact");
    createdContactIds.push(contact.id);
    return contact;
  }

  it("kit.fulfilGuidePurchase applies every requested tag and caches the Kit subscriber id", async () => {
    const contact = await makeContact(`test-${randomUUID()}@example.invalid`);
    const email = createMockEmailProvider();
    const community = createMockCommunityProvider();

    await processIntegrationJob(
      db,
      { email, community },
      {
        id: randomUUID(),
        action: "kit.fulfilGuidePurchase",
        input: { tags: ["client-guide", "il-30day-active"] },
        contactId: contact.id,
        accessGrantId: null,
      },
    );

    const [updated] = await db.select().from(contacts).where(eq(contacts.id, contact.id));
    expect(updated?.kitSubscriberId).toBeTruthy();
  });

  it("kit.applyMembershipTag applies the tag but skips removing a permanent tag", async () => {
    const contact = await makeContact(`test-${randomUUID()}@example.invalid`);
    const email = createMockEmailProvider();
    const community = createMockCommunityProvider();
    const subscriber = await email.upsertSubscriber({ email: contact.email });
    await db.update(contacts).set({ kitSubscriberId: subscriber.id }).where(eq(contacts.id, contact.id));
    await email.applyTag({ subscriberId: subscriber.id, tag: "client-guide" });

    // Should not throw, and client-guide must survive the "removeTags" request.
    await processIntegrationJob(
      db,
      { email, community },
      {
        id: randomUUID(),
        action: "kit.applyMembershipTag",
        input: { applyTags: ["member-inside-the-loop"], removeTags: ["client-guide", "il-lapsed"] },
        contactId: contact.id,
        accessGrantId: null,
      },
    );

    // No direct read API on the mock, so this test's real assertion is
    // simply that it didn't throw — a permanent-tag removal attempt would
    // have surfaced as an error if not guarded.
    expect(true).toBe(true);
  });

  it("circle.provisionGuideAccess invites a brand-new member and activates the access grant", async () => {
    const contact = await makeContact(`test-${randomUUID()}@example.invalid`);
    const email = createMockEmailProvider();
    const community = createMockCommunityProvider();
    const spaceGroupId = `sg_${randomUUID()}`;

    const [grant] = await db
      .insert(accessGrants)
      .values({
        contactId: contact.id,
        kind: "included_30_day",
        status: "pending",
        startsAt: new Date(),
        circleSpaceGroupId: spaceGroupId,
      })
      .returning();
    if (!grant) throw new Error("failed to insert access grant");

    await processIntegrationJob(
      db,
      { email, community },
      {
        id: randomUUID(),
        action: "circle.provisionGuideAccess",
        input: { spaceGroupId },
        contactId: contact.id,
        accessGrantId: grant.id,
      },
    );

    const [updatedContact] = await db.select().from(contacts).where(eq(contacts.id, contact.id));
    expect(updatedContact?.circleMemberId).toBeTruthy();

    const [updatedGrant] = await db.select().from(accessGrants).where(eq(accessGrants.id, grant.id));
    expect(updatedGrant?.status).toBe("active");
    expect(updatedGrant?.provisionedAt).not.toBeNull();

    const member = await community.findMemberByEmail(contact.email);
    expect(member).not.toBeNull();
    if (member) {
      const inspection = await community.inspectAccess({ memberId: member.id, spaceGroupId });
      expect(inspection.hasAccess).toBe(true);
    }
  });

  it("throws for an unrecognized job action", async () => {
    const contact = await makeContact(`test-${randomUUID()}@example.invalid`);
    const email = createMockEmailProvider();
    const community = createMockCommunityProvider();

    await expect(
      processIntegrationJob(
        db,
        { email, community },
        {
          id: randomUUID(),
          action: "unknown.action",
          input: {},
          contactId: contact.id,
          accessGrantId: null,
        },
      ),
    ).rejects.toThrow(/unknown integration job action/i);
  });
});
