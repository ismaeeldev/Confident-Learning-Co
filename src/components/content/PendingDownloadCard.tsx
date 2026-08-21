"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface PendingDownloadCardProps {
  releaseDate: string;
}

/**
 * Build Change Request 01, §4.2: shows a member their held download and
 * its release date, with a self-release control. The confirmation
 * ("releasing it now ends your right to cancel for a refund") is shown
 * before acting, exactly as the client specifies — this is a real
 * decision, not a casual click.
 */
export function PendingDownloadCard({ releaseDate }: PendingDownloadCardProps) {
  const [confirming, setConfirming] = useState(false);
  const [status, setStatus] = useState<"idle" | "releasing" | "released" | "error">("idle");

  async function handleRelease() {
    setStatus("releasing");
    try {
      const response = await fetch("/api/account/release-download", { method: "POST" });
      if (!response.ok) {
        setStatus("error");
        return;
      }
      setStatus("released");
    } catch {
      setStatus("error");
    }
  }

  if (status === "released") {
    return (
      <div className="border-border bg-surface-sage rounded-2xl border p-5">
        <p className="font-heading text-lg">Your download is on its way</p>
        <p className="text-brand-sage-800 mt-1 text-sm">Check your email — it should arrive shortly.</p>
      </div>
    );
  }

  return (
    <div className="border-border bg-surface rounded-2xl border p-5">
      <p className="font-heading text-lg">Your Guide is on its way</p>
      <p className="text-brand-navy-800 mt-1 text-sm">
        We&apos;re holding your download until <strong>{releaseDate}</strong>, as you chose at
        checkout. You can release it early if you&apos;d rather have it now.
      </p>

      {confirming ? (
        <div className="border-border bg-background mt-4 rounded-xl border p-4">
          <p className="text-brand-navy-800 text-sm">
            Releasing it now ends your right to cancel for a refund. Are you sure?
          </p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={handleRelease} disabled={status === "releasing"}>
              {status === "releasing" ? "Releasing…" : "Yes, release it now"}
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setConfirming(false)}>
              Keep waiting
            </Button>
          </div>
        </div>
      ) : (
        <Button size="sm" variant="secondary" className="mt-3" onClick={() => setConfirming(true)}>
          Release it now instead
        </Button>
      )}

      {status === "error" && (
        <p className="text-destructive mt-2 text-xs" role="alert">
          Something went wrong. Please try again in a moment.
        </p>
      )}
    </div>
  );
}
