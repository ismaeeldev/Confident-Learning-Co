import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { contacts } from "@/db/schema";
import { upsertContactByEmail } from "@/domain/contacts/upsertContactByEmail";

/**
 * Regression test for a real bug found in a full-codebase review:
 * upsertContactByEmail (and requestLoginLink's own lookup) compared raw,
 * un-normalized email strings against contacts.email, so
 * "Jane@Example.com" and "jane@example.com" were treated as two
 * different people — silently creating a duplicate contact and
 * splitting purchases/access/consent history across two rows. Fixed by
 * normalizing (trim + lowercase) at every lookup/insert.
 */
describe("upsertContactByEmail against a real Neon connection", () => {
  const createdContactIds: string[] = [];

  afterAll(async () => {
    for (const contactId of createdContactIds) {
      await db.delete(contacts).where(eq(contacts.id, contactId));
    }
  });

  it("treats different casings of the same email as the same contact, never creating a duplicate", async () => {
    const localPart = randomUUID();
    const mixedCaseEmail = `Test-${localPart}@Example.INVALID`;
    const differentCaseEmail = `test-${localPart}@example.invalid`;

    const firstId = await upsertContactByEmail(db, mixedCaseEmail);
    createdContactIds.push(firstId);

    const secondId = await upsertContactByEmail(db, differentCaseEmail);

    expect(secondId).toBe(firstId);

    const rows = await db
      .select({ id: contacts.id })
      .from(contacts)
      .where(eq(contacts.email, differentCaseEmail.toLowerCase().trim()));
    expect(rows).toHaveLength(1);
  });

  it("also normalizes surrounding whitespace", async () => {
    const localPart = randomUUID();
    const email = `test-${localPart}@example.invalid`;
    const paddedEmail = `  ${email}  `;

    const firstId = await upsertContactByEmail(db, email);
    createdContactIds.push(firstId);

    const secondId = await upsertContactByEmail(db, paddedEmail);
    expect(secondId).toBe(firstId);
  });
});
