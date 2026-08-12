import "server-only";
import { and, eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import { purchases, signedLinkUses } from "@/db/schema";
import { verifySignedLinkToken, SignedLinkError, type SignedLinkKind } from "@/lib/signedLinks";
import { logger } from "@/lib/logger";

type Database = NeonHttpDatabase<typeof schema>;

export type ConsumeSignedLinkResult =
  | { outcome: "expired" }
  | { outcome: "invalid" }
  | { outcome: "already_used" }
  | { outcome: "not_guide_owner" }
  | { outcome: "success"; contactId: string };

/**
 * Verifies a continuation/re-entry token and claims it for one-time use,
 * atomically — a unique index on signedLinkUses.jti means a replayed or
 * concurrently-clicked link loses the insert race and is correctly
 * reported as already_used, not double-processed.
 *
 * Never trusts the token alone for entitlement: even a perfectly valid,
 * unexpired, unused token is rejected if the contact no longer has a paid
 * Guide purchase on record (Guide ownership recheck, per Step 10's
 * explicit requirement — a link generated while someone owned the Guide
 * must not still work if that record is later found invalid, e.g. a
 * refund).
 */
export async function consumeSignedLink(
  db: Database,
  token: string,
  expectedKind: SignedLinkKind,
): Promise<ConsumeSignedLinkResult> {
  let verified;
  try {
    verified = await verifySignedLinkToken(token, expectedKind);
  } catch (error) {
    if (error instanceof SignedLinkError) {
      logger.warn("Signed link verification failed", {
        provider: "internal",
        action: "consumeSignedLink",
        errorCode: error.code,
      });
      return error.code === "expired" ? { outcome: "expired" } : { outcome: "invalid" };
    }
    return { outcome: "invalid" };
  }

  const [purchase] = await db
    .select({ id: purchases.id })
    .from(purchases)
    .where(
      and(
        eq(purchases.contactId, verified.contactId),
        eq(purchases.kind, "guide"),
        eq(purchases.status, "paid"),
      ),
    )
    .limit(1);

  if (!purchase) {
    logger.warn("Signed link used by a contact with no paid Guide purchase on record", {
      provider: "internal",
      action: "consumeSignedLink",
      errorCode: "not_guide_owner",
    });
    return { outcome: "not_guide_owner" };
  }

  const [claimed] = await db
    .insert(signedLinkUses)
    .values({
      jti: verified.jti,
      kind: verified.kind,
      contactId: verified.contactId,
      expiresAt: verified.expiresAt,
      usedAt: new Date(),
    })
    .onConflictDoNothing({ target: signedLinkUses.jti })
    .returning({ id: signedLinkUses.id });

  if (!claimed) {
    return { outcome: "already_used" };
  }

  return { outcome: "success", contactId: verified.contactId };
}
