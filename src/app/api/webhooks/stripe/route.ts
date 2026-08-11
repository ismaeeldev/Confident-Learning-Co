import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { db } from "@/db/client";
import { getPaymentProvider } from "@/integrations/stripe/client";
import { claimWebhookEvent, completeWebhookEvent, failWebhookEvent } from "@/lib/idempotency";
import {
  processAsyncPaymentFailed,
  processAsyncPaymentSucceeded,
  processGuideCheckoutCompleted,
} from "@/domain/purchases/processGuideCheckout";
import { logger } from "@/lib/logger";

/**
 * Stripe webhook — the only trigger for Guide purchase fulfilment.
 * Verifies the signature before touching anything else, then claims the
 * event id in webhookEvents so a Stripe retry (or an operator replay)
 * never repeats a side effect. See docs/07-IntegrationContracts.md.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const provider = getPaymentProvider();
    event = provider.verifyWebhookSignature(rawBody, signature) as Stripe.Event;
  } catch (error) {
    logger.warn("Stripe webhook signature verification failed", {
      provider: "stripe",
      action: "webhook.verifySignature",
      safeErrorMessage: error instanceof Error ? error.message : "unknown error",
    });
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const claim = await claimWebhookEvent(db, {
    provider: "stripe",
    providerEventId: event.id,
    eventType: event.type,
  });

  if (!claim.claimed) {
    // Already processed (or currently being processed) — Stripe should not
    // retry, and we must not repeat any side effect.
    return NextResponse.json({ received: true, duplicate: true }, { status: 200 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const lineItem = getSessionPriceFromMetadata(session);
        await processGuideCheckoutCompleted(db, {
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: normalizeId(session.payment_intent),
          stripeCustomerId: normalizeId(session.customer),
          stripeProductId: lineItem.productId,
          stripePriceId: lineItem.priceId,
          amountTotal: session.amount_total ?? 0,
          currency: session.currency ?? "gbp",
          customerEmail: session.customer_details?.email ?? session.customer_email ?? null,
          paymentStatus: session.payment_status,
          productKeyFromMetadata: session.metadata?.productKey,
        });
        break;
      }
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        await processAsyncPaymentSucceeded(db, session.id);
        break;
      }
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await processAsyncPaymentFailed(db, session.id);
        break;
      }
      default:
        logger.debug("Ignoring unhandled Stripe event type", {
          provider: "stripe",
          action: "webhook.receive",
          status: event.type,
        });
    }

    await completeWebhookEvent(db, claim.eventRowId);
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    logger.error("Stripe webhook processing failed", {
      provider: "stripe",
      action: "webhook.process",
      eventId: event.id,
      safeErrorMessage: message,
    });
    await failWebhookEvent(db, claim.eventRowId, { code: "processing_error", message });
    // 500 tells Stripe to retry — appropriate for transient/config errors,
    // since claimWebhookEvent + our own duplicate-purchase guard make a
    // retry safe rather than repeating the fulfilment side effects.
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}

function normalizeId(value: string | { id: string } | null | undefined): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

/**
 * The Guide checkout only ever contains one line item. Stripe's webhook
 * payload for checkout.session.completed does not embed price/product ids
 * directly on the session, so this re-derives them from session metadata
 * set by our own checkout route rather than making an extra API call.
 */
function getSessionPriceFromMetadata(session: Stripe.Checkout.Session): {
  productId: string;
  priceId: string;
} {
  return {
    productId: session.metadata?.stripeProductId ?? "unknown",
    priceId: session.metadata?.stripePriceId ?? "unknown",
  };
}
