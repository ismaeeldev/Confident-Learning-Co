import type { ProductKey } from "@/config/canon";

export interface CreateCheckoutSessionInput {
  productKey: ProductKey;
  customerEmail?: string;
  metadata: Record<string, string>;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutSession {
  id: string;
  url: string;
}

export interface PaymentProvider {
  createCheckoutSession(input: CreateCheckoutSessionInput): Promise<CheckoutSession>;
  verifyWebhookSignature(rawBody: string, signature: string): unknown;
}
