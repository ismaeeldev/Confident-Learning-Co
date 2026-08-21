"use client";

import { resetStoredConsent } from "@/lib/consent";

/**
 * Persistent footer link letting a visitor change their cookie choice
 * later — required by TCLC_Cookie_Policy_and_Consent_Build_v2.docx §3.3.
 * Reopens ConsentBanner via the "cl-consent-reset" event rather than
 * reloading the page.
 */
export function CookieSettingsLink() {
  return (
    <button
      type="button"
      onClick={() => resetStoredConsent()}
      className="hover:text-brand-gold-300 underline-offset-4 hover:underline"
    >
      Cookie settings
    </button>
  );
}
