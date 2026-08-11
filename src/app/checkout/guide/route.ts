import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/integrations/stripe/client";
import { products } from "@/config/products";
import { env } from "@/lib/env";
import { PUBLIC_ROUTES } from "@/config/canon";
import { logger } from "@/lib/logger";

/**
 * Redirects the parent straight into Stripe-hosted Checkout for the Guide —
 * the single public paid entry point. No custom card form; Stripe owns the
 * payment page. See docs/00-ApplicationFlow.md.
 */
export async function GET() {
  const origin = env.NEXT_PUBLIC_SITE_URL;
  const guide = products.guide;

  if (!guide.stripePriceId || !guide.stripeProductId) {
    logger.error("Guide checkout requested but Stripe product/price is not configured", {
      provider: "stripe",
      action: "checkout.guide",
    });
    return NextResponse.redirect(`${origin}${PUBLIC_ROUTES.checkoutCancelled}?error=not_configured`, {
      status: 303,
    });
  }

  try {
    const provider = getPaymentProvider();
    const session = await provider.createCheckoutSession({
      productKey: "guide",
      metadata: {
        productKey: "guide",
        stripeProductId: guide.stripeProductId,
        stripePriceId: guide.stripePriceId,
      },
      successUrl: `${origin}${PUBLIC_ROUTES.checkoutSuccess}?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}${PUBLIC_ROUTES.checkoutCancelled}`,
    });
    return NextResponse.redirect(session.url, { status: 303 });
  } catch (error) {
    logger.error("Failed to create Guide checkout session", {
      provider: "stripe",
      action: "checkout.guide",
      safeErrorMessage: error instanceof Error ? error.message : "unknown error",
    });
    return NextResponse.redirect(`${origin}${PUBLIC_ROUTES.checkoutCancelled}?error=checkout_failed`, {
      status: 303,
    });
  }
}
