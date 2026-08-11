import { cn } from "@/lib/utils";

interface QuietCalloutProps {
  children: React.ReactNode;
  tone?: "sage" | "gold";
  className?: string;
}

/** Quiet information card for reassurance/scope/practical notes. No shadow. See docs/03-ThemeGuideline.md 3.8. */
export function QuietCallout({ children, tone = "sage", className }: QuietCalloutProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 leading-relaxed sm:p-8",
        tone === "sage" ? "bg-surface-sage text-brand-navy-900" : "bg-surface-gold text-brand-navy-900",
        className,
      )}
    >
      {children}
    </div>
  );
}
