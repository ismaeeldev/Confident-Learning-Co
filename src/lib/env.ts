import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const booleanFlag = z
  .enum(["true", "false"])
  .default("false")
  .transform((value) => value === "true");

export const env = createEnv({
  server: {
    APP_ENV: z.enum(["development", "preview", "staging", "production"]).default("development"),
    APP_TIMEZONE: z.string().default("Europe/London"),
    LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
    SUPPORT_EMAIL: z.string().email().optional(),
    ADMIN_ALERT_EMAIL: z.string().email().optional(),
    SIGNED_LINK_SECRET: z.string().min(1).optional(),
    CRON_SECRET: z.string().min(1).optional(),

    EXTERNAL_SIDE_EFFECTS_ENABLED: booleanFlag,
    LIFECYCLE_JOBS_ENABLED: booleanFlag,
    DAY29_REMINDER_ENABLED: booleanFlag,
    SCOREAPP_WEBHOOK_ENABLED: booleanFlag,
    CIRCLE_PROVISIONING_ENABLED: booleanFlag,
    KIT_SYNC_ENABLED: booleanFlag,
    STRIPE_LIVE_MODE_ALLOWED: booleanFlag,
    ANALYTICS_ENABLED: booleanFlag,

    DATABASE_URL: z.string().min(1),
    DATABASE_URL_UNPOOLED: z.string().min(1).optional(),

    STRIPE_SECRET_KEY: z.string().min(1).optional(),
    STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
    STRIPE_GUIDE_PRODUCT_ID: z.string().optional(),
    STRIPE_GUIDE_PRICE_ID: z.string().optional(),
    STRIPE_MEMBERSHIP_PRODUCT_ID: z.string().optional(),
    STRIPE_MEMBERSHIP_PRICE_ID: z.string().optional(),
    STRIPE_CUSTOMER_PORTAL_CONFIGURATION_ID: z.string().optional(),
    STRIPE_PACK_HOMEWORK_PRICE_ID: z.string().optional(),
    STRIPE_PACK_CONVERSATIONS_PRICE_ID: z.string().optional(),
    STRIPE_PACK_PARENTS_EVENING_PRICE_ID: z.string().optional(),
    STRIPE_PATHWAY_PRICE_ID: z.string().optional(),
    STRIPE_GROUP_PRICE_ID: z.string().optional(),
    STRIPE_CONFIDENCE_RESET_PRICE_ID: z.string().optional(),
    STRIPE_CALM_RESET_PRICE_ID: z.string().optional(),

    CIRCLE_API_TOKEN: z.string().optional(),
    CIRCLE_COMMUNITY_ID: z.string().optional(),
    CIRCLE_COMMUNITY_URL: z.string().optional(),
    CIRCLE_INSIDE_LOOP_SPACE_GROUP_ID: z.string().optional(),
    /** Verifies inbound "Send to webhook" calls from Circle's Workflow 2 (member-tag-back-to-kit). Circle's webhook action has no built-in signing, so this is checked as a query param on the endpoint URL instead. */
    CIRCLE_WEBHOOK_SECRET: z.string().optional(),

    KIT_API_KEY: z.string().optional(),
    KIT_API_SECRET: z.string().optional(),
    KIT_API_BASE_URL: z.string().optional(),
    KIT_TAG_LEAD_SOURCE_REFLECTION_ID: z.string().optional(),
    KIT_TAG_MARKETING_CONSENT_ID: z.string().optional(),
    KIT_TAG_REFLECTION_COMPLETED_ID: z.string().optional(),
    KIT_TAG_ARCHETYPE_SETTLE_ID: z.string().optional(),
    KIT_TAG_ARCHETYPE_PRESSURE_ID: z.string().optional(),
    KIT_TAG_ARCHETYPE_THINKING_ID: z.string().optional(),
    KIT_TAG_ARCHETYPE_CONFIDENCE_ID: z.string().optional(),
    KIT_TAG_ARCHETYPE_REINFORCEMENT_ID: z.string().optional(),
    KIT_TAG_CLIENT_GUIDE_ID: z.string().optional(),
    KIT_TAG_IL_30DAY_ACTIVE_ID: z.string().optional(),
    KIT_TAG_IL_LAPSED_ID: z.string().optional(),
    KIT_TAG_MEMBER_INSIDE_LOOP_ID: z.string().optional(),
    KIT_TAG_INTEREST_CONFIDENCE_RESET_ID: z.string().optional(),
    KIT_TAG_CLIENT_CONFIDENCE_RESET_ID: z.string().optional(),
    KIT_TAG_NEWSLETTER_SOURCE_ID: z.string().optional(),

    SCOREAPP_WEBHOOK_SECRET: z.string().optional(),
    SCOREAPP_API_KEY: z.string().optional(),
    SCOREAPP_SCORECARD_ID: z.string().optional(),

    SENTRY_DSN: z.string().optional(),
    SENTRY_AUTH_TOKEN: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
    NEXT_PUBLIC_SCOREAPP_EMBED_URL: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
    NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
    NEXT_PUBLIC_CLARITY_PROJECT_ID: z.string().optional(),
    NEXT_PUBLIC_META_PIXEL_ID: z.string().optional(),
  },
  runtimeEnv: {
    APP_ENV: process.env.APP_ENV,
    APP_TIMEZONE: process.env.APP_TIMEZONE,
    LOG_LEVEL: process.env.LOG_LEVEL,
    SUPPORT_EMAIL: process.env.SUPPORT_EMAIL,
    ADMIN_ALERT_EMAIL: process.env.ADMIN_ALERT_EMAIL,
    SIGNED_LINK_SECRET: process.env.SIGNED_LINK_SECRET,
    CRON_SECRET: process.env.CRON_SECRET,

    EXTERNAL_SIDE_EFFECTS_ENABLED: process.env.EXTERNAL_SIDE_EFFECTS_ENABLED,
    LIFECYCLE_JOBS_ENABLED: process.env.LIFECYCLE_JOBS_ENABLED,
    DAY29_REMINDER_ENABLED: process.env.DAY29_REMINDER_ENABLED,
    SCOREAPP_WEBHOOK_ENABLED: process.env.SCOREAPP_WEBHOOK_ENABLED,
    CIRCLE_PROVISIONING_ENABLED: process.env.CIRCLE_PROVISIONING_ENABLED,
    KIT_SYNC_ENABLED: process.env.KIT_SYNC_ENABLED,
    STRIPE_LIVE_MODE_ALLOWED: process.env.STRIPE_LIVE_MODE_ALLOWED,
    ANALYTICS_ENABLED: process.env.ANALYTICS_ENABLED,

    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_URL_UNPOOLED: process.env.DATABASE_URL_UNPOOLED,

    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_GUIDE_PRODUCT_ID: process.env.STRIPE_GUIDE_PRODUCT_ID,
    STRIPE_GUIDE_PRICE_ID: process.env.STRIPE_GUIDE_PRICE_ID,
    STRIPE_MEMBERSHIP_PRODUCT_ID: process.env.STRIPE_MEMBERSHIP_PRODUCT_ID,
    STRIPE_MEMBERSHIP_PRICE_ID: process.env.STRIPE_MEMBERSHIP_PRICE_ID,
    STRIPE_CUSTOMER_PORTAL_CONFIGURATION_ID: process.env.STRIPE_CUSTOMER_PORTAL_CONFIGURATION_ID,
    STRIPE_PACK_HOMEWORK_PRICE_ID: process.env.STRIPE_PACK_HOMEWORK_PRICE_ID,
    STRIPE_PACK_CONVERSATIONS_PRICE_ID: process.env.STRIPE_PACK_CONVERSATIONS_PRICE_ID,
    STRIPE_PACK_PARENTS_EVENING_PRICE_ID: process.env.STRIPE_PACK_PARENTS_EVENING_PRICE_ID,
    STRIPE_PATHWAY_PRICE_ID: process.env.STRIPE_PATHWAY_PRICE_ID,
    STRIPE_GROUP_PRICE_ID: process.env.STRIPE_GROUP_PRICE_ID,
    STRIPE_CONFIDENCE_RESET_PRICE_ID: process.env.STRIPE_CONFIDENCE_RESET_PRICE_ID,
    STRIPE_CALM_RESET_PRICE_ID: process.env.STRIPE_CALM_RESET_PRICE_ID,

    CIRCLE_API_TOKEN: process.env.CIRCLE_API_TOKEN,
    CIRCLE_COMMUNITY_ID: process.env.CIRCLE_COMMUNITY_ID,
    CIRCLE_COMMUNITY_URL: process.env.CIRCLE_COMMUNITY_URL,
    CIRCLE_INSIDE_LOOP_SPACE_GROUP_ID: process.env.CIRCLE_INSIDE_LOOP_SPACE_GROUP_ID,
    CIRCLE_WEBHOOK_SECRET: process.env.CIRCLE_WEBHOOK_SECRET,

    KIT_API_KEY: process.env.KIT_API_KEY,
    KIT_API_SECRET: process.env.KIT_API_SECRET,
    KIT_API_BASE_URL: process.env.KIT_API_BASE_URL,
    KIT_TAG_LEAD_SOURCE_REFLECTION_ID: process.env.KIT_TAG_LEAD_SOURCE_REFLECTION_ID,
    KIT_TAG_MARKETING_CONSENT_ID: process.env.KIT_TAG_MARKETING_CONSENT_ID,
    KIT_TAG_REFLECTION_COMPLETED_ID: process.env.KIT_TAG_REFLECTION_COMPLETED_ID,
    KIT_TAG_ARCHETYPE_SETTLE_ID: process.env.KIT_TAG_ARCHETYPE_SETTLE_ID,
    KIT_TAG_ARCHETYPE_PRESSURE_ID: process.env.KIT_TAG_ARCHETYPE_PRESSURE_ID,
    KIT_TAG_ARCHETYPE_THINKING_ID: process.env.KIT_TAG_ARCHETYPE_THINKING_ID,
    KIT_TAG_ARCHETYPE_CONFIDENCE_ID: process.env.KIT_TAG_ARCHETYPE_CONFIDENCE_ID,
    KIT_TAG_ARCHETYPE_REINFORCEMENT_ID: process.env.KIT_TAG_ARCHETYPE_REINFORCEMENT_ID,
    KIT_TAG_CLIENT_GUIDE_ID: process.env.KIT_TAG_CLIENT_GUIDE_ID,
    KIT_TAG_IL_30DAY_ACTIVE_ID: process.env.KIT_TAG_IL_30DAY_ACTIVE_ID,
    KIT_TAG_IL_LAPSED_ID: process.env.KIT_TAG_IL_LAPSED_ID,
    KIT_TAG_MEMBER_INSIDE_LOOP_ID: process.env.KIT_TAG_MEMBER_INSIDE_LOOP_ID,
    KIT_TAG_INTEREST_CONFIDENCE_RESET_ID: process.env.KIT_TAG_INTEREST_CONFIDENCE_RESET_ID,
    KIT_TAG_CLIENT_CONFIDENCE_RESET_ID: process.env.KIT_TAG_CLIENT_CONFIDENCE_RESET_ID,
    KIT_TAG_NEWSLETTER_SOURCE_ID: process.env.KIT_TAG_NEWSLETTER_SOURCE_ID,

    SCOREAPP_WEBHOOK_SECRET: process.env.SCOREAPP_WEBHOOK_SECRET,
    SCOREAPP_API_KEY: process.env.SCOREAPP_API_KEY,
    SCOREAPP_SCORECARD_ID: process.env.SCOREAPP_SCORECARD_ID,

    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,

    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SCOREAPP_EMBED_URL: process.env.NEXT_PUBLIC_SCOREAPP_EMBED_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    NEXT_PUBLIC_CLARITY_PROJECT_ID: process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID,
    NEXT_PUBLIC_META_PIXEL_ID: process.env.NEXT_PUBLIC_META_PIXEL_ID,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});

if (
  env.STRIPE_LIVE_MODE_ALLOWED &&
  env.STRIPE_SECRET_KEY &&
  !env.STRIPE_SECRET_KEY.startsWith("sk_live_") &&
  env.APP_ENV === "production"
) {
  throw new Error(
    "STRIPE_LIVE_MODE_ALLOWED is true in production but STRIPE_SECRET_KEY is not a live key.",
  );
}
