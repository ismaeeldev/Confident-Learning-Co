import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { contacts } from "@/db/schema";
import { getSessionContactId } from "@/lib/session";
import { isGuideOwner, hasActiveMembership } from "@/domain/access/gates";
import { recordFitCheckAcknowledgement } from "@/domain/pathway/fitCheckAcknowledgement";
import { buildFitCheckLink } from "@/domain/pathway/buildFitCheckLink";
import { logger } from "@/lib/logger";
import { env } from "@/lib/env";
import { PUBLIC_ROUTES } from "@/config/canon";

/**
 * Records the Fit Check acknowledgement and sends the browser straight to
 * ScoreApp — a plain form POST + 303 redirect, deliberately no client JS,
 * so the navigation is guaranteed same-tab (Annexe A: "Please do not put
 * the quiz in an iframe" / "open it in the same tab"). Gates re-checked
 * here, not just at the page — this endpoint can be hit directly.
 */
export async function POST() {
  const origin = env.NEXT_PUBLIC_SITE_URL;
  const contactId = await getSessionContactId();
  if (!contactId) {
    return NextResponse.redirect(`${origin}${PUBLIC_ROUTES.login}`, { status: 303 });
  }
  if (!(await isGuideOwner(db, contactId)) || !(await hasActiveMembership(db, contactId))) {
    return NextResponse.redirect(`${origin}${PUBLIC_ROUTES.accessPending}?reason=not_active_member`, {
      status: 303,
    });
  }

  const [contact] = await db
    .select({ firstName: contacts.firstName, email: contacts.email })
    .from(contacts)
    .where(eq(contacts.id, contactId))
    .limit(1);

  if (!contact) {
    return NextResponse.redirect(`${origin}${PUBLIC_ROUTES.login}`, { status: 303 });
  }

  await recordFitCheckAcknowledgement(db, contactId);

  const fitCheckUrl = buildFitCheckLink(contact.firstName ?? "", contact.email);
  if (!fitCheckUrl) {
    logger.error("Fit Check link requested but SCOREAPP_FIT_CHECK_URL is not configured", {
      provider: "internal",
      action: "pathway.acknowledge",
    });
    // Never a broken/blank page — send them home with the acknowledgement
    // already safely recorded; the client owes this URL (top-level §10
    // item 14), this is not the member's problem to see.
    return NextResponse.redirect(`${origin}${PUBLIC_ROUTES.memberHome}`, { status: 303 });
  }

  return NextResponse.redirect(fitCheckUrl, { status: 303 });
}
