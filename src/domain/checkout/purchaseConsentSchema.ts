import { z } from "zod";
import { PRODUCT_KEYS } from "@/config/canon";

/**
 * R1 (Build Addendum A v2.8, rewritten 22 Aug 2026) — four boxes, not two.
 * Two required (age, terms), two optional (immediate-supply consent,
 * cancellation-right acknowledgement). Both optional boxes must be ticked
 * for immediate release — R1.1: "Immediate supply happens only if both are
 * ticked. If either is left unticked, the download is held." Declining
 * either or both must never block, warn, or re-prompt (R1.1/acceptance
 * criteria "Consent capture, optional pair").
 *
 * Supersedes the earlier 2-box shape (Phase 6, 20 Aug 2026) — that version
 * combined the immediate-supply consent and the cancellation-right
 * acknowledgement into a single box, and didn't capture age or reference
 * the Community Terms of Use. Both were wrong per the terms the customer
 * actually enters (Terms and Conditions of Sale v1.2, section 9.2).
 */
export const purchaseConsentSchema = z.object({
  productKey: z.enum(PRODUCT_KEYS),
  ageConfirmed: z.literal(true),
  termsAgreed: z.literal(true),
  /** Optional. Consent to immediate supply of the download. Combines with cancellationRightAcknowledged — both must be true for immediate release. Defaulted false in the form itself (useForm defaultValues), not here, so the inferred type stays a plain boolean for react-hook-form's resolver typing. */
  immediateDeliveryConsent: z.boolean(),
  /** Optional. Acknowledgement that the 14-day cancellation right is lost once the download starts. Combines with immediateDeliveryConsent — both must be true for immediate release. */
  cancellationRightAcknowledged: z.boolean(),
  // Same honeypot convention as the other public forms in this codebase.
  honeypot: z.string().max(0).optional(),
});

export type PurchaseConsentInput = z.infer<typeof purchaseConsentSchema>;

/**
 * R1.1's exact wording. The two required boxes are client-confirmed, final
 * copy. The two optional boxes are drafted to say exactly what Terms and
 * Conditions of Sale v1.2 section 9.2 promises they say — the client is
 * confirming the final wording with their solicitor (R1.1: "Build the
 * structure now; do not hard code the strings in a way that makes a
 * wording change a code change"). This constant is that structure: the
 * wording lives in exactly one place, so a future change is a copy edit
 * here, not a change to the form, the schema, or the recording logic.
 */
export const PURCHASE_CONSENT_COPY = {
  ageConfirmed: "I confirm I am eighteen years of age or over.",
  termsAgreed:
    "I have read and agree to the Terms and Conditions of Sale, the Community Terms of Use and the Privacy Notice.",
  immediateDeliveryConsent:
    "I ask The Confident Learning Co. to supply the Learning Confidence Parent Guide download immediately, rather than waiting until my fourteen day cancellation period has passed.",
  cancellationRightAcknowledged:
    "I understand that once the download starts I lose my right to cancel and get my money back simply because I have changed my mind.",
} as const;
