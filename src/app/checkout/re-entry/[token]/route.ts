import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { PUBLIC_ROUTES } from "@/config/canon";

/**
 * Re-entry link — historically redirected straight into Circle's paywall
 * checkout (Step 10). Same 20 Aug 2026 client instruction as the
 * continuation route: must never charge/renew on its own any more.
 * Deliberately does not parse the token — see the continuation route's
 * comment for the full reasoning. Every visit lands on login.
 */
export async function GET() {
  const origin = env.NEXT_PUBLIC_SITE_URL;
  return NextResponse.redirect(`${origin}${PUBLIC_ROUTES.login}?notice=re-entry`, {
    status: 303,
  });
}
