import { cn } from "@/lib/utils";

const widths = {
  reading: "max-w-3xl",
  standard: "max-w-6xl",
  wide: "max-w-7xl",
} as const;

interface ContainerProps {
  children: React.ReactNode;
  width?: keyof typeof widths;
  className?: string;
}

export function Container({ children, width = "standard", className }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full px-5 sm:px-8 lg:px-12", widths[width], className)}>
      {children}
    </div>
  );
}
