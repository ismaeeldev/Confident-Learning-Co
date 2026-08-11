import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { processMemberJoinedWebhook } from "@/domain/circle/processMemberJoinedWebhook";

/**
 * Receives Circle's "Send to webhook" action from Workflow 2 (member joins
 * the Inside the Loop paywall). Circle's webhook action has no built-in
 * request signing, so the shared secret is checked as a query param on the
 * endpoint URL itself — paste the URL into Circle exactly as generated,
 * including the ?secret=... suffix. See
 * src/domain/circle/processMemberJoinedWebhook.ts for the payload-shape
 * caveat.
 */
export async function POST(request: Request) {
  const url = new URL(request.url);
  const providedSecret = url.searchParams.get("secret");

  if (!env.CIRCLE_WEBHOOK_SECRET) {
    logger.error("Circle webhook called but CIRCLE_WEBHOOK_SECRET is not configured", {
      provider: "circle",
      action: "webhook.receive",
    });
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  if (providedSecret !== env.CIRCLE_WEBHOOK_SECRET) {
    logger.warn("Circle webhook called with an invalid or missing secret", {
      provider: "circle",
      action: "webhook.receive",
    });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  logger.debug("Circle member-joined webhook payload received", {
    provider: "circle",
    action: "webhook.receive",
    // Logged only at debug level, and only until the real payload shape is
    // confirmed against a live test — see processMemberJoinedWebhook.ts.
    payloadKeys: Object.keys(payload).join(","),
  });

  try {
    const result = await processMemberJoinedWebhook(db, payload);

    if (result.outcome === "missing_email") {
      logger.error("Circle member-joined webhook had no recognizable email field", {
        provider: "circle",
        action: "webhook.receive",
        errorCode: "missing_email",
      });
      // 200, not 400/500: Circle has no retry mechanism for this action, so
      // erroring here just loses the event permanently. Logging it is what
      // lets a human catch and fix the payload-shape mismatch.
      return NextResponse.json({ received: true, warning: "missing_email" }, { status: 200 });
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    logger.error("Circle member-joined webhook processing failed", {
      provider: "circle",
      action: "webhook.receive",
      safeErrorMessage: error instanceof Error ? error.message : "unknown error",
    });
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
