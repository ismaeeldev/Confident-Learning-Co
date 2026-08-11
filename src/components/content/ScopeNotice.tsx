import { cn } from "@/lib/utils";

/** Standard scope-of-practice disclaimer text. Wording is approved; do not rewrite. */
export function ScopeNotice({ className }: { className?: string }) {
  return (
    <p className={cn("text-muted-foreground text-sm leading-relaxed", className)}>
      This work is parent education and parent coaching. It is not therapy, counselling, or
      assessment, and it is not a substitute for the work of GPs, schools, or qualified mental
      health professionals. Adam and Michela do not diagnose, treat, or assess any condition. If
      your child is showing signs of significant or persistent distress, speak to your GP or your
      child&rsquo;s school first. Our work sits alongside that support, never in place of it.
    </p>
  );
}
