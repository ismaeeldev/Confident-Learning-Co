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
  /** Renamed 21 Aug 2026 (Phase 8, Annexe B §12) from "marketing-consent". */
  marketingConsent: "marketing-opt-in",
  magnetReflectionCompleted: "magnet-reflection-completed",
  /** Renamed 21 Aug 2026 (Phase 8, Annexe B §12) from "client-guide". Permanent — see PERMANENT_KIT_TAGS below. */
  clientGuide: "guide-owner",
  /**
   * NOT renamed — deliberately left as-is pending a live Kit account
   * check. Annexe B §12 specifies a single "member-active" tag, but two
   * distinct tags currently exist (this one and memberInsideTheLoop
   * below) and the guide's own instruction is: open the real Day 25/Day
   * 30 Kit automations first and see which of the two each one actually
   * filters on, before collapsing them — a wrong collapse breaks a live
   * automation silently. Do not rename until that 5-minute check is done.
   */
  il30DayActive: "il-30day-active",
  /** Renamed 21 Aug 2026 (Phase 8, Annexe B §12) from "il-lapsed". */
  ilLapsed: "member-lapsed",
  /** Not renamed — see il30DayActive's comment; same "member-active" collapse question. */
  memberInsideTheLoop: "member-inside-the-loop",
  interestConfidenceReset: "interest-confidence-reset",
  /** Booked The Confidence Reset (source-files/Kit_Build_Specification(1).docx, "Applied on community and premium actions"). */
  clientConfidenceReset: "client-confidence-reset",
  /** Renamed 21 Aug 2026 (Phase 8, Annexe B §12) from "pack-homework". */
  packHomework: "pack-homework-confidence",
  /** Renamed 21 Aug 2026 (Phase 8, Annexe B §12) from "pack-conversations". */
  packConversations: "pack-school-conversations",
  /** Already matched Annexe B §12 exactly — no rename needed. */
  packParentsEvening: "pack-parents-evening",
  /** Newsletter signup source (Step 11, docs/07-IntegrationContracts.md 7.8) — never the Reflection nurture tags. */
  newsletterSource: "newsletter-source",
  /** New, Phase 8/Phase 7 — written on Guide purchase while the founders window is open. Never removed. */
  founder: "founder",
  /** New, Phase 8/Phase 7 — same trigger as founder, never removed (governs future pricing). */
  founderPriceLock: "founder-price-lock",
  /** New, Phase 8 — Sept work (Phase 11), not yet written anywhere. */
  pathwayBooked: "pathway-booked",
  /** New, Phase 8 — Sept work (Phase 12), not yet written anywhere. */
  workshopBooked: "workshop-booked",
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
  /** Phase 6 — 2-box consent page shown before Stripe, per product. */
  checkoutGuide: "/checkout/guide",
  checkoutGuideConsent: "/checkout/guide/consent",
  checkoutMembership: "/checkout/membership",
  checkoutReEntry: "/checkout/re-entry",
  checkoutSuccess: "/checkout/success",
  checkoutCancelled: "/checkout/cancelled",
  checkoutLinkInvalid: "/checkout/link-invalid",
  accessPending: "/access/pending",
  contactSuccess: "/contact/success",
  /** Phase 3 (V2 build guide) — passwordless sign-in. */
  login: "/login",
  authVerify: (token: string) => `/auth/verify/${token}`,
  memberHome: "/account",
  /** Phase 3 — where an already-signed-in-via-old-link parent confirms consent and is handed off to Stripe checkout for the membership subscription (Annexe B §4, rebuilt 20 Aug 2026 per R3). */
  checkoutMembershipJoin: "/checkout/membership-join",
  /** R3 rebuild — Stripe's successUrl destination after membership payment; shows a "setting up your access" state while the single-use Circle invitation is issued. */
  checkoutMembershipSuccess: "/checkout/membership-success",
  /** Phase 11 (Annexe A) — active members only. */
  pathway: "/pathway",
  /** Phase 11 — signed-in members only, deliberately unlinked from nav/sitemap/everywhere. Not yet built — blocked on the client's Pathway price (top-level §10 item 3). */
  pathwayBook: "/pathway/book",
  /** Phase 11 — no sign-in required, noindex, linked only from the Fit Check's Signpost outcomes. */
  whereToStart: "/where-to-start",
  /** Phase 11 — confirms a Pathway booking payment. */
  pathwayBooked: "/pathway/booked",
  privacy: "/privacy",
  terms: "/terms",
  cookies: "/cookies",
  refundPolicy: "/refund-policy",
} as const;

