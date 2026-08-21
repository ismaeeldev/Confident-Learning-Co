import type { ProductKey } from "@/config/canon";

export interface CreateCheckoutSessionInput {
  productKey: ProductKey;
  customerEmail?: string;
  metadata: Record<string, string>;
  successUrl: string;
  cancelUrl: string;
  /** "subscription" for the recurring membership; every other product is a one-time "payment". Defaults to "payment". */
  mode?: "payment" | "subscription";
  /** Phase 7 — overrides the product's default `stripePriceId` (e.g. switching the Guide to its full £147 price once the founders cap/date closes). Both prices must map to the same `productKey` for consent/gating logic to keep working. */
  priceIdOverride?: string;
}

export interface CheckoutSession {
  id: string;
  url: string;
}

export interface PaymentProvider {
  createCheckoutSession(input: CreateCheckoutSessionInput): Promise<CheckoutSession>;
  verifyWebhookSignature(rawBody: string, signature: string): unknown;
}
