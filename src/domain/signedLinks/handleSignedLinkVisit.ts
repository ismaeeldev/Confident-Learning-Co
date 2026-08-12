import "server-only";
import { NextResponse } from "next/server";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import { consumeSignedLink } from "./consumeSignedLink";
import type { SignedLinkKind } from "@/lib/signedLinks";
import { env } from "@/lib/env";
import { CIRCLE_MEMBERSHIP_CHECKOUT_PATH, PUBLIC_ROUTES } from "@/config/canon";

type Database = NeonHttpDatabase<typeof schema>;

/**
 * Shared handler for both /checkout/membership/[token] (continuation) and
 * /checkout/re-entry/[token] (reentry) — verifies + claims the token, then
 * either redirects to Circle's real paywall checkout or to a friendly
 * explanation page. This route never processes payment itself; Circle's
 * own native paywall does (see CIRCLE_MEMBERSHIP_CHECKOUT_PATH).
 */
export async function handleSignedLinkVisit(
  db: Database,
  token: string,
  kind: SignedLinkKind,
): Promise<NextResponse> {
  const origin = env.NEXT_PUBLIC_SITE_URL;
  const result = await consumeSignedLink(db, token, kind);

  if (result.outcome !== "success") {
    return NextResponse.redirect(`${origin}${PUBLIC_ROUTES.checkoutLinkInvalid}?reason=${result.outcome}`, {
      status: 303,
    });
  }

  if (!env.CIRCLE_COMMUNITY_URL) {
    // Fail safe rather than redirecting somewhere broken.
    return NextResponse.redirect(`${origin}${PUBLIC_ROUTES.home}`, { status: 303 });
  }

  return NextResponse.redirect(`${env.CIRCLE_COMMUNITY_URL}${CIRCLE_MEMBERSHIP_CHECKOUT_PATH}`, { status: 303 });
}
