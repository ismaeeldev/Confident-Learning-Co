"use client";

import { useEffect, useState } from "react";
import { isAnalyticsEnabled, setAnalyticsEnabled } from "@/lib/analyticsConsent";

/**
 * The single toggle the client asked for (25 Aug 2026): "a single toggle
 * that turns Vercel Web Analytics off for that visitor, defaulting to
 * on." No banner, no interstitial — this is the only control, reached
 * only via the persistent "Cookies and tracking" footer link.
 */
export function AnalyticsToggle() {
  const [enabled, setEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(isAnalyticsEnabled());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  function handleChange(next: boolean) {
    setEnabled(next);
    setAnalyticsEnabled(next);
  }

  return (
    <div className="border-border bg-surface flex items-center justify-between gap-4 rounded-2xl border p-5">
      <div className="flex flex-col gap-1">
        <label htmlFor="analytics-toggle" className="text-brand-navy-950 font-semibold">
          Website analytics
        </label>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Vercel Web Analytics helps us understand how the site is used. It does not use cookies
          or track you individually across visits. On by default — switch it off here at any
          time.
        </p>
      </div>
      <label className="relative inline-flex shrink-0 cursor-pointer items-center">
        <input
          id="analytics-toggle"
          type="checkbox"
          className="peer sr-only"
          checked={mounted ? enabled : true}
          onChange={(event) => handleChange(event.target.checked)}
          aria-label="Website analytics"
        />
        <span className="bg-muted peer-checked:bg-brand-sage-700 block h-7 w-12 rounded-full transition-colors" />
        <span className="absolute left-1 size-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
      </label>
    </div>
  );
}
