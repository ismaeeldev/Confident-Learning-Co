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
 * DEPRECATED, no longer called by anything (Phase 3, 20 Aug 2026). The
 * client confirmed continuation/re-entry links must never redirect
 * straight into Circle checkout any more — both routes now redirect to
 * /login unconditionally instead (see their route.ts files). Kept here
 * rather than deleted in case the "membership join route" work ends up
 * wanting the verify-and-claim logic — remove this file entirely once
 * that's settled and nothing references it. See top-level §2 of
 * V2-BUILD-REQUIREMENTS-IMPLEMENTATION-GUIDE.md for the full context.
 *
 * Original purpose: shared handler for both /checkout/membership/[token]
 * (continuation) and /checkout/re-entry/[token] (reentry) — verified +
 * claimed the token, then redirected to Circle's real paywall checkout or
 * a friendly explanation page.
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
