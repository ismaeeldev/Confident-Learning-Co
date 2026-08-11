import { cn } from "@/lib/utils";

type Level = 1 | 2 | 3 | 4;

const levelClasses: Record<Level, string> = {
  1: "text-4xl leading-tight sm:text-5xl lg:text-6xl",
  2: "text-3xl sm:text-4xl",
  3: "text-2xl sm:text-3xl",
  4: "text-xl sm:text-2xl",
};

interface HeadingProps {
  level?: Level;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

/** Consistent editorial heading. Use `level` for visual size and semantics together. */
export function Heading({ level = 2, children, className, id }: HeadingProps) {
  const Tag = (`h${level}` as const) as "h1" | "h2" | "h3" | "h4";
  return (
    <Tag id={id} className={cn("font-heading", levelClasses[level], className)}>
      {children}
    </Tag>
  );
}
