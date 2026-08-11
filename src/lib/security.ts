import "server-only";

/** Honeypot field convention for public forms: must arrive empty. */
export function isHoneypotTripped(honeypotValue: string | undefined): boolean {
  return Boolean(honeypotValue && honeypotValue.length > 0);
}

interface RateLimitEntry {
  count: number;
  windowStartedAt: number;
}

/**
 * Minimal in-memory fixed-window rate limiter for public form endpoints.
 * Adequate for a single Vercel region; replace with a durable store
 * (e.g. Upstash) if multi-region rate limiting becomes necessary.
 */
export function createRateLimiter(options: { limit: number; windowMs: number }) {
  const hits = new Map<string, RateLimitEntry>();

  return {
    check(key: string): { allowed: boolean; remaining: number } {
      const now = Date.now();
      const entry = hits.get(key);

      if (!entry || now - entry.windowStartedAt > options.windowMs) {
        hits.set(key, { count: 1, windowStartedAt: now });
        return { allowed: true, remaining: options.limit - 1 };
      }

      if (entry.count >= options.limit) {
        return { allowed: false, remaining: 0 };
      }

      entry.count += 1;
      return { allowed: true, remaining: options.limit - entry.count };
    },
  };
}
