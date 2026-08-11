import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  /** What this slot is for, per the playbook's image direction tables. */
  label: string;
  aspect?: "banner" | "portrait" | "square";
  className?: string;
  /**
   * Use for small slots (avatars, byline thumbnails) where the label text
   * cannot legibly fit. Hides the visible label but keeps it as the
   * accessible name via aria-label.
   */
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
export function ImagePlaceholder({ label, aspect = "banner", className, compact = false }: ImagePlaceholderProps) {
  if (compact) {
    return (
      <div
        role="img"
        aria-label={`Image placement pending: ${label}`}
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
      aria-label={`Image placement pending: ${label}`}
      className={cn(
        "border-brand-sage-300 bg-surface-sage text-brand-sage-800 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed p-6 text-center",
        aspectClasses[aspect],
        className,
      )}
    >
      <ImageIcon className="size-8 opacity-60" aria-hidden="true" />
      <p className="max-w-xs text-sm font-medium">{label}</p>
    </div>
  );
}
