"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/layout/Container";
import { legalNavigation } from "@/config/navigation";
import { cn } from "@/lib/utils";

/**
 * Shared sub-navigation for the four legal pages (Privacy, Terms, Cookies,
 * Refund Policy). Generic and structural only — no page-specific content —
 * so it can live in the shared (legal) layout without conflicting with
 * per-page passes.
 *
 * Horizontally scrollable, accessible chips on mobile; a plain inline row on
 * larger screens. Sticky beneath the main site header so it stays reachable
 * while reading a long policy.
 */
export function LegalSubnav() {
  const pathname = usePathname();

  return (
    <div className="border-border/70 sticky top-16 z-30 border-y bg-background/95 backdrop-blur-sm sm:top-20">
      <Container>
        <nav
          className="scrollbar-none -mx-5 flex gap-2 overflow-x-auto px-5 py-3 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
          aria-label="Legal pages"
        >
          {legalNavigation.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className="focus-visible:ring-focus-ring shrink-0 rounded-full outline-none focus-visible:ring-3"
              >
                <Badge
                  variant={active ? "secondary" : "outline"}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm transition-colors",
                    !active &&
                      "text-brand-navy-800 border-brand-sage-300 hover:border-brand-sage-600 hover:bg-surface-sage",
                  )}
                >
                  {link.label}
                </Badge>
              </Link>
            );
          })}
        </nav>
      </Container>
    </div>
  );
}
