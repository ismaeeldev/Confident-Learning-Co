import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { contacts, integrationJobs } from "@/db/schema";
import { processMemberJoinedWebhook } from "@/domain/circle/processMemberJoinedWebhook";

/** Real payload shape confirmed against a live Circle webhook test send (2026-08-11). */
function realCirclePayload(communityMemberId: string | number) {
  return {
    type: "access_groups_added",
    data: {
      community_id: 565979,
      community_member_id: communityMemberId,
      access_group_id: 1,
    },
  };
}

describe("processMemberJoinedWebhook against a real Neon connection", () => {
  const createdContactIds: string[] = [];

  afterAll(async () => {
    for (const contactId of createdContactIds) {
      await db.delete(integrationJobs).where(eq(integrationJobs.contactId, contactId));
      await db.delete(contacts).where(eq(contacts.id, contactId));
    }
  });

  it("returns invalid_payload for a shape that doesn't match Circle's real webhook", async () => {
    const result = await processMemberJoinedWebhook(db, { unrelated: "field" });
    expect(result.outcome).toBe("invalid_payload");
  });

  it("returns unknown_member when no contact has this circleMemberId", async () => {
    const result = await processMemberJoinedWebhook(db, realCirclePayload(`no-match-${randomUUID()}`));
    expect(result.outcome).toBe("unknown_member");
  });

  it("finds the matching contact by circleMemberId and queues a Kit job", async () => {
    const circleMemberId = `${Date.now()}`;
    const [contact] = await db
      .insert(contacts)
      .values({ email: `test-${randomUUID()}@example.invalid`, circleMemberId })
      .returning();
    if (!contact) throw new Error("failed to insert contact");
    createdContactIds.push(contact.id);

    const result = await processMemberJoinedWebhook(db, realCirclePayload(circleMemberId));

    expect(result.outcome).toBe("queued");
    if (result.outcome !== "queued") return;
    expect(result.contactId).toBe(contact.id);

    const jobs = await db.select().from(integrationJobs).where(eq(integrationJobs.contactId, contact.id));
    expect(jobs).toHaveLength(1);
    expect(jobs[0]?.action).toBe("kit.applyMembershipTag");
  });

  it("matches a numeric community_member_id against the stored string circleMemberId", async () => {
    const numericId = Date.now();
    const [contact] = await db
      .insert(contacts)
      .values({ email: `test-${randomUUID()}@example.invalid`, circleMemberId: String(numericId) })
      .returning();
    if (!contact) throw new Error("failed to insert contact");
    createdContactIds.push(contact.id);

    const result = await processMemberJoinedWebhook(db, realCirclePayload(numericId));
    expect(result.outcome).toBe("queued");
  });
});
