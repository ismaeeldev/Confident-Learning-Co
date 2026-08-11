import { env } from "@/lib/env";

export const featureFlags = {
  externalSideEffectsEnabled: env.EXTERNAL_SIDE_EFFECTS_ENABLED,
  lifecycleJobsEnabled: env.LIFECYCLE_JOBS_ENABLED,
  day29ReminderEnabled: env.DAY29_REMINDER_ENABLED,
  scoreAppWebhookEnabled: env.SCOREAPP_WEBHOOK_ENABLED,
  circleProvisioningEnabled: env.CIRCLE_PROVISIONING_ENABLED,
  kitSyncEnabled: env.KIT_SYNC_ENABLED,
  stripeLiveModeAllowed: env.STRIPE_LIVE_MODE_ALLOWED,
  analyticsEnabled: env.ANALYTICS_ENABLED,
} as const;

export type FeatureFlags = typeof featureFlags;
