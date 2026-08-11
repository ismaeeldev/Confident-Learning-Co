import "server-only";
import { logger } from "@/lib/logger";
import { env } from "@/lib/env";
import { assertTagRemovable } from "@/domain/contacts/kitTags";
import { requireKitTagId } from "@/config/kitTagIds";
import type {
  EmailProvider,
  KitSubscriber,
  UpsertSubscriberInput,
  ApplyTagInput,
  RemoveTagInput,
} from "./types";

const DEFAULT_BASE_URL = "https://api.kit.com/v4";
const REQUEST_TIMEOUT_MS = 10_000;
const MAX_ATTEMPTS = 3;
const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);

export class KitApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly retryable: boolean = false,
  ) {
    super(message);
    this.name = "KitApiError";
  }
}

interface KitClientConfig {
  apiSecret: string;
  baseUrl?: string;
}

/**
 * Real Kit (formerly ConvertKit) v4 API client, implementing the same
 * EmailProvider interface as src/integrations/kit/mock.ts.
 *
 * ASSUMPTION / DEVIATION (flag for client review): Kit's exact current v4
 * request/response shapes and auth header were not verified against live
 * API docs at build time — this targets `Authorization: Bearer <API secret>`
 * against `https://api.kit.com/v4`, which matches Kit's published v4
 * migration guidance as of this build, but must be smoke-tested against a
 * real Kit sandbox before KIT_SYNC_ENABLED is ever set true in production.
 *
 * Tags are addressed by canonical name (e.g. "archetype-pressure") at the
 * call site and resolved to Kit's numeric tag ID via requireKitTagId —
 * never call this client with a raw Kit tag ID.
 */
export function createKitApiClient(config: KitClientConfig): EmailProvider {
  const baseUrl = config.baseUrl ?? env.KIT_API_BASE_URL ?? DEFAULT_BASE_URL;

  async function kitFetch<T>(path: string, init: RequestInit, action: string): Promise<T> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      const startedAt = Date.now();

      try {
        const response = await fetch(`${baseUrl}${path}`, {
          ...init,
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.apiSecret}`,
            ...init.headers,
          },
        });
        clearTimeout(timeout);
        const durationMs = Date.now() - startedAt;

        if (!response.ok) {
          const retryable = RETRYABLE_STATUS.has(response.status);
          const bodyText = await response.text().catch(() => "");
          logger.warn("Kit API request failed", {
            provider: "kit",
            action,
            attempt,
            status: String(response.status),
            durationMs,
            errorCode: `http_${response.status}`,
          });

          if (retryable && attempt < MAX_ATTEMPTS) {
            await backoff(attempt);
            continue;
          }
          throw new KitApiError(
            `Kit API ${action} failed with status ${response.status}: ${bodyText.slice(0, 300)}`,
            response.status,
            retryable,
          );
        }

        logger.debug("Kit API request succeeded", {
          provider: "kit",
          action,
          attempt,
          durationMs,
          status: String(response.status),
        });

        if (response.status === 204) return undefined as T;
        return (await response.json()) as T;
      } catch (error) {
        clearTimeout(timeout);
        lastError = error;

        if (error instanceof KitApiError) {
          if (!error.retryable || attempt >= MAX_ATTEMPTS) throw error;
          continue;
        }

        // Network error / abort — treat as retryable.
        logger.warn("Kit API request threw a network error", {
          provider: "kit",
          action,
          attempt,
          safeErrorMessage: error instanceof Error ? error.message : "unknown error",
        });
        if (attempt < MAX_ATTEMPTS) {
          await backoff(attempt);
          continue;
        }
      }
    }

    throw lastError instanceof Error
      ? lastError
      : new KitApiError(`Kit API ${action} failed after ${MAX_ATTEMPTS} attempts`);
  }

  return {
    async upsertSubscriber(input: UpsertSubscriberInput): Promise<KitSubscriber> {
      const body = {
        email_address: input.email,
        first_name: input.firstName,
        fields: input.fields ?? {},
      };
      const result = await kitFetch<{ subscriber: { id: string | number; email_address: string } }>(
        "/subscribers",
        { method: "POST", body: JSON.stringify(body) },
        "upsertSubscriber",
      );
      return { id: String(result.subscriber.id), email: result.subscriber.email_address };
    },

    async applyTag(input: ApplyTagInput): Promise<void> {
      const tagId = requireKitTagId(input.tag);
      await kitFetch<unknown>(
        `/tags/${tagId}/subscribers`,
        { method: "POST", body: JSON.stringify({ subscriber_id: input.subscriberId }) },
        "applyTag",
      );
    },

    async removeTag(input: RemoveTagInput): Promise<void> {
      // Hard business-rule guard: client-guide can never be programmatically
      // removed (docs/02-CanonicalDecisions.md). This throws before any
      // network call is made.
      assertTagRemovable(input.tag);
      const tagId = requireKitTagId(input.tag);
      await kitFetch<unknown>(
        `/subscribers/${input.subscriberId}/tags/${tagId}`,
        { method: "DELETE" },
        "removeTag",
      );
    },
  };
}

function backoff(attempt: number): Promise<void> {
  const delayMs = Math.min(2 ** attempt * 250, 4000);
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

/**
 * Convenience factory reading KIT_API_SECRET from env. Throws if the
 * secret is missing — call sites should check env.KIT_SYNC_ENABLED before
 * constructing this client at all, so a missing secret is a configuration
 * error, not a silently-disabled feature.
 */
export function createKitApiClientFromEnv(): EmailProvider {
  if (!env.KIT_API_SECRET) {
    throw new Error("KIT_API_SECRET is not set; cannot create a real Kit API client.");
  }
  return createKitApiClient({ apiSecret: env.KIT_API_SECRET, baseUrl: env.KIT_API_BASE_URL });
}
