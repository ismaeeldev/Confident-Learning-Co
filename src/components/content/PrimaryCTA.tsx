import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PrimaryCTAProps {
  href: string;
  children: React.ReactNode;
  size?: "default" | "lg";
}

/** The one dominant gold CTA per viewport. See docs/03-ThemeGuideline.md 3.7. */
export function PrimaryCTA({ href, children, size = "default" }: PrimaryCTAProps) {
  return (
    <Button size={size} asChild>
      <Link href={href}>{children}</Link>
    </Button>
  );
}
