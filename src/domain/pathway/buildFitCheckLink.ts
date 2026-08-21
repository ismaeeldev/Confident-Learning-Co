import "server-only";
import { env } from "@/lib/env";

/**
 * Builds the Fit Check ScoreApp link — server-side, per visit, per Annexe
 * A's single most important requirement: the member must never be asked
 * for their email a second time. Both values are URL-encoded (Annexe A
 * names a `+` in the email address as a known failure mode if not).
 *
 * Returns null when `SCOREAPP_FIT_CHECK_URL` isn't configured yet — the
 * client owes this address (top-level §10 item 14), not yet supplied.
 * Never guesses a URL.
 */
export function buildFitCheckLink(firstName: string, email: string): string | null {
  if (!env.SCOREAPP_FIT_CHECK_URL) return null;

  const url = new URL(env.SCOREAPP_FIT_CHECK_URL);
  url.searchParams.set("first_name", firstName);
  url.searchParams.set("email", email);
  return url.toString();
}
