import "server-only";
import { logger } from "@/lib/logger";
import { env } from "@/lib/env";
import type {
  CommunityProvider,
  CircleMember,
  InviteMemberInput,
  GrantAccessInput,
  RevokeAccessInput,
  InspectAccessInput,
  AccessInspection,
} from "./types";

const DEFAULT_BASE_URL = "https://app.circle.so/api/admin/v2";
const REQUEST_TIMEOUT_MS = 10_000;
const MAX_ATTEMPTS = 3;
const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);

export class CircleApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly retryable: boolean = false,
  ) {
    super(message);
    this.name = "CircleApiError";
  }
}

interface CircleClientConfig {
  apiToken: string;
  baseUrl?: string;
}

/**
 * Real Circle Admin API client, implementing the same CommunityProvider
 * interface as src/integrations/circle/mock.ts.
 *
 * ASSUMPTION / DEVIATION (flag for client review): Circle's exact current
 * Admin API v2 request/response shapes were not verified against a live
 * sandbox at build time — this targets `Authorization: Bearer <token>`
 * against `https://app.circle.so/api/admin/v2`, matching Circle's
 * published Admin API v2 pattern as of this build, but must be
 * smoke-tested against the real community before CIRCLE_PROVISIONING_ENABLED
 * is ever set true in production. Revoke only removes the member from the
 * one protected space group — it never deletes the member's account, per
 * Step 7's explicit requirement.
 */
export function createCircleApiClient(config: CircleClientConfig): CommunityProvider {
  const baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;

  async function circleFetch<T>(
    path: string,
    init: RequestInit,
    action: string,
  ): Promise<{ status: number; body: T | undefined }> {
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
            Authorization: `Bearer ${config.apiToken}`,
            ...init.headers,
          },
        });
        clearTimeout(timeout);
        const durationMs = Date.now() - startedAt;

        if (response.status === 404) {
          return { status: 404, body: undefined };
        }

        if (!response.ok) {
          const retryable = RETRYABLE_STATUS.has(response.status);
          const bodyText = await response.text().catch(() => "");
          logger.warn("Circle API request failed", {
            provider: "circle",
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
          throw new CircleApiError(
            `Circle API ${action} failed with status ${response.status}: ${bodyText.slice(0, 300)}`,
            response.status,
            retryable,
          );
        }

        logger.debug("Circle API request succeeded", {
          provider: "circle",
          action,
          attempt,
          durationMs,
          status: String(response.status),
        });

        if (response.status === 204) return { status: 204, body: undefined };
        return { status: response.status, body: (await response.json()) as T };
      } catch (error) {
        clearTimeout(timeout);
        lastError = error;

        if (error instanceof CircleApiError) {
          if (!error.retryable || attempt >= MAX_ATTEMPTS) throw error;
          continue;
        }

        logger.warn("Circle API request threw a network error", {
          provider: "circle",
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
      : new CircleApiError(`Circle API ${action} failed after ${MAX_ATTEMPTS} attempts`);
  }

  return {
    async findMemberByEmail(email: string): Promise<CircleMember | null> {
      const { status, body } = await circleFetch<{
        community_members: Array<{ id: number | string; email: string }>;
      }>(
        `/community_members?email=${encodeURIComponent(email)}`,
        { method: "GET" },
        "findMemberByEmail",
      );

      if (status === 404 || !body || body.community_members.length === 0) return null;
      const [member] = body.community_members;
      return { id: String(member.id), email: member.email };
    },

    async inviteMember(input: InviteMemberInput): Promise<CircleMember> {
      const { body } = await circleFetch<{ id: number | string; email: string }>(
        "/community_members",
        {
          method: "POST",
          body: JSON.stringify({
            email: input.email,
            name: input.firstName,
            space_group_ids: [input.spaceGroupId],
          }),
        },
        "inviteMember",
      );

      if (!body) throw new CircleApiError("Circle inviteMember returned no body");
      return { id: String(body.id), email: body.email };
    },

    async grantAccess(input: GrantAccessInput): Promise<void> {
      await circleFetch<unknown>(
        `/community_members/${input.memberId}/space_groups/${input.spaceGroupId}`,
        { method: "POST" },
        "grantAccess",
      );
    },

    async revokeAccess(input: RevokeAccessInput): Promise<void> {
      // Deliberately scoped to one space group's membership record — never
      // the account/subscriber-list endpoint. Losing access to Inside the
      // Loop must never delete the person's Circle account.
      await circleFetch<unknown>(
        `/community_members/${input.memberId}/space_groups/${input.spaceGroupId}`,
        { method: "DELETE" },
        "revokeAccess",
      );
    },

    async inspectAccess(input: InspectAccessInput): Promise<AccessInspection> {
      const { status } = await circleFetch<unknown>(
        `/community_members/${input.memberId}/space_groups/${input.spaceGroupId}`,
        { method: "GET" },
        "inspectAccess",
      );
      return { hasAccess: status === 200 };
    },

    async listSpaceGroupMembers(spaceGroupId: string): Promise<CircleMember[]> {
      const { body } = await circleFetch<{
        community_members: Array<{ id: number | string; email: string }>;
      }>(`/space_groups/${spaceGroupId}/members`, { method: "GET" }, "listSpaceGroupMembers");

      if (!body) return [];
      return body.community_members.map((member) => ({ id: String(member.id), email: member.email }));
    },
  };
}

export function createCircleApiClientFromEnv(): CommunityProvider {
  if (!env.CIRCLE_API_TOKEN) {
    throw new Error("CIRCLE_API_TOKEN is not set; cannot create a real Circle API client.");
  }
  return createCircleApiClient({ apiToken: env.CIRCLE_API_TOKEN });
}

function backoff(attempt: number): Promise<void> {
  const delayMs = Math.min(2 ** attempt * 250, 4000);
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}
