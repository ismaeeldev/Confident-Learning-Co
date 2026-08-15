import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

/**
 * Every legal page must carry this until a qualified legal adviser has
 * reviewed and approved final wording. See docs/09-SecurityPrivacyCompliance.md
 * 9.11: "The coding agent creates technical controls and policy placeholders;
 * it does not provide legal advice or invent policy content." Do not remove
 * this notice without an explicit, recorded client/legal sign-off.
 */
export function LegalDraftNotice() {
  return (
    <Alert className="border-brand-gold-500 bg-surface-gold mb-10">
      <AlertTitle className="text-brand-navy-900">Draft: pending legal review</AlertTitle>
      <AlertDescription className="text-brand-navy-800">
        This page reflects the platform&rsquo;s actual data flows and business rules as built, but
        has not been reviewed or approved by a qualified legal adviser. Do not treat this as
        final, and do not remove this notice without recorded sign-off from the client and their
        legal adviser.
      </AlertDescription>
    </Alert>
  );
}
