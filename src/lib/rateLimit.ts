import "server-only";
import { and, eq, gte } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import { formSubmissions } from "@/db/schema";

type Database = NeonHttpDatabase<typeof schema>;
type FormKind = (typeof formSubmissions.$inferSelect)["kind"];

/**
 * Rejects a resubmission of the same form kind from the same email within
 * `windowSeconds`. No Redis/Upstash account exists for this low-volume
 * project, so this reuses the form_submissions table itself rather than
 * adding a new dependency.
 */
export async function isRateLimited(
  db: Database,
  kind: FormKind,
  email: string,
  windowSeconds = 60,
): Promise<boolean> {
  const since = new Date(Date.now() - windowSeconds * 1000);
  const recent = await db
    .select({ id: formSubmissions.id })
    .from(formSubmissions)
    .where(
      and(
        eq(formSubmissions.kind, kind),
        eq(formSubmissions.email, email),
        gte(formSubmissions.createdAt, since),
      ),
    )
    .limit(1);
  return recent.length > 0;
}
