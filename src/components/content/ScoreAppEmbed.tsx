"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Skeleton } from "@/components/ui/skeleton";
import { PUBLIC_ROUTES } from "@/config/canon";
import Link from "next/link";

interface ScoreAppEmbedProps {
  embedUrl: string | undefined;
}

/**
 * Full-width, mobile-safe ScoreApp embed shell. See
 * docs/00-ApplicationFlow.md 0.4 and docs/05-RouteAndContentMap.md 5.3.
 *
 * ScoreApp's real embed method is not a plain iframe: it's a marker `<div>`
 * carrying `data-sa-url`/`data-sa-view` attributes, hydrated client-side by
 * ScoreApp's own `embedding.js`, which injects the actual iframe into that
 * div once it loads. We render the marker div plus the script tag, and
 * watch the div for the injected iframe via MutationObserver to know when
 * to hide our own loading skeleton.
 *
 * `embedUrl` should be the "Questions" starting-screen inline embed URL
 * from ScoreApp's Embed and share screen (the `data-sa-url` value), e.g.
 * `https://<scorecard-id>.scoreapp.com/questions?sa_target=_top` — chosen
 * so the embed skips ScoreApp's own landing page, since this page already
 * has its own hero/headline content above the embed.
 *
 * CSP: if a Content-Security-Policy is added later, it must allow:
 * - script-src: static.scoreapp.com
 * - frame-src / child-src: *.scoreapp.com
 * - connect-src: *.scoreapp.com (the embedded iframe calls ScoreApp's API)
 *
 * Renders an accessible fallback link when no embed URL is configured yet.
 */
export function ScoreAppEmbed({ embedUrl }: ScoreAppEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !embedUrl) return;

    // MutationObserver to watch for iframe injection by ScoreApp
    const observer = new MutationObserver(() => {
      if (container.querySelector("iframe")) {
        setLoaded(true);
        observer.disconnect();
      }
    });
    observer.observe(container, { childList: true, subtree: true });

    // Helper to trigger ScoreApp initialization safely on client mount
    const initWidget = () => {
      if (container.querySelector("iframe")) {
        setLoaded(true);
        return;
      }
      const saWidget = (window as any).ScoreAppWidget;
      if (saWidget) {
        try {
          saWidget.createFromElement(container);
        } catch (e) {
          console.error("ScoreAppWidget init failed:", e);
        }
      }
    };

    // If script is already loaded and window.ScoreAppWidget exists
    if ((window as any).ScoreAppWidget) {
      initWidget();
    } else {
      // Load script dynamically to avoid hydration mismatches
      const scriptId = "scoreapp-embed-script";
      let script = document.getElementById(scriptId) as HTMLScriptElement;
      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://static.scoreapp.com/js/integration/v1/embedding.js";
        script.async = true;
        document.head.appendChild(script);
      }
      
      const handleLoad = () => {
        initWidget();
      };
      script.addEventListener("load", handleLoad);
      return () => {
        script.removeEventListener("load", handleLoad);
        observer.disconnect();
      };
    }

    return () => observer.disconnect();
  }, [embedUrl]);

  if (!embedUrl) {
    return (
      <div className="border-brand-sage-300 bg-surface-sage flex flex-col items-center gap-4 rounded-2xl border border-dashed p-10 text-center">
        <p className="text-brand-sage-800 max-w-md break-words">
          The Reflection quiz embed is not yet configured for this environment. Set
          <code className="text-brand-navy-900 mx-1 inline-block rounded bg-black/5 px-1.5 py-0.5 text-sm break-all">
            NEXT_PUBLIC_SCOREAPP_EMBED_URL
          </code>
          once ScoreApp verification (Step 5) is complete.
        </p>
        <Link href={PUBLIC_ROUTES.privacy} className="text-brand-sage-800 underline underline-offset-4">
          Read our privacy policy
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full overflow-hidden rounded-2xl" style={{ minHeight: 640 }}>
        {!loaded && <Skeleton className="absolute inset-0 h-full w-full rounded-2xl" />}
        <div
          ref={containerRef}
          data-sa-url={embedUrl}
          data-sa-view="inline"
          data-sa-auto-height="1"
          style={{ maxWidth: "100%", width: "100%" }}
        />
      </div>
      <p className="text-muted-foreground text-sm">
        Having trouble with the embed?{" "}
        <a href={embedUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4">
          Open the Reflection in a new tab
        </a>
        , or read our{" "}
        <Link href={PUBLIC_ROUTES.privacy} className="underline underline-offset-4">
          privacy policy
        </Link>
        .
      </p>
    </div>
  );
}
