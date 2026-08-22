import "server-only";
import { eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import { contacts, formSubmissions } from "@/db/schema";
import { createSignedLink, LOGIN_LINK_EXPIRY_SECONDS } from "@/lib/signedLinks";
import { sendTransactionalEmail } from "@/lib/email";
import { isRateLimited } from "@/lib/rateLimit";
import { normalizeEmail } from "@/lib/normalizeEmail";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { ALLOWED_POST_LOGIN_REDIRECTS, PUBLIC_ROUTES } from "@/config/canon";

type Database = NeonHttpDatabase<typeof schema>;

/**
 * Requests a magic sign-in link for an email address (Phase 3, Annexe B
 * section 5.1/5.2). Deliberately enumeration-safe: the caller (the API
 * route) must return the exact same generic response regardless of what
 * this function returns or does internally — whether the email is
 * registered is never observable from the outside.
 *
 * Accounts are created at purchase, not open registration (Build
 * Requirements section 1.2), so this never creates a contact — only an
 * existing one can sign in.
 */
export async function requestLoginLink(db: Database, email: string, next?: string): Promise<void> {
  const redirectTo = next && ALLOWED_POST_LOGIN_REDIRECTS.includes(next) ? next : undefined;
  if (await isRateLimited(db, "login_request", email, 60)) {
    // Silently drop rather than surface — the caller's response is
    // identical either way, so a rate-limited retry just doesn't send a
    // second email rather than erroring.
    return;
  }

  await db.insert(formSubmissions).values({
    kind: "login_request",
    email,
    payload: {},
    status: "received",
  });

  // Bug fix (full-codebase review): contacts.email is written normalized
  // (see upsertContactByEmail/normalizeEmail) but this lookup previously
  // compared the raw, un-normalized input — a registered member typing
  // their email with different casing than it was stored under would
  // silently fail to find their own account and never receive a sign-in
  // link, with no error surfaced (this function is deliberately
  // enumeration-safe, so the caller sees the same generic response either
  // way, making this failure invisible until a real member reported it).
  const [contact] = await db
    .select({ id: contacts.id, firstName: contacts.firstName })
    .from(contacts)
    .where(eq(contacts.email, normalizeEmail(email)))
    .limit(1);

  if (!contact) return;

  const { token } = await createSignedLink(contact.id, "login", LOGIN_LINK_EXPIRY_SECONDS);
  const magicLinkUrl = new URL(PUBLIC_ROUTES.authVerify(token), env.NEXT_PUBLIC_SITE_URL);
  if (redirectTo) {
    magicLinkUrl.searchParams.set("next", redirectTo);
  }

  // Exact copy, Annexe B section 5.2. Do not paraphrase.
  //
  // Deliberately swallows a send failure rather than letting it propagate:
  // an unregistered email returns from this function normally (line 47
  // above), so if a send failure were allowed to throw here, a registered
  // email would produce a different outcome (a 500 at the API route) than
  // an unregistered one (a 200) — an enumeration side-channel. The token
  // was already minted and is valid; only the outbound email failed, so
  // this is logged for operator visibility, not surfaced to the caller.
  try {
    await sendTransactionalEmail({
      to: email,
      subject: "Your sign-in link",
      text: `Hello,\n\nHere is your link to sign in to The Confident Learning Co. It works for the next fifteen minutes.\n\n${magicLinkUrl.toString()}\n\nIf you did not ask for this, you can ignore this email and nothing will happen.\n\nThe Confident Learning Co.\nAdam Parker-Steed, a sole trader, trading as The Confident Learning Co., 49 Station Road, Polegate, East Sussex, BN26 6EA`,
    });
  } catch (error) {
    logger.error("Failed to send magic-link sign-in email", {
      provider: "resend",
      action: "auth.sendLoginLink",
      safeErrorMessage: error instanceof Error ? error.message : "unknown error",
    });
  }
}
