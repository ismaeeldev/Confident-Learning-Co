"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next";
import { isAnalyticsEnabled } from "@/lib/analyticsConsent";

/**
 * Renders Vercel Web Analytics unless the visitor has switched it off on
 * the Cookies and Tracking page (src/lib/analyticsConsent.ts). Defaults to
 * on — Vercel Web Analytics is cookieless, so this isn't gating on
 * consent in the accept/reject sense, it's the visible opt-out the client
 * asked for. Starts enabled during SSR/first paint (matching the default)
 * and reacts live if the visitor changes their choice without a reload.
 */
export function AnalyticsGate() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(isAnalyticsEnabled());
    function onChange(event: Event) {
      setEnabled((event as CustomEvent<boolean>).detail);
    }
    window.addEventListener("cl-analytics-consent-change", onChange);
    return () => window.removeEventListener("cl-analytics-consent-change", onChange);
  }, []);

  if (!enabled) return null;
  return <Analytics />;
}
