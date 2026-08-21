import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { contacts, formSubmissions, signedLinkUses } from "@/db/schema";
import { POST } from "@/app/api/auth/request-login-link/route";

function request(body: unknown) {
  return new Request("https://example.invalid/api/auth/request-login-link", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/auth/request-login-link", () => {
  const createdEmails: string[] = [];

  afterAll(async () => {
    for (const email of createdEmails) {
      const [contact] = await db.select({ id: contacts.id }).from(contacts).where(eq(contacts.email, email));
      if (contact) {
        await db.delete(signedLinkUses).where(eq(signedLinkUses.contactId, contact.id));
        await db.delete(contacts).where(eq(contacts.id, contact.id));
      }
      await db.delete(formSubmissions).where(eq(formSubmissions.email, email));
    }
  });

  it("returns the same 200 response for a registered email as for an unregistered one (enumeration-safe)", async () => {
    const registeredEmail = `test-${randomUUID()}@example.invalid`;
    const unregisteredEmail = `test-${randomUUID()}@example.invalid`;
    createdEmails.push(registeredEmail, unregisteredEmail);

    await db.insert(contacts).values({ email: registeredEmail, firstName: "Adam" });

    const registeredResponse = await POST(request({ email: registeredEmail }));
    const unregisteredResponse = await POST(request({ email: unregisteredEmail }));

    expect(registeredResponse.status).toBe(unregisteredResponse.status);
    expect(await registeredResponse.json()).toEqual(await unregisteredResponse.json());
  });

  it("logs the attempt for a registered email (form_submissions row written either way)", async () => {
    const email = `test-${randomUUID()}@example.invalid`;
    createdEmails.push(email);
    await db.insert(contacts).values({ email, firstName: "Michela" });

    await POST(request({ email }));

    const submissions = await db.select().from(formSubmissions).where(eq(formSubmissions.email, email));
    expect(submissions).toHaveLength(1);
    expect(submissions[0]?.kind).toBe("login_request");
  });

  it("does not create a new contact for an unregistered email — accounts are created at purchase, not by signing in", async () => {
    const email = `test-${randomUUID()}@example.invalid`;
    createdEmails.push(email);

    await POST(request({ email }));

    const [contact] = await db.select().from(contacts).where(eq(contacts.email, email));
    expect(contact).toBeUndefined();
  });

  it("rejects invalid input", async () => {
    const response = await POST(request({ email: "not-an-email" }));
    expect(response.status).toBe(400);
  });

  it("rejects a submission with the honeypot filled", async () => {
    const email = `test-${randomUUID()}@example.invalid`;
    createdEmails.push(email);

    const response = await POST(request({ email, honeypot: "i-am-a-bot" }));
    expect(response.status).toBe(400);
  });

  it("still returns 200 (not a 429) when rate-limited, so the response never differs by timing", async () => {
    const email = `test-${randomUUID()}@example.invalid`;
    createdEmails.push(email);
    await db.insert(contacts).values({ email, firstName: "Jane" });

    const first = await POST(request({ email }));
    expect(first.status).toBe(200);

    const second = await POST(request({ email }));
    expect(second.status).toBe(200);
  });
});
