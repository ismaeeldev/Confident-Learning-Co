import "server-only";
import type { PaymentProvider, CreateCheckoutSessionInput, CheckoutSession } from "./types";

export function createMockPaymentProvider(): PaymentProvider {
  let sessionCounter = 0;

  return {
    async createCheckoutSession(input: CreateCheckoutSessionInput): Promise<CheckoutSession> {
      sessionCounter += 1;
      return {
        id: `mock-session-${sessionCounter}`,
        url: `${input.successUrl}?mock_session=${sessionCounter}`,
      };
    },
    verifyWebhookSignature() {
      throw new Error("verifyWebhookSignature is not implemented on the mock payment provider");
    },
  };
}
