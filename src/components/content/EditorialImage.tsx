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
}

const aspectClasses = {
  banner: "aspect-3/2",
  square: "aspect-square",
} as const;

/** Environmental/editorial image (3:2 banner by default). Renders a real photo when `src` is supplied, otherwise a labeled placeholder pending real photography or licensed stock. */
export function EditorialImage({ shotNote, aspect = "banner", className, src, alt }: EditorialImageProps) {
  if (src) {
    return (
      <div className={cn("relative w-full overflow-hidden rounded-2xl", aspectClasses[aspect], className)}>
        <Image
          src={src}
          alt={alt ?? shotNote}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    );
  }

  return <ImagePlaceholder label={shotNote} aspect={aspect} className={cn(className)} />;
}
