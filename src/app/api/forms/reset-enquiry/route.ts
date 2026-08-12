import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { formSubmissions } from "@/db/schema";
import { resetEnquiryFormSchema } from "@/domain/funnel/schemas";
import { isRateLimited } from "@/lib/rateLimit";
import { upsertContactByEmail } from "@/domain/contacts/upsertContactByEmail";
import { enqueueIntegrationJob } from "@/lib/integrationJobs";

/**
 * Reset enquiry — per docs/07-IntegrationContracts.md 7.9. Stores the
 * submission, applies interest-confidence-reset only (no sales sequence,
 * no automated suitability decision), and queues an admin notification
 * (see src/lib/email.ts — safely no-ops without RESEND_API_KEY, the
 * submission is never lost either way).
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Honeypot is enforced at the schema layer (max length 0) — a bot
  // filling this hidden field fails validation here and gets the same
  // generic 400 as any other invalid submission.
  const parsed = resetEnquiryFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const input = parsed.data;

  if (await isRateLimited(db, "reset_enquiry", input.email)) {
    return NextResponse.json({ error: "Please wait a moment before trying again." }, { status: 429 });
  }

  await db.insert(formSubmissions).values({
    kind: "reset_enquiry",
    email: input.email,
    firstName: input.firstName,
    payload: { childBand: input.childBand, interest: input.interest, message: input.message },
    status: "received",
  });

  const contactId = await upsertContactByEmail(db, input.email, input.firstName);

  await enqueueIntegrationJob(db, {
    provider: "kit",
    action: "kit.applyResetInterestTag",
    contactId,
    input: {},
  });

  await enqueueIntegrationJob(db, {
    provider: "internal",
    action: "internal.notifyAdminResetEnquiry",
    contactId,
    input: {
      email: input.email,
      firstName: input.firstName,
      interest: input.interest,
      message: input.message,
    },
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
