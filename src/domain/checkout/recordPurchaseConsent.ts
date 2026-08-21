import "server-only";
import { and, eq, sql } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import { formSubmissions } from "@/db/schema";
import { PURCHASE_CONSENT_VERSION } from "@/config/canon";
import { products } from "@/config/products";
import type { PurchaseConsentInput } from "./purchaseConsentSchema";

type Database = NeonHttpDatabase<typeof schema>;

/**
 * Records the Phase 6 checkout consent — written *before* the Stripe
 * redirect (checkout may never complete), then correlated to the
 * resulting purchase via `stripeCheckoutSessionId` once the session
 * exists. Per the client's own explanation: the tick alone only proves
 * someone clicked something; `consentTextVersion` is what proves what they
 * actually agreed to — never overwritten, always retrievable even after
 * the copy changes.
 */
export async function recordPurchaseConsent(
  db: Database,
  stripeCheckoutSessionId: string,
  input: PurchaseConsentInput,
): Promise<void> {
  // Email is genuinely unknown at this point — Stripe's own hosted
  // Checkout page collects it for a guest purchase, not this consent step
  // — so the row is written with a placeholder and backfilled by
  // `attachEmailToPurchaseConsent` once the webhook confirms the real
  // purchase. The session id is the real, immediate join key.
  await db.insert(formSubmissions).values({
    kind: "purchase_consent",
    email: "pending@checkout.invalid",
    payload: {
      productKey: input.productKey,
      productName: products[input.productKey].displayName,
      termsAgreed: input.termsAgreed,
      immediateDelivery: input.immediateDelivery,
      stripeCheckoutSessionId,
    },
    consentTextVersion: PURCHASE_CONSENT_VERSION,
    consentAt: new Date(),
    status: "received",
  });
}

/**
 * Backfills the real email onto a `purchase_consent` row once the Stripe
 * webhook confirms the purchase and its real customer email — keeping the
 * legal consent record complete rather than leaving it against a
 * placeholder address. Matched by the session id stored in `payload` at
 * consent time, the only identifier available before payment completes.
 */
export async function attachEmailToPurchaseConsent(
  db: Database,
  stripeCheckoutSessionId: string,
  email: string,
): Promise<void> {
  await db
    .update(formSubmissions)
    .set({ email })
    .where(
      and(
        eq(formSubmissions.kind, "purchase_consent"),
        sql`${formSubmissions.payload}->>'stripeCheckoutSessionId' = ${stripeCheckoutSessionId}`,
      ),
    );
}
