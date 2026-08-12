import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PrimaryCTAProps {
  href: string;
  children: React.ReactNode;
  size?: "default" | "lg";
  className?: string;
  /** Adds the optional trailing arrow permitted by docs/03-ThemeGuideline.md 3.7, with a subtle hover nudge. */
  arrow?: boolean;
}

/** The one dominant gold CTA per viewport. See docs/03-ThemeGuideline.md 3.7. */
export function PrimaryCTA({
  href,
  children,
  size = "default",
  className,
  arrow = false,
}: PrimaryCTAProps) {
  return (
    <Button size={size} asChild className={cn(className)}>
      <Link href={href}>
        {children}
        {arrow && (
          <ArrowRight
            data-icon="inline-end"
            aria-hidden="true"
            className="transition-transform duration-200 group-hover/button:translate-x-1"
          />
        )}
      </Link>
    </Button>
  );
}
