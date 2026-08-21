import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { contacts } from "@/db/schema";
import { getSessionContactId } from "@/lib/session";
import { getPendingDownload, releaseDownloadNow } from "@/domain/checkout/pendingDownload";
import { logger } from "@/lib/logger";

/**
 * Self-release (Build Change Request 01, §4.2). The confirmation
 * ("releasing it now ends your right to cancel") is shown client-side
 * before this is ever called — this endpoint just re-verifies the grant
 * genuinely belongs to the signed-in member and is genuinely still
 * pending before acting, since it can be hit directly.
 */
export async function POST() {
  const contactId = await getSessionContactId();
  if (!contactId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const pending = await getPendingDownload(db, contactId);
  if (!pending) {
    return NextResponse.json({ error: "There's no held download to release" }, { status: 409 });
  }

  const [contact] = await db.select({ email: contacts.email }).from(contacts).where(eq(contacts.id, contactId)).limit(1);
  if (!contact) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  try {
    await releaseDownloadNow(db, contactId, contact.email, pending.accessGrantId);
  } catch (error) {
    logger.error("Failed to self-release a held download", {
      provider: "internal",
      action: "account.releaseDownload",
      safeErrorMessage: error instanceof Error ? error.message : "unknown error",
    });
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
