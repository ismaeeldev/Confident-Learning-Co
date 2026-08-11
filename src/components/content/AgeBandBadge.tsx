import { Badge } from "@/components/ui/badge";
import { CHILD_BAND_LABELS, type ChildBand } from "@/config/canon";

/** Displays the public year-band label. Never render the internal enum key itself. */
export function AgeBandBadge({ band }: { band: ChildBand }) {
  return (
    <Badge variant="outline" className="text-brand-navy-900 border-brand-sage-600 px-3 py-1 text-sm">
      {CHILD_BAND_LABELS[band]}
    </Badge>
  );
}
