import "server-only";
import { env } from "@/lib/env";
import { createMockEmailProvider } from "@/integrations/kit/mock";
import { createKitApiClientFromEnv } from "@/integrations/kit/client";
import type { EmailProvider } from "@/integrations/kit/types";
import { createMockCommunityProvider } from "@/integrations/circle/mock";
import { createCircleApiClientFromEnv } from "@/integrations/circle/client";
import type { CommunityProvider } from "@/integrations/circle/types";

/**
 * Central factory for external provider clients, gated behind feature
 * flags so real side effects never fire unless explicitly authorized
 * (docs/14-AgentOperatingRules.md). EXTERNAL_SIDE_EFFECTS_ENABLED is a
 * global kill switch; KIT_SYNC_ENABLED / CIRCLE_PROVISIONING_ENABLED gate
 * each provider individually on top of that.
 */
export function getEmailProvider(): EmailProvider {
  if (env.EXTERNAL_SIDE_EFFECTS_ENABLED && env.KIT_SYNC_ENABLED && env.KIT_API_SECRET) {
    return createKitApiClientFromEnv();
  }
  return createMockEmailProvider();
}

export function getCommunityProvider(): CommunityProvider {
  if (env.EXTERNAL_SIDE_EFFECTS_ENABLED && env.CIRCLE_PROVISIONING_ENABLED && env.CIRCLE_API_TOKEN) {
    return createCircleApiClientFromEnv();
  }
  return createMockCommunityProvider();
}
