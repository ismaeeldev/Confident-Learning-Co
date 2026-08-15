"use client";

import { useEffect } from "react";

/**
 * Registers public/sw.js — but only in production, and only if the browser
 * supports service workers at all. Never registers in development/preview,
 * so local dev is never affected by stale service-worker state.
 *
 * Uses NODE_ENV rather than src/lib/env.ts's APP_ENV: APP_ENV is declared
 * server-only in that t3-env schema (not in its `client` block), so reading
 * it from this "use client" component would throw at runtime. NODE_ENV is
 * inlined by Next at build time and is safe to read client-side, and
 * "production" here is exactly the same signal the standard asks for.
 *
 * Per the "service worker failure principle": registration failure is
 * swallowed with a console warning at most. The site must remain fully
 * usable whether or not this succeeds.
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch((error: unknown) => {
      console.warn("Service worker registration failed:", error);
    });
  }, []);

  return null;
}
