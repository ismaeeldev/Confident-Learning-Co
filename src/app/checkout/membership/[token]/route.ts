import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { PUBLIC_ROUTES } from "@/config/canon";

/**
 * Continuation link — historically redirected straight into Circle's
 * paywall checkout (Step 10). Per the client's confirmed 20 Aug 2026
 * answer, this must no longer start/continue/renew a subscription on its
 * own: "a link that charges someone without passing through [the consent]
 * page produces a payment I cannot evidence agreement for."
 *
 * Deliberately does not attempt to parse or consume the token at all —
 * the old behaviour (redirect to Circle checkout) must never fire again
 * under any circumstance, so the simplest and safest fix is to never look
 * at the token's validity. Every visit, valid old token or not, lands on
 * login. Real emails already sent before this change point here, so the
 * route stays live rather than being deleted.
 */
export async function GET() {
  const origin = env.NEXT_PUBLIC_SITE_URL;
  return NextResponse.redirect(`${origin}${PUBLIC_ROUTES.login}?notice=continue-membership`, {
    status: 303,
  });
}
