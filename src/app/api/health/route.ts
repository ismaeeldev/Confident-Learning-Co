import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db/client";
import { logger, withRequestId } from "@/lib/logger";

/**
 * Readiness endpoint — confirms the app can actually reach its database,
 * not just that the process is running. Deliberately returns no secret
 * values, connection strings, or internal error detail; a failure is
 * reported as a plain boolean plus a generic reason, with the real error
 * only in server-side logs (correlated by requestId).
 */
export async function GET() {
  return withRequestId(crypto.randomUUID(), async () => {
    const startedAt = Date.now();

    let databaseOk = true;
    try {
      await db.execute(sql`select 1`);
    } catch (error) {
      databaseOk = false;
      logger.error("Health check: database connectivity failed", {
        provider: "internal",
        action: "health.check",
        safeErrorMessage: error instanceof Error ? error.message : "unknown error",
      });
    }

    const status = databaseOk ? "ok" : "degraded";
    return NextResponse.json(
      {
        status,
        database: databaseOk ? "ok" : "unreachable",
        durationMs: Date.now() - startedAt,
        timestamp: new Date().toISOString(),
      },
      { status: databaseOk ? 200 : 503 },
    );
  });
}
