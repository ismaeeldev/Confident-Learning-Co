import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { accessGrants, contacts } from "@/db/schema";
import { createMockCommunityProvider } from "@/integrations/circle/mock";
import { reconcileSpaceGroupAccess } from "@/domain/circle/reconciliation";

describe("reconcileSpaceGroupAccess against a real Neon connection", () => {
  const createdContactIds: string[] = [];
  const spaceGroupId = `sg_test_${randomUUID()}`;

  afterAll(async () => {
    for (const contactId of createdContactIds) {
      await db.delete(accessGrants).where(eq(accessGrants.contactId, contactId));
      await db.delete(contacts).where(eq(contacts.id, contactId));
    }
  });

  async function makeActiveGrant(email: string) {
    const [contact] = await db.insert(contacts).values({ email }).returning({ id: contacts.id });
    if (!contact) throw new Error("failed to insert test contact");
    createdContactIds.push(contact.id);

    await db.insert(accessGrants).values({
      contactId: contact.id,
      kind: "included_30_day",
      status: "active",
      startsAt: new Date(),
      circleSpaceGroupId: spaceGroupId,
    });

    return contact.id;
  }

  it("finds no discrepancies when internal grants and Circle agree", async () => {
    const email = `test-${randomUUID()}@example.invalid`;
    await makeActiveGrant(email);

    const provider = createMockCommunityProvider();
    const member = await provider.inviteMember({ email, spaceGroupId });
    await provider.grantAccess({ memberId: member.id, spaceGroupId });

    const report = await reconcileSpaceGroupAccess(db, provider, spaceGroupId);

    expect(report.checked).toBe(1);
    expect(report.findings).toEqual([]);
  });

  it("flags a 'missing' finding when we expect access but Circle has none", async () => {
    const email = `test-${randomUUID()}@example.invalid`;
    await makeActiveGrant(email);

    // No invite/grant on the provider side at all — simulates a failed
    // provisioning job that never actually granted Circle access.
    const provider = createMockCommunityProvider();

    const report = await reconcileSpaceGroupAccess(db, provider, spaceGroupId);

    expect(report.findings).toContainEqual(
      expect.objectContaining({ email, kind: "missing", spaceGroupId }),
    );
  });

  it("flags an 'extra' finding when Circle has access we no longer expect", async () => {
    // No internal grant created at all for this email.
    const unexpectedEmail = `test-${randomUUID()}@example.invalid`;
    const provider = createMockCommunityProvider();
    const member = await provider.inviteMember({ email: unexpectedEmail, spaceGroupId });
    await provider.grantAccess({ memberId: member.id, spaceGroupId });

    const report = await reconcileSpaceGroupAccess(db, provider, spaceGroupId);

    expect(report.findings).toContainEqual(
      expect.objectContaining({ email: unexpectedEmail, kind: "extra" }),
    );
  });
});
