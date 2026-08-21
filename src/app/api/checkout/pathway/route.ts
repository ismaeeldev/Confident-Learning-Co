import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { getSessionContactId } from "@/lib/session";
import { isGuideOwner, hasActiveMembership } from "@/domain/access/gates";
import { getPaymentProvider } from "@/integrations/stripe/client";
import { products } from "@/config/products";
import { PUBLIC_ROUTES, FOUNDERS_CLOSE_DATE } from "@/config/canon";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

/**
 * Creates the Stripe Checkout session for a Pathway call booking (Phase
 * 11). Gated the same way as /pathway itself — Guide owner + active
 * membership. Price switches from the founders price to the full price
 * at the same cutoff as the Guide's founders window (Annexe C: "it
 * changes at the end of September") — no separate cap for Pathway, date
 * only. No consent step here (unlike the Guide/packs) — Annexe A doesn't
 * specify one for this route, and the Fit Check acknowledgement already
 * covers the relevant disclosures before a member ever reaches this page.
 */
export async function POST() {
  const contactId = await getSessionContactId();
  if (!contactId) {
    return NextResponse.json({ error: "Please sign in to book a Pathway call." }, { status: 401 });
  }
  if (!(await isGuideOwner(db, contactId)) || !(await hasActiveMembership(db, contactId))) {
    return NextResponse.json({ error: "This isn't available for your account." }, { status: 403 });
  }

  const product = products.pathway;
  if (!product.stripePriceId) {
    logger.error("Pathway checkout requested but STRIPE_PATHWAY_PRICE_ID is not configured", {
      provider: "stripe",
      action: "checkout.pathway",
    });
    return NextResponse.json({ error: "This isn't available yet. Please try again shortly." }, { status: 503 });
  }

  const origin = env.NEXT_PUBLIC_SITE_URL;
  const provider = getPaymentProvider();
  const isFoundersWindowOpen = new Date() < FOUNDERS_CLOSE_DATE;

  let stripePriceId = product.stripePriceId;
  if (!isFoundersWindowOpen) {
    if (!env.STRIPE_PATHWAY_FULL_PRICE_ID) {
      logger.error("Pathway founders window closed but STRIPE_PATHWAY_FULL_PRICE_ID is not configured", {
        provider: "stripe",
        action: "checkout.pathway",
        errorCode: "missing_full_price_config",
      });
      return NextResponse.json({ error: "This isn't available yet. Please try again shortly." }, { status: 503 });
    }
    stripePriceId = env.STRIPE_PATHWAY_FULL_PRICE_ID;
  }

  try {
    const session = await provider.createCheckoutSession({
      productKey: "pathway",
      priceIdOverride: stripePriceId,
      metadata: {
        productKey: "pathway",
        stripeProductId: product.stripeProductId ?? "unknown",
        stripePriceId,
        contactId,
      },
      successUrl: `${origin}${PUBLIC_ROUTES.pathwayBooked}?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}${PUBLIC_ROUTES.pathwayBook}`,
    });

    return NextResponse.json({ redirectUrl: session.url, foundersPrice: isFoundersWindowOpen });
  } catch (error) {
    logger.error("Failed to create Checkout session for a Pathway booking", {
      provider: "stripe",
      action: "checkout.pathway",
      safeErrorMessage: error instanceof Error ? error.message : "unknown error",
    });
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
  }
}
