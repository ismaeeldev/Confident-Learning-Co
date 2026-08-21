"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Starts the Pathway call checkout (Phase 11). Mirrors the pattern used
 * by PurchaseConsentForm — POST to a server route that creates the
 * Stripe Checkout session, then redirect the browser to the returned
 * URL. No consent boxes here (unlike the Guide) — see the checkout
 * route's own comment for why.
 */
export function BookPathwayCallButton() {
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");

  async function handleClick() {
    setStatus("submitting");
    try {
      const response = await fetch("/api/checkout/pathway", { method: "POST" });
      const data = await response.json();
      if (!response.ok || !data.redirectUrl) {
        setStatus("error");
        return;
      }
      window.location.href = data.redirectUrl;
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <Button onClick={handleClick} disabled={status === "submitting"} size="lg" className="w-full sm:w-auto">
        {status === "submitting" ? "Starting checkout…" : "Book your Pathway call"}
      </Button>
      {status === "error" && (
        <p className="text-destructive text-sm" role="alert">
          Something went wrong. Please try again in a moment.
        </p>
      )}
    </div>
  );
}
