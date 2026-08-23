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
 * Records the R1 checkout consent — written *before* the Stripe redirect
 * (checkout may never complete), then correlated to the resulting purchase
 * via `stripeCheckoutSessionId` once the session exists.
 *
 * R1.3: "A blank field is not evidence of a decision." Each of the four
 * boxes is recorded as its own positive value — accepted or declined —
 * with its own timestamp and its own wording version, not one shared
 * value for the whole submission. In practice all four are presented on
 * the same screen and submitted in the same request, so the timestamp and
 * wording version are identical across all four right now — but the shape
 * itself doesn't assume that, so a future redesign that separates them
 * onto different screens wouldn't silently lose this per-box evidence.
 */
export async function recordPurchaseConsent(
  db: Database,
  stripeCheckoutSessionId: string,
  input: PurchaseConsentInput,
): Promise<void> {
  const consentAt = new Date().toISOString();
  const box = (accepted: boolean) => ({ accepted, timestamp: consentAt, wordingVersion: PURCHASE_CONSENT_VERSION });

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
      ageConfirmed: box(input.ageConfirmed),
      termsAgreed: box(input.termsAgreed),
      immediateDeliveryConsent: box(input.immediateDeliveryConsent),
      cancellationRightAcknowledged: box(input.cancellationRightAcknowledged),
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
