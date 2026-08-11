import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("getPaymentProvider", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("falls back to the mock provider when STRIPE_SECRET_KEY is not set", async () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "");
    const { getPaymentProvider } = await import("@/integrations/stripe/client");

    const provider = getPaymentProvider();
    const session = await provider.createCheckoutSession({
      productKey: "guide",
      metadata: {},
      successUrl: "https://example.invalid/success",
      cancelUrl: "https://example.invalid/cancel",
    });

    expect(session.id).toMatch(/^mock-session-/);
  });
});

describe("createStripeProvider — provider failure paths", () => {
  it("throws (does not silently return an empty checkout) when the product has no configured price", async () => {
    const { createStripeProvider } = await import("@/integrations/stripe/client");
    const provider = createStripeProvider("sk_test_fake");

    // pack_homework has no STRIPE_PACK_HOMEWORK_PRICE_ID set in this test env.
    await expect(
      provider.createCheckoutSession({
        productKey: "pack_homework",
        metadata: {},
        successUrl: "https://example.invalid/success",
        cancelUrl: "https://example.invalid/cancel",
      }),
    ).rejects.toThrow(/no stripe price id configured/i);
  });

  it("throws when verifying a webhook signature without a configured webhook secret", async () => {
    const { createStripeProvider } = await import("@/integrations/stripe/client");
    const provider = createStripeProvider("sk_test_fake");

    expect(() => provider.verifyWebhookSignature("{}", "t=1,v1=abc")).toThrow(
      /stripe_webhook_secret is not configured/i,
    );
  });
});
