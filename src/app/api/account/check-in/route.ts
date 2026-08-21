import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { contacts } from "@/db/schema";
import { getSessionContactId } from "@/lib/session";
import { checkInSchema } from "@/domain/checkin/checkInSchema";
import { getDueCheckIn } from "@/domain/checkin/checkInStatus";
import { recordCheckIn } from "@/domain/checkin/recordCheckIn";

/** Phase 12 check-in submission. Rejects a day that isn't actually due, so a member can't be re-asked the same check-in or one that hasn't arrived yet by hitting the API directly. */
export async function POST(request: Request) {
  const contactId = await getSessionContactId();
  if (!contactId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = checkInSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in the check-in before submitting" }, { status: 400 });
  }

  const due = await getDueCheckIn(db, contactId);
  if (due.dueDay !== parsed.data.day) {
    return NextResponse.json({ error: "This check-in isn't due yet" }, { status: 409 });
  }

  const [contact] = await db.select({ email: contacts.email }).from(contacts).where(eq(contacts.id, contactId)).limit(1);
  if (!contact) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  await recordCheckIn(db, contactId, contact.email, parsed.data);

  return NextResponse.json({ success: true });
}
