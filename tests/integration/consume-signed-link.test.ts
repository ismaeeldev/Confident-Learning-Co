import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { contacts, purchases, signedLinkUses } from "@/db/schema";
import { createSignedLink } from "@/lib/signedLinks";
import { consumeSignedLink } from "@/domain/signedLinks/consumeSignedLink";

describe("consumeSignedLink against a real Neon connection", () => {
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

  it("succeeds for a real Guide owner with a valid token", async () => {
    const contact = await makeGuideOwner();
    const link = await createSignedLink(contact.id, "reentry", 60);

    const result = await consumeSignedLink(db, link.token, "reentry");

    expect(result.outcome).toBe("success");
    if (result.outcome === "success") {
      expect(result.contactId).toBe(contact.id);
    }
  });

  it("rejects a second use of the same token (replay)", async () => {
    const contact = await makeGuideOwner();
    const link = await createSignedLink(contact.id, "reentry", 60);

    const first = await consumeSignedLink(db, link.token, "reentry");
    expect(first.outcome).toBe("success");

    const second = await consumeSignedLink(db, link.token, "reentry");
    expect(second.outcome).toBe("already_used");
  });

  it("rejects a contact with no paid Guide purchase, even with a valid token", async () => {
    const [contact] = await db
      .insert(contacts)
      .values({ email: `test-${randomUUID()}@example.invalid` })
      .returning();
    if (!contact) throw new Error("failed to insert contact");
    createdContactIds.push(contact.id);

    const link = await createSignedLink(contact.id, "reentry", 60);
    const result = await consumeSignedLink(db, link.token, "reentry");

    expect(result.outcome).toBe("not_guide_owner");
  });

  it("rejects an expired token", async () => {
    const contact = await makeGuideOwner();
    const link = await createSignedLink(contact.id, "continuation", -10);

    const result = await consumeSignedLink(db, link.token, "continuation");
    expect(result.outcome).toBe("expired");
  });

  it("rejects a token used for the wrong kind", async () => {
    const contact = await makeGuideOwner();
    const link = await createSignedLink(contact.id, "continuation", 60);

    const result = await consumeSignedLink(db, link.token, "reentry");
    expect(result.outcome).toBe("invalid");
  });
});
