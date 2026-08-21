import "server-only";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import { formSubmissions } from "@/db/schema";
import type { CheckInDay } from "./checkInStatus";

type Database = NeonHttpDatabase<typeof schema>;

export interface CheckInInput {
  day: CheckInDay;
  howAreThingsGoing: string;
  confidenceScale: number;
  honeypot?: string;
}

/**
 * Records a Day 14 / Day 30 check-in. Explicitly no scoring, no clinical
 * language, and the answer is never shown back to the member as a
 * "result" — this is a plain member-facing form, not an instrument.
 */
export async function recordCheckIn(
  db: Database,
  contactId: string,
  email: string,
  input: CheckInInput,
): Promise<void> {
  await db.insert(formSubmissions).values({
    kind: "member_checkin",
    email,
    payload: {
      contactId,
      day: input.day,
      howAreThingsGoing: input.howAreThingsGoing,
      confidenceScale: input.confidenceScale,
    },
    status: "received",
  });
}
