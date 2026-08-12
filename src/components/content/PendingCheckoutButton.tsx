import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PendingCheckoutButtonProps {
  label: string;
  size?: "default" | "lg";
  className?: string;
}

/**
 * Placeholder for a checkout CTA whose Stripe wiring belongs to a later
 * build phase (Step 8, Guide payment and fulfilment). Renders disabled with
 * an explanation rather than linking to an unbuilt route or faking a
 * payment flow. Swap for a real Link once the checkout route exists.
 */
export function PendingCheckoutButton({ label, size = "default", className }: PendingCheckoutButtonProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2 w-full", className)}>
      <Button size={size} disabled aria-disabled="true" className="w-full">
        {label}
      </Button>
      <p className="text-brand-sage-800 text-xs text-center">
        Checkout opens once Stripe integration is live (Step 8 of the build).
      </p>
    </div>
  );
}
