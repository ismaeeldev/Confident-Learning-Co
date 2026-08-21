import { z } from "zod";
import { CHECKIN_DAYS } from "./checkInDays";

/**
 * Phase 12 — member check-in form. Draft content, not client-supplied
 * exact wording (unlike the consent/tick-box copy elsewhere in this
 * build) — flag for the client before this goes live. Deliberately no
 * scoring: `confidenceScale` is a plain 1-5 self-report, never converted
 * to a score, band, or shown back to the member as a result.
 */
export const checkInSchema = z.object({
  day: z.union([z.literal(CHECKIN_DAYS[0]), z.literal(CHECKIN_DAYS[1])]),
  howAreThingsGoing: z.string().min(1).max(2000),
  confidenceScale: z.number().int().min(1).max(5),
  honeypot: z.string().max(0).optional(),
});

export type CheckInInput = z.infer<typeof checkInSchema>;
