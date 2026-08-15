/**
 * Minimal, hand-rolled service worker for The Confident Learning Co.
 *
 * SCOPING DECISION — READ BEFORE EDITING:
 * This is a marketing site with Stripe checkout, signed membership/re-entry
 * links, and third-party embeds (Circle, Kit, ScoreApp). It is NOT an
 * offline-first app and has no authenticated session of its own (membership
 * auth lives on Circle's platform). The only jobs of this service worker are:
 *   1. Let the site be installable (a manifest + a registered SW satisfies
 *      browser install criteria).
 *   2. Show a friendly offline page instead of the browser's default error
 *      when navigation fails with no connection.
 *   3. Speed up repeat visits by cache-first serving of Next's hashed,
 *      immutable /_next/static/ assets.
 *
 * Everything else — every API route, every checkout route, every non-GET
 * request, and anything cross-origin — is deliberately left completely
 * untouched by this file. No Workbox, no runtime caching library: the whole
 * file is small on purpose so it stays auditable at a glance.
 *
 * Explicitly excluded from any interception (network pass-through only):
 *   - Any request with method !== "GET" (form posts, webhooks, cron calls —
 *     caching or intercepting a POST would be a serious bug)
 *   - /api/*        (src/app/api/**: cron/process-integration-jobs,
 *                     cron/reconcile, forms/newsletter, forms/reset-enquiry,
 *                     health, webhooks/circle, webhooks/stripe)
 *   - /checkout/*   (src/app/checkout/**: guide, membership/[token],
 *                     re-entry/[token], success, cancelled, link-invalid —
 *                     Stripe checkout initiation and signed re-entry links)
 *   - Any cross-origin request (Stripe.js, Circle, Kit, ScoreApp embed) —
 *     the fetch handler below checks request.url's origin defensively even
 *     though the SW only ever sees same-origin requests by default.
 */

// Manually-bumped version string. Next's build ID isn't trivially available
// inside a static public/ file without extra build tooling, so this is a
// documented, deliberate simplification: bump CACHE_VERSION whenever the
// precached asset list below changes.
const CACHE_VERSION = "v1";
const CACHE_NAME = `cl-sw-${CACHE_VERSION}`;

const PRECACHE_URLS = ["/offline", "/icon.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Never touch non-GET requests (form submissions, webhooks, cron calls).
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Never touch cross-origin requests (Stripe.js, Circle, Kit, ScoreApp, etc).
  if (url.origin !== self.location.origin) return;

  // Never touch API or checkout routes — pass straight through to network.
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/checkout/")) return;

  // Navigation requests: network-first, no caching of page HTML. Only fall
  // back to the precached offline page if the network request itself fails.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/offline")),
    );
    return;
  }

  // Hashed, immutable Next.js static assets: cache-first.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
            return response;
          }),
      ),
    );
    return;
  }

  // Everything else: pass through untouched, no caching, no interception.
});
