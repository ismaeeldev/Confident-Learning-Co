import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { PUBLIC_ROUTES } from "@/config/canon";

/**
 * Phase 6, 20 Aug 2026: this used to redirect straight into Stripe
 * Checkout. It now redirects to the consent step first (the client's
 * explicit requirement — consent "cannot sit on the Stripe element"),
 * which itself creates the Stripe session once both boxes are resolved.
 * Kept as a route (not deleted) since existing links/buttons across the
 * site point at `/checkout/guide`.
 */
export async function GET() {
  const origin = env.NEXT_PUBLIC_SITE_URL;
  return NextResponse.redirect(`${origin}${PUBLIC_ROUTES.checkoutGuideConsent}`, { status: 303 });
}
