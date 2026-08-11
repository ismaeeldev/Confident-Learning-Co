import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { contacts, integrationJobs } from "@/db/schema";
import { GET } from "@/app/api/cron/process-integration-jobs/route";

describe("GET /api/cron/process-integration-jobs", () => {
  const createdContactIds: string[] = [];

  afterAll(async () => {
    for (const contactId of createdContactIds) {
      await db.delete(integrationJobs).where(eq(integrationJobs.contactId, contactId));
      await db.delete(contacts).where(eq(contacts.id, contactId));
    }
  });

  function request(secret: string | null) {
    return new Request("https://example.invalid/api/cron/process-integration-jobs", {
      headers: secret ? { authorization: `Bearer ${secret}` } : {},
    });
  }

  it("rejects a request with a missing/wrong secret", async () => {
    const response = await GET(request("wrong-secret"));
    expect(response.status).toBe(401);
  });

  it("rejects a request with no authorization header at all", async () => {
    const response = await GET(request(null));
    expect(response.status).toBe(401);
  });

  it("processes a queued job end to end with the correct secret", async () => {
    const [contact] = await db
      .insert(contacts)
      .values({ email: `test-${randomUUID()}@example.invalid` })
      .returning();
    if (!contact) throw new Error("failed to insert contact");
    createdContactIds.push(contact.id);

    await db.insert(integrationJobs).values({
      provider: "kit",
      action: "kit.fulfilGuidePurchase",
      input: { tags: ["client-guide"] },
      contactId: contact.id,
      status: "queued",
    });

    const response = await GET(request(process.env.CRON_SECRET ?? "test-cron-secret"));
    expect(response.status).toBe(200);

    const body = (await response.json()) as { processed: { kit: { succeeded: number } } };
    expect(body.processed.kit.succeeded).toBeGreaterThanOrEqual(1);

    const [updatedContact] = await db.select().from(contacts).where(eq(contacts.id, contact.id));
    expect(updatedContact?.kitSubscriberId).toBeTruthy();
  });
});
