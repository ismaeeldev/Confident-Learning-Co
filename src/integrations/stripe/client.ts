import "server-only";
import Stripe from "stripe";
import { env } from "@/lib/env";
import { products } from "@/config/products";
import { createMockPaymentProvider } from "./mock";
import type { PaymentProvider, CreateCheckoutSessionInput, CheckoutSession } from "./types";

/**
 * Real Stripe-hosted Checkout client, implementing the same PaymentProvider
 * interface as src/integrations/stripe/mock.ts. Uses Stripe's own hosted
 * Checkout page rather than a custom card form, per Step 8's requirement
 * ("Use Stripe-hosted Checkout or approved Payment Link strategy").
 */
export function createStripeProvider(secretKey: string, webhookSecret?: string): PaymentProvider {
  const stripe = new Stripe(secretKey);

  return {
    async createCheckoutSession(input: CreateCheckoutSessionInput): Promise<CheckoutSession> {
      const product = products[input.productKey];
      if (!product.stripePriceId) {
        throw new Error(
          `No Stripe price ID configured for product "${input.productKey}". Set the matching STRIPE_*_PRICE_ID env var.`,
        );
      }

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [{ price: product.stripePriceId, quantity: 1 }],
        customer_email: input.customerEmail,
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
        metadata: input.metadata,
        // Deliverability depends on a real billing address per
        // Circle_and_Website_Build_Pack_v4.docx Part 2.
        billing_address_collection: "required",
      });

      if (!session.url) {
        throw new Error("Stripe did not return a checkout session URL");
      }
      return { id: session.id, url: session.url };
    },

    verifyWebhookSignature(rawBody: string, signature: string): unknown {
      if (!webhookSecret) {
        throw new Error("STRIPE_WEBHOOK_SECRET is not configured; cannot verify webhook signatures.");
      }
      return stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    },
  };
}

export function createStripeProviderFromEnv(): PaymentProvider {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set; cannot create a real Stripe client.");
  }
  return createStripeProvider(env.STRIPE_SECRET_KEY, env.STRIPE_WEBHOOK_SECRET);
}

/**
 * Returns the real Stripe provider when STRIPE_SECRET_KEY is configured,
 * otherwise falls back to the in-memory mock — so checkout/webhook code
 * paths are exercisable in dev/CI without real Stripe credentials.
 */
export function getPaymentProvider(): PaymentProvider {
  if (env.STRIPE_SECRET_KEY) {
    return createStripeProviderFromEnv();
  }
  return createMockPaymentProvider();
}
