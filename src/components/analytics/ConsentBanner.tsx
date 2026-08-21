"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getStoredConsent, setStoredConsent } from "@/lib/consent";

/**
 * Minimal accept/reject cookie banner — see src/lib/consent.ts for why
 * this isn't a third-party CMP. Copy and button treatment per
 * TCLC_Cookie_Policy_and_Consent_Build_v2.docx §3.3/§3.4 (client-supplied
 * 20 Aug 2026, paste-ready): "Accept and Reject must be equally
 * prominent. Same size, same weight, same position. A pale Reject link
 * beside a solid Accept button is not a free choice." Both buttons below
 * use the same variant/size for exactly that reason — do not restyle one
 * as secondary/outline.
 */
export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // localStorage doesn't exist during SSR, so the initial render must
    // stay `false` (matching server output) and only reveal the banner
    // after mount. A lazy useState initializer would read localStorage
    // during the client's first render pass too, which differs from the
    // server-rendered `null` and triggers a hydration mismatch — this
    // effect-based deferral is the correct fix, not the anti-pattern the
    // lint rule usually catches.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(getStoredConsent() === "unset");

    // Fires when the footer's "Cookie settings" link resets the stored
    // choice — reopens the banner without a page reload.
    function handleReset() {
      setVisible(true);
    }
    window.addEventListener("cl-consent-reset", handleReset);
    return () => window.removeEventListener("cl-consent-reset", handleReset);
  }, []);

  if (!visible) return null;

  function respond(granted: boolean) {
    setStoredConsent(granted ? "granted" : "denied");
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="border-border bg-background fixed inset-x-0 bottom-0 z-50 border-t p-4 shadow-lg sm:p-6"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-sm">
          We use cookies to make this site work. Some are essential, so that you can log in, buy
          things and stay secure. We would also like to set optional cookies that help us
          understand how the site is used. We will only do that if you agree.
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="secondary" size="sm" onClick={() => respond(false)}>
            Reject optional cookies
          </Button>
          <Button variant="secondary" size="sm" onClick={() => respond(true)}>
            Accept optional cookies
          </Button>
        </div>
      </div>
    </div>
  );
}
