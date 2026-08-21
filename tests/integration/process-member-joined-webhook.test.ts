import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { accessGrants, contacts, integrationJobs } from "@/db/schema";
import { processCircleAccessEvent } from "@/domain/circle/processMemberJoinedWebhook";

/** Real payload shape confirmed against a live Circle webhook test send (2026-08-11). */
function circlePayload(type: string, communityMemberId: string | number) {
  return {
    type,
    data: {
      community_id: 565979,
      community_member_id: communityMemberId,
      access_group_id: 1,
    },
  };
}

describe("processCircleAccessEvent against a real Neon connection", () => {
  const createdContactIds: string[] = [];

  afterAll(async () => {
    for (const contactId of createdContactIds) {
      await db.delete(integrationJobs).where(eq(integrationJobs.contactId, contactId));
      await db.delete(accessGrants).where(eq(accessGrants.contactId, contactId));
      await db.delete(contacts).where(eq(contacts.id, contactId));
    }
  });

  it("returns invalid_payload for a shape that doesn't match Circle's real webhook", async () => {
    const result = await processCircleAccessEvent(db, { unrelated: "field" });
    expect(result.outcome).toBe("invalid_payload");
  });

  it("returns unrecognized_event_type for an event type we don't handle", async () => {
    const result = await processCircleAccessEvent(db, circlePayload("something_else", "123"));
    expect(result.outcome).toBe("unrecognized_event_type");
  });

  describe("access_groups_added (member joined)", () => {
    it("returns unknown_member when no contact has this circleMemberId", async () => {
      const result = await processCircleAccessEvent(
        db,
        circlePayload("access_groups_added", `no-match-${randomUUID()}`),
      );
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

      const result = await processCircleAccessEvent(db, circlePayload("access_groups_added", circleMemberId));

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

      const result = await processCircleAccessEvent(db, circlePayload("access_groups_added", numericId));
      expect(result.outcome).toBe("queued");
    });
  });

  describe("access_groups_removed (member removed — Step 9)", () => {
    it("returns unknown_member when no contact has this circleMemberId", async () => {
      const result = await processCircleAccessEvent(
        db,
        circlePayload("access_groups_removed", `no-match-${randomUUID()}`),
      );
      expect(result.outcome).toBe("unknown_member");
    });

    it("expires the active access grant and queues an il-lapsed Kit job", async () => {
      const circleMemberId = `${Date.now()}-removed`;
      const [contact] = await db
        .insert(contacts)
        .values({ email: `test-${randomUUID()}@example.invalid`, circleMemberId })
        .returning();
      if (!contact) throw new Error("failed to insert contact");
      createdContactIds.push(contact.id);

      const [grant] = await db
        .insert(accessGrants)
        .values({
          contactId: contact.id,
          kind: "included_30_day",
          status: "active",
          startsAt: new Date(),
          circleSpaceGroupId: "sg_test",
        })
        .returning();
      if (!grant) throw new Error("failed to insert access grant");

      const result = await processCircleAccessEvent(db, circlePayload("access_groups_removed", circleMemberId));

      expect(result.outcome).toBe("queued");
      if (result.outcome !== "queued") return;

      const [updatedGrant] = await db.select().from(accessGrants).where(eq(accessGrants.id, grant.id));
      expect(updatedGrant?.status).toBe("expired");
      expect(updatedGrant?.revokedAt).not.toBeNull();

      const jobs = await db.select().from(integrationJobs).where(eq(integrationJobs.contactId, contact.id));
      expect(jobs).toHaveLength(1);
      expect(jobs[0]?.action).toBe("kit.applyMembershipTag");
      const input = jobs[0]?.input as { applyTags: string[]; removeTags: string[] };
      expect(input.applyTags).toContain("member-lapsed");
      expect(input.removeTags).toContain("member-inside-the-loop");
    });

    it("does not touch a grant that is already expired", async () => {
      const circleMemberId = `${Date.now()}-already-expired`;
      const [contact] = await db
        .insert(contacts)
        .values({ email: `test-${randomUUID()}@example.invalid`, circleMemberId })
        .returning();
      if (!contact) throw new Error("failed to insert contact");
      createdContactIds.push(contact.id);

      const [grant] = await db
        .insert(accessGrants)
        .values({
          contactId: contact.id,
          kind: "included_30_day",
          status: "expired",
          startsAt: new Date(),
          circleSpaceGroupId: "sg_test",
          revokedAt: new Date("2020-01-01"),
        })
        .returning();
      if (!grant) throw new Error("failed to insert access grant");

      await processCircleAccessEvent(db, circlePayload("access_groups_removed", circleMemberId));

      const [unchangedGrant] = await db.select().from(accessGrants).where(eq(accessGrants.id, grant.id));
      // revokedAt should be untouched (still the original 2020 date), since
      // the update only targets status = "active" rows.
      expect(unchangedGrant?.revokedAt?.getFullYear()).toBe(2020);
    });
  });
});
