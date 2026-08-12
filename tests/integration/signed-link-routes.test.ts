import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { contacts, purchases, signedLinkUses } from "@/db/schema";
import { createSignedLink } from "@/lib/signedLinks";
import { GET as reEntryGet } from "@/app/checkout/re-entry/[token]/route";
import { GET as membershipGet } from "@/app/checkout/membership/[token]/route";

describe("signed link routes", () => {
  const createdContactIds: string[] = [];

  afterAll(async () => {
    for (const contactId of createdContactIds) {
      await db.delete(signedLinkUses).where(eq(signedLinkUses.contactId, contactId));
      await db.delete(purchases).where(eq(purchases.contactId, contactId));
      await db.delete(contacts).where(eq(contacts.id, contactId));
    }
  });

  async function makeGuideOwner() {
    const [contact] = await db
      .insert(contacts)
      .values({ email: `test-${randomUUID()}@example.invalid` })
      .returning();
    if (!contact) throw new Error("failed to insert contact");
    createdContactIds.push(contact.id);

    await db.insert(purchases).values({
      contactId: contact.id,
      kind: "guide",
      status: "paid",
      stripeCheckoutSessionId: `cs_test_${randomUUID()}`,
      stripeProductId: "prod_test",
      stripePriceId: "price_test",
      amountTotal: 8900,
      currency: "gbp",
      paidAt: new Date(),
    });

    return contact;
  }

  it("re-entry route redirects to Circle's checkout on a valid token", async () => {
    const contact = await makeGuideOwner();
    const link = await createSignedLink(contact.id, "reentry", 60);

    const response = await reEntryGet(new Request("https://example.invalid"), {
      params: Promise.resolve({ token: link.token }),
    });

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toContain("/checkout/inside-the-loop");
  });

  it("re-entry route redirects to the friendly error page on an invalid token", async () => {
    const response = await reEntryGet(new Request("https://example.invalid"), {
      params: Promise.resolve({ token: "not-a-real-token" }),
    });

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toContain("/checkout/link-invalid");
  });

  it("membership (continuation) route redirects to Circle's checkout on a valid token", async () => {
    const contact = await makeGuideOwner();
    const link = await createSignedLink(contact.id, "continuation", 60);

    const response = await membershipGet(new Request("https://example.invalid"), {
      params: Promise.resolve({ token: link.token }),
    });

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toContain("/checkout/inside-the-loop");
  });

  it("membership route rejects a reentry-kind token (wrong purpose)", async () => {
    const contact = await makeGuideOwner();
    const link = await createSignedLink(contact.id, "reentry", 60);

    const response = await membershipGet(new Request("https://example.invalid"), {
      params: Promise.resolve({ token: link.token }),
    });

    expect(response.headers.get("location")).toContain("/checkout/link-invalid");
  });
});
