import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

/**
 * Newsletter signup slot. Server-side validation, Kit upsert, and the
 * dedicated source tag belong to Step 11 (Forms, Analytics, Monitoring).
 * Renders the real UI, disabled, rather than a fake working submission.
 */
export function NewsletterFormSlot() {
  return (
    <div className="border-border bg-surface-sage rounded-2xl border p-6 sm:p-8">
      <h2 className="font-heading text-xl">Get new articles by email</h2>
      <p className="text-brand-sage-800 mt-1 text-sm">
        Occasional, age-relevant, no spam. Unsubscribe any time.
      </p>
      <form className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Label htmlFor="newsletter-email" className="sr-only">
            Email address
          </Label>
          <Input
            id="newsletter-email"
            type="email"
            placeholder="you@example.com"
            disabled
            aria-describedby="newsletter-pending"
          />
        </div>
        <Button type="submit" disabled>
          Subscribe
        </Button>
      </form>
      <p id="newsletter-pending" className="text-brand-sage-800 mt-2 text-xs">
        Newsletter signup opens once forms integration is live (Step 11 of the build).
      </p>
    </div>
  );
}
