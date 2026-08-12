import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { formSubmissions } from "@/db/schema";
import { newsletterFormSchema } from "@/domain/funnel/schemas";
import { isRateLimited } from "@/lib/rateLimit";
import { upsertContactByEmail } from "@/domain/contacts/upsertContactByEmail";
import { enqueueIntegrationJob } from "@/lib/integrationJobs";

/**
 * Newsletter signup — per docs/07-IntegrationContracts.md 7.8. Stores the
 * submission + consent proof, syncs to Kit with the dedicated
 * newsletter-source tag only. Never applies Reflection tags or enters the
 * Reflection nurture sequence, even though the contact may already exist
 * from an earlier Reflection completion.
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
  // generic 400 as any other invalid submission, never reaching Kit.
  const parsed = newsletterFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const input = parsed.data;

  if (await isRateLimited(db, "newsletter", input.email)) {
    return NextResponse.json({ error: "Please wait a moment before trying again." }, { status: 429 });
  }

  await db.insert(formSubmissions).values({
    kind: "newsletter",
    email: input.email,
    firstName: input.firstName,
    payload: { source: "articles" },
    consentTextVersion: input.consentTextVersion,
    consentAt: new Date(),
    status: "received",
  });

  const contactId = await upsertContactByEmail(db, input.email, input.firstName);

  await enqueueIntegrationJob(db, {
    provider: "kit",
    action: "kit.syncNewsletterContact",
    contactId,
    input: {},
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
