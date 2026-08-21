import { z } from "zod";
import { PRODUCT_KEYS } from "@/config/canon";

/**
 * Phase 6 checkout consent — Guide + 3 packs. Client-confirmed 20 Aug 2026:
 * box 1 (terms of sale) is required; box 2 (immediate-delivery waiver) is
 * explicitly optional and must never block a purchase (forcing it risks
 * the waiver being ruled not a free choice under UK consumer law). See
 * V2-BUILD-REQUIREMENTS-IMPLEMENTATION-GUIDE.md Phase 6 for the full
 * document-conflict history behind this design.
 */
export const purchaseConsentSchema = z.object({
  productKey: z.enum(PRODUCT_KEYS),
  termsAgreed: z.literal(true),
  /** Optional. true = deliver immediately, waiving the 14-day cancellation right. false = hold delivery for the full 14 days instead. Defaulted in the form itself (useForm defaultValues), not here, so the inferred type stays a plain boolean for react-hook-form's resolver typing. */
  immediateDelivery: z.boolean(),
  // Same honeypot convention as the other public forms in this codebase.
  honeypot: z.string().max(0).optional(),
});

export type PurchaseConsentInput = z.infer<typeof purchaseConsentSchema>;

/**
 * Exact wording, client-supplied 20 Aug 2026 — must not be paraphrased.
 * Used unchanged for all four products (Guide + 3 packs), client-confirmed
 * — no product-name substitution.
 */
export const PURCHASE_CONSENT_COPY = {
  termsAgreed: "I have read and agree to the Terms and Conditions of Sale and the Privacy Policy.",
  immediateDelivery:
    "I want my download straight away, rather than waiting for my 14 day cancellation period to end. I understand that once my download begins I lose my right to change my mind and cancel for a refund. My rights if the product is faulty or not as described are not affected.",
} as const;
