import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { purchaseConsentSchema } from "@/domain/checkout/purchaseConsentSchema";
import { recordPurchaseConsent } from "@/domain/checkout/recordPurchaseConsent";
import { getFoundersSoldCount, getFoundersWindowState } from "@/domain/founders/foundersCounter";
import { getPaymentProvider } from "@/integrations/stripe/client";
import { products } from "@/config/products";
import { logger } from "@/lib/logger";
import { env } from "@/lib/env";
import { PUBLIC_ROUTES } from "@/config/canon";

/**
 * R1's consent step. The two required boxes (age, terms) are enforced
 * here server-side, not just in the UI — a direct call with either
 * unticked is rejected regardless of what the client sent. The two
 * optional boxes never block; immediate release only happens when *both*
 * are ticked (R1.1: "Immediate supply happens only if both are ticked. If
 * either is left unticked, the download is held"). Consent is recorded
 * *before* redirecting to Stripe (checkout may never complete), then
 * correlated to the resulting session id — this route creates the Stripe
 * session first specifically so that id exists to record against.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = purchaseConsentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "You must confirm you are 18 or over and agree to the terms to continue" },
      { status: 400 },
    );
  }

  const product = products[parsed.data.productKey];
  if (!product.stripePriceId || !product.stripeProductId) {
    logger.error("Checkout requested but Stripe product/price is not configured", {
      provider: "stripe",
      action: "checkout.consent",
      status: parsed.data.productKey,
    });
    return NextResponse.json({ error: "This isn't available yet. Please try again shortly." }, { status: 503 });
  }

  const origin = env.NEXT_PUBLIC_SITE_URL;
  const provider = getPaymentProvider();

  // Phase 7: the server decides founders-vs-full pricing, never the
  // client — a stale page open past the cap/date must still be charged
  // correctly, and this is the "checkout for the founders price is
  // genuinely rejected server-side" enforcement point. Only the Guide has
  // a founders price at all; every other product ignores this.
  let stripeProductId = product.stripeProductId;
  let stripePriceId = product.stripePriceId;
  if (parsed.data.productKey === "guide") {
    const soldCount = await getFoundersSoldCount(db);
    const windowState = getFoundersWindowState(soldCount, new Date());
    if (!windowState.open) {
      if (!env.STRIPE_GUIDE_FULL_PRICE_ID || !env.STRIPE_GUIDE_FULL_PRODUCT_ID) {
        logger.error("Founders window closed but no full-price Stripe product/price is configured", {
          provider: "stripe",
          action: "checkout.consent",
          errorCode: "missing_full_price_config",
        });
        return NextResponse.json({ error: "This isn't available yet. Please try again shortly." }, { status: 503 });
      }
      stripeProductId = env.STRIPE_GUIDE_FULL_PRODUCT_ID;
      stripePriceId = env.STRIPE_GUIDE_FULL_PRICE_ID;
    }
  }

  // R1.1: immediate release requires BOTH optional boxes ticked — either
  // one alone still holds the download. Computed once here so every
  // downstream consumer (Stripe metadata, the webhook, the confirmation
  // email) sees a single already-combined decision, never each box
  // separately.
  const immediateDelivery = parsed.data.immediateDeliveryConsent && parsed.data.cancellationRightAcknowledged;

  try {
    const session = await provider.createCheckoutSession({
      productKey: parsed.data.productKey,
      priceIdOverride: stripePriceId,
      metadata: {
        productKey: parsed.data.productKey,
        stripeProductId,
        stripePriceId,
        immediateDelivery: String(immediateDelivery),
      },
      successUrl: `${origin}${PUBLIC_ROUTES.checkoutSuccess}?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}${PUBLIC_ROUTES.checkoutCancelled}`,
    });

    // customerEmail isn't known yet at this point — Stripe collects it on
    // its own hosted page for a guest checkout — so consent is recorded
    // against the Checkout Session id and backfilled with the real email
    // once the webhook confirms the purchase (attachEmailToPurchaseConsent).
    await recordPurchaseConsent(db, session.id, parsed.data);

    return NextResponse.json({ redirectUrl: session.url });
  } catch (error) {
    logger.error("Failed to create Checkout session from the consent step", {
      provider: "stripe",
      action: "checkout.consent",
      safeErrorMessage: error instanceof Error ? error.message : "unknown error",
    });
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
  }
}
