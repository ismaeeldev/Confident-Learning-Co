"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getStoredConsent, setStoredConsent } from "@/lib/consent";

/** Minimal accept/reject cookie banner — see src/lib/consent.ts for why this isn't a third-party CMP. */
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
          We use analytics cookies to understand how the site is used. Nothing loads until you
          say yes.
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" onClick={() => respond(false)}>
            No thanks
          </Button>
          <Button size="sm" onClick={() => respond(true)}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
