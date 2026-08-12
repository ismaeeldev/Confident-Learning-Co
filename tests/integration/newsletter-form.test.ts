import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { contacts, formSubmissions, integrationJobs } from "@/db/schema";
import { POST } from "@/app/api/forms/newsletter/route";

function request(body: unknown) {
  return new Request("https://example.invalid/api/forms/newsletter", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/forms/newsletter", () => {
  const createdEmails: string[] = [];

  afterAll(async () => {
    for (const email of createdEmails) {
      const [contact] = await db.select({ id: contacts.id }).from(contacts).where(eq(contacts.email, email));
      if (contact) {
        await db.delete(integrationJobs).where(eq(integrationJobs.contactId, contact.id));
        await db.delete(contacts).where(eq(contacts.id, contact.id));
      }
      await db.delete(formSubmissions).where(eq(formSubmissions.email, email));
    }
  });

  it("stores the submission, upserts a contact, and queues a Kit sync job", async () => {
    const email = `test-${randomUUID()}@example.invalid`;
    createdEmails.push(email);

    const response = await POST(
      request({ email, firstName: "Adam", consentTextVersion: "v1-draft-2026-08-12" }),
    );

    expect(response.status).toBe(200);

    const [submission] = await db.select().from(formSubmissions).where(eq(formSubmissions.email, email));
    expect(submission?.kind).toBe("newsletter");
    expect(submission?.consentAt).not.toBeNull();

    const [contact] = await db.select().from(contacts).where(eq(contacts.email, email));
    expect(contact).toBeDefined();

    const jobs = await db.select().from(integrationJobs).where(eq(integrationJobs.contactId, contact!.id));
    expect(jobs).toHaveLength(1);
    expect(jobs[0]?.action).toBe("kit.syncNewsletterContact");
  });

  it("rejects invalid input", async () => {
    const response = await POST(request({ email: "not-an-email", consentTextVersion: "v1" }));
    expect(response.status).toBe(400);
  });

  it("rejects a submission with the honeypot filled (spam), storing nothing", async () => {
    const email = `test-${randomUUID()}@example.invalid`;
    createdEmails.push(email);

    const response = await POST(
      request({ email, consentTextVersion: "v1", honeypot: "i-am-a-bot" }),
    );

    expect(response.status).toBe(400);
    const submissions = await db.select().from(formSubmissions).where(eq(formSubmissions.email, email));
    expect(submissions).toHaveLength(0);
  });

  it("rate-limits a duplicate submission from the same email within the window", async () => {
    const email = `test-${randomUUID()}@example.invalid`;
    createdEmails.push(email);
    const body = { email, consentTextVersion: "v1" };

    const first = await POST(request(body));
    expect(first.status).toBe(200);

    const second = await POST(request(body));
    expect(second.status).toBe(429);
  });
});
