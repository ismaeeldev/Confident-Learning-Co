import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PendingCheckoutButtonProps {
  label: string;
  size?: "default" | "lg";
  className?: string;
}

/**
 * Placeholder for a checkout CTA whose real checkout route hasn't been
 * built yet (Group Programme / 1:1 Resets — Part 2 new work, no Stripe
 * price configured). Renders disabled with a neutral explanation rather
 * than linking to an unbuilt route or faking a payment flow. Swap for a
 * real Link once the checkout route exists.
 *
 * R9 fix (25 Aug 2026): the previous copy read "Checkout opens once
 * Stripe integration is live (Step 8 of the build)" — an internal build
 * process reference visible on a live public page. Removed.
 */
export function PendingCheckoutButton({ label, size = "default", className }: PendingCheckoutButtonProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2 w-full", className)}>
      <Button size={size} disabled aria-disabled="true" className="w-full">
        {label}
      </Button>
      <p className="text-brand-sage-800 text-xs text-center">Booking opens soon.</p>
    </div>
  );
}
