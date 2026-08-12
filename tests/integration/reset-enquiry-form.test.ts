import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { contacts, formSubmissions, integrationJobs } from "@/db/schema";
import { POST } from "@/app/api/forms/reset-enquiry/route";

function request(body: unknown) {
  return new Request("https://example.invalid/api/forms/reset-enquiry", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/forms/reset-enquiry", () => {
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

  it("stores the submission and queues both the Kit tag job and the admin notification job", async () => {
    const email = `test-${randomUUID()}@example.invalid`;
    createdEmails.push(email);

    const response = await POST(
      request({
        email,
        firstName: "Adam",
        interest: "confidence_reset",
        message: "My son has stopped trying at all with his homework.",
      }),
    );

    expect(response.status).toBe(200);

    const [submission] = await db.select().from(formSubmissions).where(eq(formSubmissions.email, email));
    expect(submission?.kind).toBe("reset_enquiry");

    const [contact] = await db.select().from(contacts).where(eq(contacts.email, email));
    const jobs = await db.select().from(integrationJobs).where(eq(integrationJobs.contactId, contact!.id));
    const actions = jobs.map((j) => j.action).sort();
    expect(actions).toEqual(["internal.notifyAdminResetEnquiry", "kit.applyResetInterestTag"]);
  });

  it("rejects a submission with a missing required field", async () => {
    const response = await POST(
      request({ email: "test@example.invalid", interest: "confidence_reset" }),
    );
    expect(response.status).toBe(400);
  });

  it("rejects a submission with the honeypot filled, storing nothing", async () => {
    const email = `test-${randomUUID()}@example.invalid`;
    createdEmails.push(email);

    const response = await POST(
      request({
        email,
        firstName: "Bot",
        interest: "calm_reset",
        message: "spam",
        honeypot: "gotcha",
      }),
    );

    expect(response.status).toBe(400);
    const submissions = await db.select().from(formSubmissions).where(eq(formSubmissions.email, email));
    expect(submissions).toHaveLength(0);
  });

  it("rate-limits a duplicate submission from the same email within the window", async () => {
    const email = `test-${randomUUID()}@example.invalid`;
    createdEmails.push(email);
    const body = { email, firstName: "Adam", interest: "confidence_reset", message: "Testing rate limits." };

    const first = await POST(request(body));
    expect(first.status).toBe(200);

    const second = await POST(request(body));
    expect(second.status).toBe(429);
  });
});
