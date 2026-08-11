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

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const result = await processMemberJoinedWebhook(db, payload);

    // 200, not 400/500, for both non-success outcomes below: Circle has no
    // retry mechanism for this action, so erroring here just loses the
    // event permanently with nothing gained. Logging (done inside
    // processMemberJoinedWebhook) is what lets a human catch and fix it.
    if (result.outcome === "invalid_payload") {
      return NextResponse.json({ received: true, warning: "invalid_payload" }, { status: 200 });
    }
    if (result.outcome === "unknown_member") {
      return NextResponse.json({ received: true, warning: "unknown_member" }, { status: 200 });
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
