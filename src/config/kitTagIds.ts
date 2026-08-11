// Deliberately no `import "server-only"` here (unlike the rest of
// src/integrations/**): this module is also imported directly by
// scripts/verify-kit-tags.ts, a plain Node CLI script run via tsx outside
// the Next.js server runtime, where the server-only guard throws
// unconditionally. It contains no secrets/logic unsafe to read in that
// context — it only maps tag names to the (already server-only-gated)
// env values.
import { env } from "@/lib/env";
import { ARCHETYPE_KEYS, KIT_TAGS } from "@/config/canon";

/**
 * Maps every canonical tag name (from KIT_TAGS / ARCHETYPE_KEYS in
 * src/config/canon.ts) to the Kit-side numeric tag ID configured via
 * environment variables. Kit's API addresses tags by ID, not by name, so
 * this is the single place that bridges "the name everyone agrees on" to
 * "the ID Kit actually needs" — populate the env vars once the tags exist
 * in Kit (see Step 6 manual checklist).
 *
 * See docs/07-IntegrationContracts.md and
 * source-files/Kit_Build_Specification(1).docx for the exact tag taxonomy.
 */
export const KIT_TAG_ID_ENV_MAP: Record<string, string | undefined> = {
  [KIT_TAGS.leadSourceReflection]: env.KIT_TAG_LEAD_SOURCE_REFLECTION_ID,
  [KIT_TAGS.marketingConsent]: env.KIT_TAG_MARKETING_CONSENT_ID,
  [KIT_TAGS.magnetReflectionCompleted]: env.KIT_TAG_REFLECTION_COMPLETED_ID,
  [ARCHETYPE_KEYS[0]]: env.KIT_TAG_ARCHETYPE_SETTLE_ID, // archetype-settle-before-start
  [ARCHETYPE_KEYS[1]]: env.KIT_TAG_ARCHETYPE_PRESSURE_ID, // archetype-pressure
  [ARCHETYPE_KEYS[2]]: env.KIT_TAG_ARCHETYPE_THINKING_ID, // archetype-thinking
  [ARCHETYPE_KEYS[3]]: env.KIT_TAG_ARCHETYPE_CONFIDENCE_ID, // archetype-confidence
  [ARCHETYPE_KEYS[4]]: env.KIT_TAG_ARCHETYPE_REINFORCEMENT_ID, // archetype-reinforcement
  [KIT_TAGS.clientGuide]: env.KIT_TAG_CLIENT_GUIDE_ID,
  [KIT_TAGS.il30DayActive]: env.KIT_TAG_IL_30DAY_ACTIVE_ID,
  [KIT_TAGS.ilLapsed]: env.KIT_TAG_IL_LAPSED_ID,
  [KIT_TAGS.memberInsideTheLoop]: env.KIT_TAG_MEMBER_INSIDE_LOOP_ID,
  [KIT_TAGS.interestConfidenceReset]: env.KIT_TAG_INTEREST_CONFIDENCE_RESET_ID,
  [KIT_TAGS.clientConfidenceReset]: env.KIT_TAG_CLIENT_CONFIDENCE_RESET_ID,
};

/**
 * Tags the Reflection Nurture + purchase/lifecycle sequences depend on at
 * launch. Newsletter-source and the two homework/conversations/parents-evening
 * pack tags are deliberately excluded — they're used by later steps
 * (articles newsletter form, Step 11) and shouldn't block Step 6/8 launch.
 */
const REQUIRED_TAG_NAMES: readonly string[] = [
  KIT_TAGS.leadSourceReflection,
  KIT_TAGS.marketingConsent,
  KIT_TAGS.magnetReflectionCompleted,
  ...ARCHETYPE_KEYS,
  KIT_TAGS.clientGuide,
  KIT_TAGS.il30DayActive,
  KIT_TAGS.ilLapsed,
  KIT_TAGS.memberInsideTheLoop,
];

export interface KitTagMappingReport {
  configured: string[];
  missing: string[];
  ok: boolean;
}

/**
 * Checks that every launch-critical tag has a configured Kit tag ID.
 * Used both as a startup/CI guard and by the manual verification report
 * (`scripts/verify-kit-tags.ts`) so a missing mapping fails loudly before
 * it can cause a silent no-op tag application in production.
 */
export function verifyKitTagMapping(
  requiredTags: readonly string[] = REQUIRED_TAG_NAMES,
): KitTagMappingReport {
  const configured: string[] = [];
  const missing: string[] = [];

  for (const tag of requiredTags) {
    if (KIT_TAG_ID_ENV_MAP[tag]) {
      configured.push(tag);
    } else {
      missing.push(tag);
    }
  }

  return { configured, missing, ok: missing.length === 0 };
}

/**
 * Resolves a canonical tag name to its Kit tag ID, throwing rather than
 * silently sending a request with an undefined/empty ID. Real side effects
 * must never fire against an unmapped tag.
 */
export function requireKitTagId(tagName: string): string {
  const id = KIT_TAG_ID_ENV_MAP[tagName];
  if (!id) {
    throw new Error(
      `No Kit tag ID configured for "${tagName}". Set the matching KIT_TAG_*_ID environment variable before this tag can be applied/removed.`,
    );
  }
  return id;
}
