"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { env } from "@/lib/env";
import { getStoredConsent, type ConsentState } from "@/lib/consent";

/**
 * Loads GA4/Microsoft Clarity/Meta Pixel — but only when BOTH conditions
 * hold: the visitor has explicitly granted analytics consent (see
 * ConsentBanner.tsx), AND the corresponding NEXT_PUBLIC_*_ID env var is
 * actually set. No IDs are configured yet (Step 11 — client will add
 * NEXT_PUBLIC_CLARITY_PROJECT_ID once ready), so nothing loads in
 * practice until then, even after consent is granted.
 */
export function AnalyticsLoader() {
  const [consent, setConsent] = useState<ConsentState>("unset");

  useEffect(() => {
    // Same SSR/hydration reasoning as ConsentBanner.tsx — localStorage
    // isn't available server-side, so the initial "unset" (nothing loads)
    // must hold until after mount, not be read during the lazy initializer.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsent(getStoredConsent());
    function onChange(event: Event) {
      setConsent((event as CustomEvent<ConsentState>).detail);
    }
    window.addEventListener("cl-consent-change", onChange);
    return () => window.removeEventListener("cl-consent-change", onChange);
  }, []);

  if (consent !== "granted") return null;

  return (
    <>
      {env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');`}
          </Script>
        </>
      )}

      {env.NEXT_PUBLIC_CLARITY_PROJECT_ID && (
        <Script id="clarity-init" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");`}
        </Script>
      )}

      {env.NEXT_PUBLIC_META_PIXEL_ID && (
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${env.NEXT_PUBLIC_META_PIXEL_ID}');
              fbq('track', 'PageView');`}
        </Script>
      )}
    </>
  );
}
