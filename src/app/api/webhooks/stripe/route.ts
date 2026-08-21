import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { db } from "@/db/client";
import { getPaymentProvider } from "@/integrations/stripe/client";
import { getCommunityProvider } from "@/lib/providers";
import { claimWebhookEvent, completeWebhookEvent, failWebhookEvent } from "@/lib/idempotency";
import {
  processAsyncPaymentFailed,
  processAsyncPaymentSucceeded,
  processGuideCheckoutCompleted,
} from "@/domain/purchases/processGuideCheckout";
import { processMembershipCheckoutCompleted } from "@/domain/purchases/processMembershipCheckout";
import { processPathwayCheckoutCompleted } from "@/domain/purchases/processPathwayCheckout";
import { processRefund } from "@/domain/purchases/processRefund";
import {
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
} from "@/domain/subscriptions/processSubscriptionEvent";
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
        const productKey = session.metadata?.productKey;

        if (productKey === "membership") {
          await processMembershipCheckoutCompleted(db, getCommunityProvider(), {
            stripeCheckoutSessionId: session.id,
            stripeSubscriptionId: normalizeId(session.subscription),
            stripeCustomerId: normalizeId(session.customer),
            stripeProductId: lineItem.productId,
            stripePriceId: lineItem.priceId,
            amountTotal: session.amount_total ?? 0,
            currency: session.currency ?? "gbp",
            customerEmail: session.customer_details?.email ?? session.customer_email ?? null,
            productKeyFromMetadata: productKey,
          });
        } else if (productKey === "pathway") {
          await processPathwayCheckoutCompleted(db, {
            stripeCheckoutSessionId: session.id,
            stripePaymentIntentId: normalizeId(session.payment_intent),
            stripeCustomerId: normalizeId(session.customer),
            stripeProductId: lineItem.productId,
            stripePriceId: lineItem.priceId,
            amountTotal: session.amount_total ?? 0,
            currency: session.currency ?? "gbp",
            paymentStatus: session.payment_status,
            contactId: session.metadata?.contactId,
          });
        } else {
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
            productKeyFromMetadata: productKey,
            immediateDeliveryFromMetadata: session.metadata?.immediateDelivery,
          });
        }
        break;
      }
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        await processAsyncPaymentSucceeded(db, session.id, session.metadata?.immediateDelivery);
        break;
      }
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await processAsyncPaymentFailed(db, session.id);
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const currentPeriodEnd = getSubscriptionItemPeriodEnd(subscription);
        const currentPeriodStart = getSubscriptionItemPeriodStart(subscription);
        await handleSubscriptionUpdated(db, {
          stripeSubscriptionId: subscription.id,
          status: mapStripeSubscriptionStatus(subscription.status),
          currentPeriodStart: currentPeriodStart ? new Date(currentPeriodStart * 1000) : null,
          currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : null,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
        });
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(db, getCommunityProvider(), {
          stripeSubscriptionId: subscription.id,
          reason: subscription.cancellation_details?.reason ?? null,
        });
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId = normalizeId(charge.payment_intent);
        if (paymentIntentId) {
          await processRefund(db, getCommunityProvider(), {
            stripePaymentIntentId: paymentIntentId,
            amountRefunded: charge.amount_refunded,
            currency: charge.currency,
            fullyRefunded: charge.refunded,
          });
        } else {
          logger.warn("charge.refunded with no payment_intent on the charge", {
            provider: "stripe",
            action: "webhook.receive",
          });
        }
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
 * This Stripe API version (2025-03-31+, SDK v22+) moved
 * current_period_start/end off the top-level Subscription object onto
 * each SubscriptionItem — see the SDK's own CHANGELOG. A membership
 * subscription only ever has one item.
 */
function getSubscriptionItemPeriodStart(subscription: Stripe.Subscription): number | undefined {
  return subscription.items.data[0]?.current_period_start;
}
function getSubscriptionItemPeriodEnd(subscription: Stripe.Subscription): number | undefined {
  return subscription.items.data[0]?.current_period_end;
}

type SubscriptionStatus = (typeof import("@/db/schema").subscriptionStatusEnum.enumValues)[number];
const KNOWN_SUBSCRIPTION_STATUSES: readonly SubscriptionStatus[] = [
  "incomplete",
  "trialing",
  "active",
  "past_due",
  "unpaid",
  "paused",
  "canceled",
];

/** Our subscriptionStatusEnum uses the same strings as Stripe's own subscription.status, except we don't track "incomplete_expired" separately — folded into "incomplete". Stripe's own type includes a forward-compat catch-all string, so this validates against the known list rather than trusting the type alone. */
function mapStripeSubscriptionStatus(status: string): SubscriptionStatus {
  if (status === "incomplete_expired") return "incomplete";
  if ((KNOWN_SUBSCRIPTION_STATUSES as readonly string[]).includes(status)) {
    return status as SubscriptionStatus;
  }
  logger.warn("Unrecognised Stripe subscription status, defaulting to \"incomplete\"", {
    provider: "stripe",
    action: "mapStripeSubscriptionStatus",
    status,
  });
  return "incomplete";
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
