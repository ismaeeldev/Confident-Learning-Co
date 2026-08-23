import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  /**
   * Internal shoot direction for whoever sources the real asset (per the
   * playbook's image direction tables) — deliberately never rendered,
   * visibly or via aria-label. R9 (Build Addendum A v2.8): production
   * stage directions must never be visible on a live page, including to
   * assistive tech. Kept as a prop only so callers/developers still have
   * the direction available in code/dev tools.
   */
  label: string;
  aspect?: "banner" | "portrait" | "square";
  className?: string;
  /** Use for small slots (avatars, byline thumbnails) where the placeholder text cannot legibly fit — renders icon-only. */
  compact?: boolean;
}

const aspectClasses = {
  banner: "aspect-3/2",
  portrait: "aspect-4/5",
  square: "aspect-square",
} as const;

/**
 * Marks an approved image placement whose final asset (photography/stock) has
 * not been delivered yet. See docs/13-SourceReferenceMap.md and the playbook's
 * photoshoot/stock shot lists. Replace with next/image once assets land.
 */
export function ImagePlaceholder({ aspect = "banner", className, compact = false }: ImagePlaceholderProps) {
  if (compact) {
    return (
      <div
        role="img"
        aria-label="Photo coming soon"
        className={cn(
          "border-brand-sage-300 bg-surface-sage text-brand-sage-800 flex shrink-0 items-center justify-center rounded-full border border-dashed",
          aspectClasses[aspect],
          className,
        )}
      >
        <ImageIcon className="size-1/3 opacity-60" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label="Photo coming soon"
      className={cn(
        "border-brand-sage-300 bg-surface-sage text-brand-sage-800 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed p-6 text-center",
        aspectClasses[aspect],
        className,
      )}
    >
      <ImageIcon className="size-8 opacity-60" aria-hidden="true" />
      <p className="max-w-xs text-sm font-medium">Photo coming soon</p>
    </div>
  );
}
