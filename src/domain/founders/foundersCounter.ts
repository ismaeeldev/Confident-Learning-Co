import "server-only";
import { and, count, eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import { purchases } from "@/db/schema";
import { env } from "@/lib/env";
import { FOUNDERS_CAP_COUNT, FOUNDERS_CLOSE_DATE } from "@/config/canon";

type Database = NeonHttpDatabase<typeof schema>;

/**
 * Live founders-places counter (Phase 7) — counts real paid Guide
 * purchases at the founders price, never inflated, reset, or
 * hand-adjusted. This *is* the number shown publicly, not a display
 * layer over a separate figure — there is only one source of truth.
 */
export async function getFoundersSoldCount(db: Database): Promise<number> {
  if (!env.STRIPE_GUIDE_PRICE_ID) return 0;

  const [row] = await db
    .select({ total: count() })
    .from(purchases)
    .where(
      and(
        eq(purchases.kind, "guide"),
        eq(purchases.status, "paid"),
        eq(purchases.stripePriceId, env.STRIPE_GUIDE_PRICE_ID),
      ),
    );

  return row?.total ?? 0;
}

export type FoundersWindowState =
  | { open: true }
  | { open: false; reason: "all_taken" | "date_passed" };

/**
 * The single source of truth for whether founders pricing is still
 * available — hard stop at 50 sales OR the close date, whichever comes
 * first. Every caller (checkout price selection, the public counter
 * display, the closed-state messaging) must go through this function
 * rather than re-deriving the logic, so the three can never disagree.
 */
export function getFoundersWindowState(soldCount: number, now: Date): FoundersWindowState {
  if (soldCount >= FOUNDERS_CAP_COUNT) return { open: false, reason: "all_taken" };
  if (now.getTime() >= FOUNDERS_CLOSE_DATE.getTime()) return { open: false, reason: "date_passed" };
  return { open: true };
}
