import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { legalNavigation } from "@/config/navigation";

/**
 * Generic "quick links" support column for the legal pages. Cross-links to
 * the other legal documents only — it does not invent contact details or
 * copy that hasn't been supplied. Shared across Privacy/Terms/Cookies/Refund
 * so it stays out of any single page's dedicated pass.
 */
function QuickLinks({ currentPath }: { currentPath: string }) {
  const otherLinks = legalNavigation.filter((link) => link.href !== currentPath);

  return (
    <Card className="bg-surface-sage ring-0">
      <CardHeader>
        <CardTitle>Related policies</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-2">
          {otherLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-brand-sage-800 focus-visible:ring-focus-ring rounded-sm text-sm underline underline-offset-4 outline-none focus-visible:ring-3"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

interface LegalSupportColumnProps {
  currentPath: string;
}

export function LegalSupportColumn({ currentPath }: LegalSupportColumnProps) {
  return (
    <>
      {/* Desktop (xl+): sticky rail alongside the reading column. */}
      <aside
        aria-label="Related policies"
        className="hidden xl:sticky xl:top-40 xl:block xl:max-h-[calc(100vh-10rem)] xl:overflow-y-auto"
      >
        <QuickLinks currentPath={currentPath} />
      </aside>

      {/* Mobile / tablet / lg-desktop: a normal card in document flow, never a sidebar. */}
      <div className="xl:hidden">
        <QuickLinks currentPath={currentPath} />
      </div>
    </>
  );
}
