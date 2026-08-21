import { ShieldCheck } from "lucide-react";
import { PrimaryCTA } from "@/components/content/PrimaryCTA";
import { PendingCheckoutButton } from "@/components/content/PendingCheckoutButton";
import { db } from "@/db/client";
import { getFoundersSoldCount, getFoundersWindowState } from "@/domain/founders/foundersCounter";
import { products, formatMinorAsGbp } from "@/config/products";
import { FOUNDERS_CAP_COUNT } from "@/config/canon";

/**
 * Phase 7 — replaces a real pricing-law defect found and fixed 20 Aug
 * 2026: the previous block showed £147 struck through beside £89
 * ("Full price £147"), which Annexe B §12A explicitly forbids — under UK
 * consumer law a struck-through comparison price must be a price the
 * product has genuinely sold at, and the Guide never has. Copy below is
 * the client's exact required wording, do not reword it.
 *
 * Async server component — fetches the real, live sold count (never a
 * display-layer number separate from what actually gates checkout).
 */
export async function FoundersPricingBlock() {
  const guide = products.guide;
  const soldCount = await getFoundersSoldCount(db);
  const windowState = getFoundersWindowState(soldCount, new Date());
  const remaining = Math.max(0, FOUNDERS_CAP_COUNT - soldCount);

  if (!windowState.open) {
    const closedCopy =
      windowState.reason === "all_taken"
        ? {
            heading: "The founders places have gone.",
            body: "All fifty are taken. Thank you to everyone who came in early. Leave your email below and we will tell you when the Guide opens again.",
          }
        : {
            heading: "The founders window has closed.",
            body: `Founders pricing ran until 27 September and has now ended. The Learning Confidence Parent Guide is ${formatMinorAsGbp(guide.fullPriceMinor!)}.`,
          };

    return (
      <div className="relative z-10 flex flex-col items-center gap-3 text-center bg-brand-cream-200/50 border border-brand-cream-300/40 rounded-2xl px-6 py-6 w-full">
        <h3 className="font-heading text-brand-navy-950 text-xl">{closedCopy.heading}</h3>
        <p className="text-brand-navy-800 text-sm leading-relaxed">{closedCopy.body}</p>
        <PrimaryCTA href="/checkout/guide" size="lg" arrow className="mt-2 w-full">
          {`Get the Parent Guide, ${formatMinorAsGbp(guide.fullPriceMinor!)}`}
        </PrimaryCTA>
      </div>
    );
  }

  return (
    <>
      <div className="relative z-10 flex flex-col items-center gap-1.5 text-center bg-brand-cream-200/50 border border-brand-cream-300/40 rounded-2xl px-6 py-4 w-full">
        <p className="text-[10px] text-brand-sage-800 uppercase tracking-widest font-bold">
          Special Pricing
        </p>
        <div className="flex items-baseline gap-2.5 mt-0.5">
          <span className="text-brand-navy-950 text-3xl sm:text-4xl font-extrabold font-heading leading-none">
            {formatMinorAsGbp(guide.founderPriceMinor!)} for the first fifty.
          </span>
        </div>
        <p className="text-muted-foreground text-sm">
          After that it is {formatMinorAsGbp(guide.fullPriceMinor!)}.
        </p>
        <p className="text-brand-sage-800 text-xs font-semibold mt-1">
          {remaining} of {FOUNDERS_CAP_COUNT} founders places remaining.
        </p>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center gap-4">
        {guide.stripePriceId ? (
          <PrimaryCTA
            href="/checkout/guide"
            size="lg"
            arrow
            className="w-full shadow-[0_10px_25px_-5px_rgba(201,169,97,0.45)]"
          >
            {`Get the Parent Guide, ${formatMinorAsGbp(guide.founderPriceMinor!)}`}
          </PrimaryCTA>
        ) : (
          <PendingCheckoutButton
            label={`Get the Parent Guide, ${formatMinorAsGbp(guide.founderPriceMinor!)}`}
            size="lg"
            className="w-full"
          />
        )}

        <p className="text-muted-foreground flex items-center justify-center gap-2 text-xs text-center mt-2 max-w-sm">
          <ShieldCheck className="text-brand-sage-700 size-4 shrink-0" aria-hidden="true" />
          Secure checkout through Stripe. The Guide and your community invitation arrive by email
          within minutes.
        </p>
      </div>
    </>
  );
}
