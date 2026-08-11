import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { contacts, integrationJobs } from "@/db/schema";
import { processMemberJoinedWebhook } from "@/domain/circle/processMemberJoinedWebhook";

describe("processMemberJoinedWebhook against a real Neon connection", () => {
  const createdEmails: string[] = [];

  afterAll(async () => {
    for (const email of createdEmails) {
      const [contact] = await db.select({ id: contacts.id }).from(contacts).where(eq(contacts.email, email));
      if (contact) {
        await db.delete(integrationJobs).where(eq(integrationJobs.contactId, contact.id));
        await db.delete(contacts).where(eq(contacts.id, contact.id));
      }
    }
  });

  function fakeEmail() {
    const email = `test-${randomUUID()}@example.invalid`;
    createdEmails.push(email);
    return email;
  }

  it("returns missing_email when no recognizable email field is present", async () => {
    const result = await processMemberJoinedWebhook(db, { unrelated: "field" });
    expect(result.outcome).toBe("missing_email");
  });

  it("extracts a top-level email field and queues a Kit job", async () => {
    const email = fakeEmail();
    const result = await processMemberJoinedWebhook(db, { email });

    expect(result.outcome).toBe("queued");
    if (result.outcome !== "queued") return;

    const jobs = await db.select().from(integrationJobs).where(eq(integrationJobs.contactId, result.contactId));
    expect(jobs).toHaveLength(1);
    expect(jobs[0]?.provider).toBe("kit");
    expect(jobs[0]?.action).toBe("kit.applyMembershipTag");
  });

  it("extracts a nested member.email field", async () => {
    const email = fakeEmail();
    const result = await processMemberJoinedWebhook(db, { member: { email } });
    expect(result.outcome).toBe("queued");
  });

  it("extracts a nested community_member.email field", async () => {
    const email = fakeEmail();
    const result = await processMemberJoinedWebhook(db, { community_member: { email } });
    expect(result.outcome).toBe("queued");
  });
});
