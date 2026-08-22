import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { accessGrants, contacts, integrationJobs, purchases, formSubmissions } from "@/db/schema";
import { releaseDownloadNow } from "@/domain/checkout/pendingDownload";
import { IMMUTABLE_RULES } from "@/config/canon";

/**
 * Regression test for a real bug found in a full-codebase review: an
 * early self-release during the 14-day hold left `expiresAt` unchanged
 * from the value `completeGuidePurchase` set for the *original, delayed*
 * start — silently granting extra free days of included access beyond
 * the documented 30-day window. Fixed by recomputing `expiresAt` from
 * the real release time, same as `completeGuidePurchase` does for the
 * immediate-delivery path.
 */
describe("releaseDownloadNow against a real Neon connection", () => {
  const createdContactIds: string[] = [];
  const createdAccessGrantIds: string[] = [];

  afterAll(async () => {
    for (const accessGrantId of createdAccessGrantIds) {
      await db
        .delete(formSubmissions)
        .where(sql`${formSubmissions.payload}->>'stripeCheckoutSessionId' LIKE ${`self-release:${accessGrantId}:%`}`);
      await db.delete(integrationJobs).where(eq(integrationJobs.accessGrantId, accessGrantId));
      await db.delete(accessGrants).where(eq(accessGrants.id, accessGrantId));
    }
    for (const contactId of createdContactIds) {
      await db.delete(purchases).where(eq(purchases.contactId, contactId));
      await db.delete(contacts).where(eq(contacts.id, contactId));
    }
  });

  it("recomputes expiresAt from the real release time, not the original held start", async () => {
    const email = `test-${randomUUID()}@example.invalid`;
    const [contact] = await db.insert(contacts).values({ email }).returning({ id: contacts.id });
    if (!contact) throw new Error("failed to insert test contact");
    createdContactIds.push(contact.id);

    const [purchase] = await db
      .insert(purchases)
      .values({
        contactId: contact.id,
        kind: "guide",
        status: "paid",
        amountTotal: 8900,
        currency: "gbp",
        paidAt: new Date(),
        stripeProductId: "prod_test",
        stripePriceId: "price_test",
      })
      .returning({ id: purchases.id });
    if (!purchase) throw new Error("failed to insert test purchase");

    // Mimics exactly what completeGuidePurchase leaves a declined-waiver
    // purchase in: startsAt 14 days out (the hold), expiresAt a further
    // 30 days after that — i.e. purchase + 44 days.
    const originalHoldStart = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    const originalExpiresAt = new Date(
      originalHoldStart.getTime() + IMMUTABLE_RULES.includedAccessDays * 24 * 60 * 60 * 1000,
    );

    const [grant] = await db
      .insert(accessGrants)
      .values({
        contactId: contact.id,
        purchaseId: purchase.id,
        kind: "included_30_day",
        status: "pending",
        startsAt: originalHoldStart,
        expiresAt: originalExpiresAt,
        circleSpaceGroupId: "sg_test",
      })
      .returning({ id: accessGrants.id });
    if (!grant) throw new Error("failed to insert test access grant");
    createdAccessGrantIds.push(grant.id);

    const beforeRelease = Date.now();
    await releaseDownloadNow(db, contact.id, email, grant.id);
    const afterRelease = Date.now();

    const [updated] = await db
      .select({ startsAt: accessGrants.startsAt, expiresAt: accessGrants.expiresAt })
      .from(accessGrants)
      .where(and(eq(accessGrants.id, grant.id)));

    expect(updated?.startsAt).toBeDefined();
    expect(updated?.expiresAt).toBeDefined();
    if (!updated?.startsAt || !updated?.expiresAt) return;

    // startsAt must now be "now", not the original 14-day-out hold date.
    expect(updated.startsAt.getTime()).toBeGreaterThanOrEqual(beforeRelease);
    expect(updated.startsAt.getTime()).toBeLessThanOrEqual(afterRelease);

    // The bug: expiresAt left at the original value would still be ~44
    // days from purchase (~30 days from now, since release happened on
    // "day 0" of the hold in this test) — but critically, before the fix
    // it was computed from the *original* held start (14 days in the
    // future relative to release), not from the real release time. Assert
    // the actual invariant directly: expiresAt must be exactly
    // includedAccessDays after the new startsAt, not after the old one.
    const expectedExpiresAt = updated.startsAt.getTime() + IMMUTABLE_RULES.includedAccessDays * 24 * 60 * 60 * 1000;
    expect(Math.abs(updated.expiresAt.getTime() - expectedExpiresAt)).toBeLessThan(5000);

    // And explicitly: it must no longer equal the original (buggy) value,
    // which would have granted ~14 extra free days in this scenario.
    expect(updated.expiresAt.getTime()).not.toBe(originalExpiresAt.getTime());
  });
});
