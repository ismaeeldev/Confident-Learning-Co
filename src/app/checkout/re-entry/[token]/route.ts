import { db } from "@/db/client";
import { handleSignedLinkVisit } from "@/domain/signedLinks/handleSignedLinkVisit";

/**
 * Re-entry link — for a Guide owner whose membership has lapsed to rejoin
 * Inside the Loop without ever repurchasing the Guide (Step 10). Used in
 * Kit's Day 30 "lapsed" email and the Sequence 3 re-entry broadcast.
 */
export async function GET(_request: Request, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params;
  return handleSignedLinkVisit(db, token, "reentry");
}
