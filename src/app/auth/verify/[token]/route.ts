import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { consumeSignedLink } from "@/domain/signedLinks/consumeSignedLink";
import { createSession } from "@/lib/session";
import { env } from "@/lib/env";
import { ALLOWED_POST_LOGIN_REDIRECTS, PUBLIC_ROUTES } from "@/config/canon";

/**
 * Verifies a magic sign-in link, single-use (Phase 3). On success, sets
 * the session cookie and redirects to the member home page. On any
 * failure (expired, already used, malformed), redirects back to /login
 * with a reason — never an error page, matching Annexe B's exact wording
 * for the expired-link state.
 */
export async function GET(request: Request, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params;
  const origin = env.NEXT_PUBLIC_SITE_URL;

  const result = await consumeSignedLink(db, token, "login");

  if (result.outcome !== "success") {
    const reason = result.outcome === "expired" ? "expired" : "invalid";
    return NextResponse.redirect(`${origin}${PUBLIC_ROUTES.login}?reason=${reason}`, { status: 303 });
  }

  await createSession(result.contactId);

  const requestedNext = new URL(request.url).searchParams.get("next");
  const destination =
    requestedNext && ALLOWED_POST_LOGIN_REDIRECTS.includes(requestedNext)
      ? requestedNext
      : PUBLIC_ROUTES.memberHome;

  return NextResponse.redirect(`${origin}${destination}`, { status: 303 });
}
