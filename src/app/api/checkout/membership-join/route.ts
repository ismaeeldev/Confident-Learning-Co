import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { contacts } from "@/db/schema";
import { getSessionContactId } from "@/lib/session";
import { isGuideOwner } from "@/domain/access/gates";
import { membershipJoinConsentSchema } from "@/domain/checkout/membershipJoinSchemas";
import { recordMembershipJoinConsent } from "@/domain/checkout/recordMembershipJoinConsent";
import { getPaymentProvider } from "@/integrations/stripe/client";
import { logger } from "@/lib/logger";
import { env } from "@/lib/env";
import { PUBLIC_ROUTES } from "@/config/canon";

/**
 * Membership join route's consent step. Requires an existing session —
 * this route never creates or signs in a contact, it only records consent
 * for one already identified via the login flow. All 3 required boxes
 * (Build Addendum A v2.2, R1) are enforced here, not just in the UI — a
 * direct call with any unticked is rejected with 400 regardless of what
 * the client sent.
 *
 * R3 rebuild (client-confirmed 20 Aug 2026): consent is recorded, then the
 * browser is sent to our own Stripe Checkout for the membership
 * subscription — never to Circle's own checkout page. The single-use
 * Circle invitation is issued afterward, from the Stripe webhook, once
 * payment genuinely succeeds (processMembershipCheckout.ts).
 */
export async function POST(request: Request) {
  const contactId = await getSessionContactId();
  if (!contactId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  // Phase 4 gate, enforced here too — not just at the page level — since
  // this endpoint can be hit directly, bypassing the page's redirect.
  if (!(await isGuideOwner(db, contactId))) {
    return NextResponse.json({ error: "Guide ownership required" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = membershipJoinConsentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Both required boxes must be ticked" }, { status: 400 });
  }

  const [contact] = await db
    .select({ email: contacts.email })
    .from(contacts)
    .where(eq(contacts.id, contactId))
    .limit(1);

  if (!contact) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  await recordMembershipJoinConsent(db, contactId, contact.email, parsed.data);

  const origin = env.NEXT_PUBLIC_SITE_URL;
  const provider = getPaymentProvider();

  try {
    const session = await provider.createCheckoutSession({
      productKey: "membership",
      customerEmail: contact.email,
      mode: "subscription",
      metadata: { productKey: "membership" },
      successUrl: `${origin}${PUBLIC_ROUTES.checkoutMembershipSuccess}?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}${PUBLIC_ROUTES.checkoutCancelled}`,
    });
    return NextResponse.json({ redirectUrl: session.url });
  } catch (error) {
    logger.error("Failed to create membership Checkout session", {
      provider: "stripe",
      action: "checkout.membershipJoin",
      safeErrorMessage: error instanceof Error ? error.message : "unknown error",
    });
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
  }
}

/** Guards against an unauthenticated GET landing straight on this API route instead of the join page. */
export async function GET() {
  const origin = env.NEXT_PUBLIC_SITE_URL;
  return NextResponse.redirect(`${origin}${PUBLIC_ROUTES.checkoutMembershipJoin}`, { status: 303 });
}
