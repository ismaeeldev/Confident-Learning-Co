import { Button } from "@/components/ui/button";

interface PendingCheckoutButtonProps {
  label: string;
  size?: "default" | "lg";
}

/**
 * Placeholder for a checkout CTA whose Stripe wiring belongs to a later
 * build phase (Step 8, Guide payment and fulfilment). Renders disabled with
 * an explanation rather than linking to an unbuilt route or faking a
 * payment flow. Swap for a real Link once the checkout route exists.
 */
export function PendingCheckoutButton({ label, size = "default" }: PendingCheckoutButtonProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Button size={size} disabled aria-disabled="true">
        {label}
      </Button>
      <p className="text-brand-sage-800 text-xs">
        Checkout opens once Stripe integration is live (Step 8 of the build).
      </p>
    </div>
  );
}
