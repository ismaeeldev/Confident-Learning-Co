"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import type { TocHeading } from "@/lib/toc";

function scrollToHeading(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  event.preventDefault();
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
  history.pushState(null, "", `#${id}`);
}

function useActiveHeading(headings: TocHeading[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  return activeId;
}

/** Sticky in-article table of contents for desktop (lg+). */
export function ArticleTOCDesktop({ headings }: { headings: TocHeading[] }) {
  const activeId = useActiveHeading(headings);
  if (headings.length === 0) return null;

  return (
    <nav aria-label="In this article" className="hidden lg:block">
      <p className="text-brand-navy-900 mb-3 text-sm font-semibold">In this article</p>
      <ul className="border-brand-sage-200 flex flex-col gap-1 border-l">
        {headings.map((heading) => {
          const active = heading.id === activeId;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                onClick={(event) => scrollToHeading(event, heading.id)}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "-ml-px block border-l-2 py-1 pl-4 text-sm leading-snug transition-colors",
                  active
                    ? "border-brand-gold-600 text-brand-navy-900 font-medium"
                    : "text-muted-foreground hover:text-brand-navy-900 border-transparent",
                )}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Collapsible "In this article" accordion for mobile/tablet. */
export function ArticleTOCMobile({ headings }: { headings: TocHeading[] }) {
  const activeId = useActiveHeading(headings);
  if (headings.length === 0) return null;

  return (
    <Accordion type="single" collapsible className="border-border rounded-2xl border px-4 lg:hidden">
      <AccordionItem value="toc">
        <AccordionTrigger className="text-sm font-semibold">In this article</AccordionTrigger>
        <AccordionContent>
          <ul className="flex flex-col gap-1">
            {headings.map((heading) => {
              const active = heading.id === activeId;
              return (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    onClick={(event) => scrollToHeading(event, heading.id)}
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "block py-1 text-sm leading-snug",
                      active ? "text-brand-navy-900 font-medium" : "text-muted-foreground",
                    )}
                  >
                    {heading.text}
                  </a>
                </li>
              );
            })}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
