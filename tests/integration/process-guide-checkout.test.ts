import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { accessGrants, contacts, integrationJobs, purchases } from "@/db/schema";
import {
  processAsyncPaymentFailed,
  processAsyncPaymentSucceeded,
  processGuideCheckoutCompleted,
} from "@/domain/purchases/processGuideCheckout";

/**
 * Integration tests for the Guide purchase orchestration against a real
 * Neon dev connection. Requires CIRCLE_INSIDE_LOOP_SPACE_GROUP_ID to be set
 * in .env.local for the "completed" path tests.
 */
describe("processGuideCheckoutCompleted against a real Neon connection", () => {
  const createdContactEmails: string[] = [];
  const createdSessionIds: string[] = [];

  afterAll(async () => {
    for (const sessionId of createdSessionIds) {
      const [purchase] = await db
        .select({ id: purchases.id })
        .from(purchases)
        .where(eq(purchases.stripeCheckoutSessionId, sessionId));
      if (purchase) {
        await db.delete(accessGrants).where(eq(accessGrants.purchaseId, purchase.id));
        await db.delete(integrationJobs).where(eq(integrationJobs.purchaseId, purchase.id));
        await db.delete(purchases).where(eq(purchases.id, purchase.id));
      }
    }
    for (const email of createdContactEmails) {
      await db.delete(contacts).where(eq(contacts.email, email));
    }
  });

  function fakeEmail() {
    const email = `test-${randomUUID()}@example.invalid`;
    createdContactEmails.push(email);
    return email;
  }

  function fakeSessionId() {
    const id = `cs_test_${randomUUID()}`;
    createdSessionIds.push(id);
    return id;
  }

  it("ignores a checkout for any product other than the Guide, without creating a purchase", async () => {
    const sessionId = fakeSessionId();
    const result = await processGuideCheckoutCompleted(db, {
      stripeCheckoutSessionId: sessionId,
      stripePaymentIntentId: null,
      stripeCustomerId: null,
      stripeProductId: "prod_wrong",
      stripePriceId: "price_wrong",
      amountTotal: 4700,
      currency: "gbp",
      customerEmail: fakeEmail(),
      paymentStatus: "paid",
      productKeyFromMetadata: "pack_homework",
    });

    expect(result.outcome).toBe("ignored_wrong_product");

    const [purchase] = await db
      .select()
      .from(purchases)
      .where(eq(purchases.stripeCheckoutSessionId, sessionId));
    expect(purchase).toBeUndefined();
  });

  it("returns missing_email and creates nothing when the session has no customer email", async () => {
    const result = await processGuideCheckoutCompleted(db, {
      stripeCheckoutSessionId: fakeSessionId(),
      stripePaymentIntentId: null,
      stripeCustomerId: null,
      stripeProductId: "prod_guide",
      stripePriceId: "price_guide",
      amountTotal: 8900,
      currency: "gbp",
      customerEmail: null,
      paymentStatus: "paid",
      productKeyFromMetadata: "guide",
    });

    expect(result.outcome).toBe("missing_email");
  });

  it("completes a paid Guide checkout: contact, purchase, access grant, and 2 jobs", async () => {
    const sessionId = fakeSessionId();
    const email = fakeEmail();

    const result = await processGuideCheckoutCompleted(db, {
      stripeCheckoutSessionId: sessionId,
      stripePaymentIntentId: "pi_test_1",
      stripeCustomerId: "cus_test_1",
      stripeProductId: "prod_guide",
      stripePriceId: "price_guide",
      amountTotal: 8900,
      currency: "gbp",
      customerEmail: email,
      paymentStatus: "paid",
      productKeyFromMetadata: "guide",
    });

    expect(result.outcome).toBe("completed");
    if (result.outcome !== "completed") return;

    const [purchase] = await db.select().from(purchases).where(eq(purchases.id, result.purchaseId));
    expect(purchase?.status).toBe("paid");
    expect(purchase?.paidAt).not.toBeNull();

    const [grant] = await db.select().from(accessGrants).where(eq(accessGrants.id, result.accessGrantId));
    expect(grant?.kind).toBe("included_30_day");
    expect(grant?.contactId).toBe(result.contactId);

    const jobs = await db
      .select()
      .from(integrationJobs)
      .where(eq(integrationJobs.purchaseId, result.purchaseId));
    const providers = jobs.map((j) => j.provider).sort();
    expect(providers).toEqual(["circle", "kit"]);
  });

  it("does not create a second purchase for a duplicate checkout session id", async () => {
    const sessionId = fakeSessionId();
    const email = fakeEmail();
    const input = {
      stripeCheckoutSessionId: sessionId,
      stripePaymentIntentId: "pi_test_2",
      stripeCustomerId: "cus_test_2",
      stripeProductId: "prod_guide",
      stripePriceId: "price_guide",
      amountTotal: 8900,
      currency: "gbp",
      customerEmail: email,
      paymentStatus: "paid",
      productKeyFromMetadata: "guide" as const,
    };

    const first = await processGuideCheckoutCompleted(db, input);
    expect(first.outcome).toBe("completed");

    const second = await processGuideCheckoutCompleted(db, input);
    expect(second.outcome).toBe("duplicate_purchase");

    const allPurchases = await db
      .select()
      .from(purchases)
      .where(eq(purchases.stripeCheckoutSessionId, sessionId));
    expect(allPurchases).toHaveLength(1);
  });

  it("holds access for an async (pending) payment until it succeeds", async () => {
    const sessionId = fakeSessionId();
    const email = fakeEmail();

    const pending = await processGuideCheckoutCompleted(db, {
      stripeCheckoutSessionId: sessionId,
      stripePaymentIntentId: "pi_test_3",
      stripeCustomerId: "cus_test_3",
      stripeProductId: "prod_guide",
      stripePriceId: "price_guide",
      amountTotal: 8900,
      currency: "gbp",
      customerEmail: email,
      paymentStatus: "unpaid",
      productKeyFromMetadata: "guide",
    });
    expect(pending.outcome).toBe("pending_async_payment");
    if (pending.outcome !== "pending_async_payment") return;

    const noGrant = await db
      .select()
      .from(accessGrants)
      .where(eq(accessGrants.purchaseId, pending.purchaseId));
    expect(noGrant).toHaveLength(0);

    const succeeded = await processAsyncPaymentSucceeded(db, sessionId);
    expect(succeeded.outcome).toBe("completed");

    const [purchase] = await db.select().from(purchases).where(eq(purchases.id, pending.purchaseId));
    expect(purchase?.status).toBe("paid");
  });

  it("marks a failed async payment as cancelled without granting access", async () => {
    const sessionId = fakeSessionId();
    const email = fakeEmail();

    const pending = await processGuideCheckoutCompleted(db, {
      stripeCheckoutSessionId: sessionId,
      stripePaymentIntentId: "pi_test_4",
      stripeCustomerId: "cus_test_4",
      stripeProductId: "prod_guide",
      stripePriceId: "price_guide",
      amountTotal: 8900,
      currency: "gbp",
      customerEmail: email,
      paymentStatus: "unpaid",
      productKeyFromMetadata: "guide",
    });
    expect(pending.outcome).toBe("pending_async_payment");

    await processAsyncPaymentFailed(db, sessionId);

    const [purchase] = await db.select().from(purchases).where(eq(purchases.stripeCheckoutSessionId, sessionId));
    expect(purchase?.status).toBe("cancelled");
  });
});
