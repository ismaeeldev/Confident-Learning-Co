"use client";

import { useState } from "react";
import { Share2, Link2, Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShareRailProps {
  url: string;
  title: string;
  /** "vertical" for the desktop sticky rail, "horizontal" for the compact mobile row. */
  orientation?: "vertical" | "horizontal";
  className?: string;
}

/** Lightweight share controls: copy link, email, native share sheet. No tracking, no new backend logic. */
export function ShareRail({ url, title, orientation = "vertical", className }: ShareRailProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable; silently no-op rather than throwing.
    }
  }

  async function handleShare() {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // User cancelled the native share sheet; nothing to do.
        return;
      }
    }
    handleCopy();
  }

  const mailHref = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;

  const buttonClass =
    "border-border text-brand-navy-800 hover:bg-surface-sage hover:text-brand-navy-900 flex size-10 items-center justify-center rounded-full border transition-colors";

  return (
    <div
      className={cn(
        "flex",
        orientation === "vertical" ? "flex-col items-center gap-3" : "flex-row items-center gap-3",
        className,
      )}
    >
      <span className={cn("text-muted-foreground text-xs font-medium", orientation === "vertical" && "sr-only")}>
        Share
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleCopy}
        aria-label={copied ? "Link copied" : "Copy article link"}
        className={buttonClass}
      >
        {copied ? <Check aria-hidden="true" className="size-4" /> : <Link2 aria-hidden="true" className="size-4" />}
      </Button>
      <a href={mailHref} aria-label="Share by email" className={buttonClass}>
        <Mail aria-hidden="true" className="size-4" />
      </a>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleShare}
        aria-label="Share this article"
        className={buttonClass}
      >
        <Share2 aria-hidden="true" className="size-4" />
      </Button>
    </div>
  );
}
