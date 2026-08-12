import { db } from "@/db/client";
import { handleSignedLinkVisit } from "@/domain/signedLinks/handleSignedLinkVisit";

/**
 * Continuation link — for a Guide owner still inside their included
 * 30 days who wants to jump straight to Inside the Loop / confirm their
 * membership (Step 10). Used in Kit's Day 25 "continuation" email.
 */
export async function GET(_request: Request, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params;
  return handleSignedLinkVisit(db, token, "continuation");
}
