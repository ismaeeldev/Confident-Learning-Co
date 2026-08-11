import { cn } from "@/lib/utils";

const backgrounds = {
  cream: "bg-background",
  white: "bg-surface",
  sage: "bg-surface-sage",
  gold: "bg-surface-gold",
  navy: "bg-brand-navy-900 text-brand-cream-100",
} as const;

interface SectionProps {
  children: React.ReactNode;
  background?: keyof typeof backgrounds;
  className?: string;
  as?: "section" | "div";
}

export function Section({
  children,
  background = "cream",
  className,
  as: Tag = "section",
}: SectionProps) {
  return (
    <Tag className={cn("py-18 sm:py-24 lg:py-32", backgrounds[background], className)}>
      {children}
    </Tag>
  );
}
