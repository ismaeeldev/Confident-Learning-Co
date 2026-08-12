/**
 * Canonical constants for the hybrid platform. See
 * confident-learning-hybrid-build-playbook/docs/02-CanonicalDecisions.md
 * before changing anything in this file — these values are exact-name
 * contracts shared with Kit, ScoreApp, and Circle.
 */

export const CHILD_BANDS = ["early", "middle", "lower-secondary", "exam-years"] as const;
export type ChildBand = (typeof CHILD_BANDS)[number];

export const CHILD_BAND_LABELS: Record<ChildBand, string> = {
  early: "Years 2 to 4",
  middle: "Years 5 to 6",
  "lower-secondary": "Years 7 to 9",
  "exam-years": "Years 10 to 11",
};

export const ARCHETYPE_KEYS = [
  "archetype-settle-before-start",
  "archetype-pressure",
  "archetype-thinking",
  "archetype-confidence",
  "archetype-reinforcement",
] as const;
export type ArchetypeKey = (typeof ARCHETYPE_KEYS)[number];

/** Internal archetype key -> public-facing result name. Never expose the key itself publicly. */
export const ARCHETYPE_PUBLIC_NAMES: Record<ArchetypeKey, string | null> = {
  "archetype-settle-before-start": null,
  "archetype-pressure": "The Pressure Build",
  "archetype-thinking": "The Stuck Thinker",
  "archetype-confidence": "The Confidence Dip",
  "archetype-reinforcement": "The Fragile Win",
};

export const KIT_TAGS = {
  leadSourceReflection: "lead-source-reflection",
  marketingConsent: "marketing-consent",
  magnetReflectionCompleted: "magnet-reflection-completed",
  clientGuide: "client-guide",
  il30DayActive: "il-30day-active",
  ilLapsed: "il-lapsed",
  memberInsideTheLoop: "member-inside-the-loop",
  interestConfidenceReset: "interest-confidence-reset",
  /** Booked The Confidence Reset (source-files/Kit_Build_Specification(1).docx, "Applied on community and premium actions"). */
  clientConfidenceReset: "client-confidence-reset",
  packHomework: "pack-homework",
  packConversations: "pack-conversations",
  packParentsEvening: "pack-parents-evening",
} as const;

export const KIT_CUSTOM_FIELD_CHILD_BAND = "child_band";

/** Permanent tags: once applied, never programmatically removed. */
export const PERMANENT_KIT_TAGS: readonly string[] = [KIT_TAGS.clientGuide];

export const PUBLIC_ROUTES = {
  home: "/",
  reflection: "/reflection",
  parentGuide: "/parent-guide",
  insideTheLoop: "/inside-the-loop",
  workWithUs: "/work-with-us",
  about: "/about",
  articles: "/articles",
  articleDetail: (slug: string) => `/articles/${slug}`,
  checkoutGuide: "/checkout/guide",
  checkoutMembership: "/checkout/membership",
  checkoutReEntry: "/checkout/re-entry",
  checkoutSuccess: "/checkout/success",
  checkoutCancelled: "/checkout/cancelled",
  checkoutLinkInvalid: "/checkout/link-invalid",
  accessPending: "/access/pending",
  contactSuccess: "/contact/success",
  privacy: "/privacy",
  terms: "/terms",
  cookies: "/cookies",
  refundPolicy: "/refund-policy",
} as const;

export const PRODUCT_KEYS = [
  "guide",
  "pack_homework",
  "pack_conversations",
  "pack_parents_evening",
  "pathway",
  "group",
  "confidence_reset",
  "calm_reset",
] as const;
export type ProductKey = (typeof PRODUCT_KEYS)[number];

export const BUSINESS_TIMEZONE = "Europe/London";

/**
 * Circle's own native paywall handles the recurring £24.99/month
 * membership billing (per Circle_and_Website_Build_Pack_v4.docx Part 2 —
 * "Do not build a custom Stripe-to-Circle bridge"). This is the real path
 * to that checkout page, confirmed live 2026-08-11. Our signed
 * continuation/re-entry links redirect here after verifying identity and
 * Guide ownership — they never process payment themselves.
 */
export const CIRCLE_MEMBERSHIP_CHECKOUT_PATH = "/checkout/inside-the-loop";

/** Immutable business rules. See docs/02-CanonicalDecisions.md section 2.3. */
export const IMMUTABLE_RULES = {
  singlePublicPaidEntryPoint: "guide" as ProductKey,
  includedAccessDays: 30,
  guideOwnershipTag: KIT_TAGS.clientGuide,
} as const;
