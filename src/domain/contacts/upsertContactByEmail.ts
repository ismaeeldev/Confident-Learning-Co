import "server-only";
import { eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import { contacts } from "@/db/schema";
import { normalizeEmail } from "@/lib/normalizeEmail";

type Database = NeonHttpDatabase<typeof schema>;

/** Shared upsert-by-email helper, used anywhere a contact's identity needs to be established/found (Reflection, Guide purchase, newsletter, Reset enquiry). */
export async function upsertContactByEmail(
  db: Database,
  email: string,
  firstName?: string,
): Promise<string> {
  const normalizedEmail = normalizeEmail(email);
  const [existing] = await db
    .select({ id: contacts.id })
    .from(contacts)
    .where(eq(contacts.email, normalizedEmail))
    .limit(1);
  if (existing) return existing.id;

  const [created] = await db
    .insert(contacts)
    .values({ email: normalizedEmail, firstName })
    .onConflictDoNothing({ target: contacts.email })
    .returning({ id: contacts.id });

  if (created) return created.id;

  const [raceWinner] = await db
    .select({ id: contacts.id })
    .from(contacts)
    .where(eq(contacts.email, normalizedEmail))
    .limit(1);
  if (!raceWinner) throw new Error(`Failed to upsert contact for ${normalizedEmail}`);
  return raceWinner.id;
}
