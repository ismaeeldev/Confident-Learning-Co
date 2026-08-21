import { z } from "zod";

/**
 * Membership join consent form. Governed by Build Addendum A v2.2, R1
 * ("Consent capture at checkout") and R2 ("Identity fields captured to
 * Neon") — the client's own standing instruction for this document: "Where
 * wording is given as exact wording, it is used exactly as written. Do not
 * soften it, shorten it, improve it, or move it." All 3 boxes are
 * required; R1 does not include an optional marketing box for membership
 * (unlike the Guide/pack checkout template in Phase 6 of the build guide —
 * do not reuse that shape here).
 */
export const membershipJoinConsentSchema = z.object({
  fullLegalName: z.string().min(1, "Enter your full legal name."),
  postalAddress: z.string().min(1, "Enter your postal address."),
  telephoneNumber: z.string().min(1, "Enter your telephone number."),
  // R1 box 1 — also satisfies R2's "Age confirmation" field.
  ageConfirmed: z.literal(true),
  // R1 box 2.
  rulesAndPrivacyAgreed: z.literal(true),
  // R1 box 3 — the immediate-access / 14-day cancellation-right waiver.
  immediateAccessWaiver: z.literal(true),
  // Same honeypot convention as the other public forms in this codebase.
  honeypot: z.string().max(0).optional(),
});

export type MembershipJoinConsentInput = z.infer<typeof membershipJoinConsentSchema>;

/**
 * Exact wording, Build Addendum A v2.2 R1 — must not be paraphrased.
 * Exported so the form component and any future export/audit view render
 * the identical string.
 */
export const MEMBERSHIP_JOIN_CONSENT_COPY = {
  ageConfirmed: "I confirm I am eighteen years of age or over.",
  rulesAndPrivacyAgreed:
    "I have read and agree to the Community Rules and Member Agreement and the Privacy Notice.",
  immediateAccessWaiver:
    "I want access to the community and the Confidence Library immediately. I understand that once access has been provided I lose my right to cancel within fourteen days, and I agree to this.",
} as const;