export const PRODUCT_KEYS = [
  "guide",
  "membership",
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
 * Phase 7 — founders cap. Hard stop at 50 sales OR this date, whichever
 * comes first (client's explicit requirement — "checkout must actually
 * stop"). 27 Sept 2026, end of day Europe/London (BST, UTC+1 in
 * September) — stored as the precise UTC instant rather than computed at
 * request time, since DST-aware "end of day in a named timezone" logic is
 * easy to get subtly wrong; recheck this literal if the policy date ever
 * changes.
 */
export const FOUNDERS_CAP_COUNT = 50;
export const FOUNDERS_CLOSE_DATE = new Date("2026-09-27T22:59:59.999Z"); // 27 Sept 2026 23:59:59.999 BST

/**
 * DEPRECATED as of 20 Aug 2026 — superseded by Build Addendum A v2.2, R3
 * ("Circle self serve signup is closed... On successful payment, issue a
 * single use invitation"), client-confirmed to override the earlier
 * Circle-native-paywall decision (Circle_and_Website_Build_Pack_v4.docx
 * Part 2 / DEC-003) that this constant originally served. Membership
 * billing now happens on our own site via Stripe Checkout
 * (products.membership), followed by a single-use Circle invitation
 * issued from the Stripe webhook. No longer referenced by any live route —
 * kept only because `handleSignedLinkVisit.ts` (already marked deprecated)
 * still names it in a comment.
 */
export const CIRCLE_MEMBERSHIP_CHECKOUT_PATH = "/checkout/inside-the-loop";

/**
 * Increment this whenever the membership join consent wording (terms of
 * sale / immediate-access waiver / marketing opt-in, Annexe B §4) changes.
 * Never overwrite past `formSubmissions` rows when it changes — old rows
 * keep the version they were recorded under (Phase 6 convention).
 */
export const MEMBERSHIP_JOIN_CONSENT_VERSION = "2026-08-20-v1";

/**
 * Increment whenever the Phase 6 purchase-consent wording (terms of sale /
 * immediate-delivery waiver, client-supplied 20 Aug 2026) changes. Applies
 * to the Guide and, once built, the 3 packs — never overwrite past
 * `formSubmissions` rows when it changes.
 */
export const PURCHASE_CONSENT_VERSION = "2026-08-20-v1";

/** How long delivery (Guide email + Circle access) is held when the immediate-delivery box is declined — the UK 14-day digital-content cancellation period. */
export const DELIVERY_HOLD_DAYS = 14;

/** Phase 11 — Annexe B §8.1's exact wording carries this version identifier; stored on every acknowledgement row so a later change never erases what an earlier member actually saw. */
export const FIT_CHECK_PROCESSING_NOTICE_VERSION = "fit-check-processing-notice-v1.0";

/**
 * Allowlist for the `next` redirect param carried through the magic-link
 * sign-in flow (login page -> request-login-link -> verify route). Only
 * paths in this list may be used — prevents an open-redirect via a
 * crafted `next` value, since the param round-trips through an email link.
 */
export const ALLOWED_POST_LOGIN_REDIRECTS: readonly string[] = [
  PUBLIC_ROUTES.checkoutMembershipJoin,
];

/** Immutable business rules. See docs/02-CanonicalDecisions.md section 2.3. */
export const IMMUTABLE_RULES = {
  singlePublicPaidEntryPoint: "guide" as ProductKey,
  includedAccessDays: 30,
  guideOwnershipTag: KIT_TAGS.clientGuide,
} as const;
