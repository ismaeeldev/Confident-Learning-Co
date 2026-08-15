import Image from "next/image";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { cn } from "@/lib/utils";

interface FounderPortraitProps {
  founder: "Adam" | "Michela" | "Jane";
  shotNote: string;
  aspect?: "portrait" | "square";
  className?: string;
  /** Real asset path under /public. Omit while the shot is still pending. */
  src?: string;
  /** Use for small slots (byline avatars) where placeholder label text cannot legibly fit. */
  compact?: boolean;
}

/** Portrait slot (4:5 by default) for a named founder. Renders a real photo when `src` is supplied. */
export function FounderPortrait({
  founder,
  shotNote,
  aspect = "portrait",
  className,
  src,
  compact = false,
}: FounderPortraitProps) {
  if (src) {
    const aspectClass = aspect === "square" ? "aspect-square" : "aspect-4/5";
    return (
      <div
        className={cn(
          "relative w-full overflow-hidden",
          compact ? "rounded-full" : "rounded-2xl",
          aspectClass,
          className,
        )}
      >
        <Image
          src={src}
          alt={`${founder}, ${shotNote}`}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <ImagePlaceholder
      label={`${founder} portrait: ${shotNote}`}
      aspect={aspect}
      compact={compact}
      className={cn(className)}
    />
  );
}
