import { cn } from "@/lib/utils";

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-brand-sage-800 text-sm font-semibold tracking-wide uppercase", className)}>
      {children}
    </p>
  );
}
