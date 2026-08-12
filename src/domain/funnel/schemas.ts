import { z } from "zod";
import { ARCHETYPE_KEYS, CHILD_BANDS } from "@/config/canon";

export const childBandSchema = z.enum(CHILD_BANDS);

export const archetypeKeySchema = z.enum(ARCHETYPE_KEYS);

/**
 * Payload shape for the ScoreApp -> Kit/Next.js completion event.
 * See docs/00-ApplicationFlow.md section 0.5.
 */
export const scoreAppCompletionSchema = z.object({
  firstName: z.string().min(1),
  email: z.string().email(),
  childFirstName: z.string().min(1).optional(),
  childBand: childBandSchema,
  archetype: archetypeKeySchema,
  marketingConsent: z.boolean(),
  scoreAppLeadId: z.string().min(1).optional(),
});

export type ScoreAppCompletion = z.infer<typeof scoreAppCompletionSchema>;

export const newsletterFormSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1).max(100).optional(),
  consentTextVersion: z.string().min(1),
  // Rejects at the schema layer (400) if a bot fills this hidden field —
  // established behavior, see tests/unit/funnel-schemas.test.ts.
  honeypot: z.string().max(0).optional(),
});

export type NewsletterFormInput = z.infer<typeof newsletterFormSchema>;

export const resetEnquiryFormSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1).max(100),
  childBand: childBandSchema.optional(),
  interest: z.enum(["confidence_reset", "calm_reset"]),
  message: z.string().min(1).max(2000),
  // Rejects at the schema layer (400) if a bot fills this hidden field —
  // established behavior, see tests/unit/funnel-schemas.test.ts.
  honeypot: z.string().max(0).optional(),
});

export type ResetEnquiryFormInput = z.infer<typeof resetEnquiryFormSchema>;
