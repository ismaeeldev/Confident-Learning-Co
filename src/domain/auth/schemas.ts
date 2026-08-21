import { z } from "zod";

export const loginRequestSchema = z.object({
  email: z.string().email(),
  // Where to send the parent after they verify the magic link — validated
  // against ALLOWED_POST_LOGIN_REDIRECTS by the caller, not trusted here.
  next: z.string().optional(),
  // Same honeypot convention as the newsletter/reset-enquiry forms — a bot
  // filling this hidden field fails validation and gets a generic 400.
  honeypot: z.string().max(0).optional(),
});

export type LoginRequestInput = z.infer<typeof loginRequestSchema>;
