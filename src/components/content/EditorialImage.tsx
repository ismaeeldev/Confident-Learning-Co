import Image from "next/image";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { cn } from "@/lib/utils";

interface EditorialImageProps {
  /** Direction copy from the playbook's image-direction tables, e.g. "Shot 2: Adam, three-quarter, mid-talk". */
  shotNote: string;
  aspect?: "banner" | "square";
  className?: string;
  /** Real asset path under /public. Omit while the shot is still pending. */
  src?: string;
  /** Required alt text once a real src is supplied. */
  alt?: string;
  /**
   * Vertical crop focal point when the image is cropped to fit its aspect
   * ratio, as a CSS object-position Y value (e.g. "20%", "80%", "top",
   * "center"). A higher percentage crops more off the top of the source
   * image, keeping the lower portion visible. Defaults to centered.
   */
  positionY?: string;
}

const aspectClasses = {
  banner: "aspect-3/2",
  square: "aspect-square",
} as const;

/** Environmental/editorial image (3:2 banner by default). Renders a real photo when `src` is supplied, otherwise a labeled placeholder pending real photography or licensed stock. */
export function EditorialImage({
  shotNote,
  aspect = "banner",
  className,
  src,
  alt,
  positionY = "center",
}: EditorialImageProps) {
  if (src) {
    return (
      <div className={cn("relative w-full overflow-hidden rounded-2xl", aspectClasses[aspect], className)}>
        <Image
          src={src}
          alt={alt ?? shotNote}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          style={{ objectPosition: `center ${positionY}` }}
        />
      </div>
    );
  }

  return <ImagePlaceholder label={shotNote} aspect={aspect} className={cn(className)} />;
}
