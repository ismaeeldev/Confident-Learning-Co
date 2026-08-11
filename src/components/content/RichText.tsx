import { cn } from "@/lib/utils";

/** Consistent reading-width prose block for approved body copy. */
export function RichText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 leading-relaxed [&_p]:leading-relaxed", className)}>
      {children}
    </div>
  );
}
