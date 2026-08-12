"use client";

import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export interface LegalTocItem {
  id: string;
  label: string;
}

function scrollToHeading(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  event.preventDefault();
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
  history.pushState(null, "", `#${id}`);
}

interface LegalTocLinksProps {
  items: LegalTocItem[];
  activeId: string | null;
  onNavigate?: () => void;
}

function LegalTocLinks({ items, activeId, onNavigate }: LegalTocLinksProps) {
  return (
    <ul className="flex flex-col gap-1">
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active ? "location" : undefined}
              onClick={(event) => {
                scrollToHeading(event, item.id);
                onNavigate?.();
              }}
              className={cn(
                "focus-visible:ring-focus-ring block rounded-md border-l-2 py-1 pl-3 text-sm outline-none transition-colors focus-visible:ring-3",
                active
                  ? "border-brand-sage-700 text-brand-navy-900 font-medium"
                  : "text-muted-foreground hover:text-brand-navy-900 border-transparent hover:border-brand-sage-300",
              )}
            >
              {item.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * "On this page" table of contents for a legal document.
 *
 * Desktop (xl+, matching the three-column legal layout): sticky rail with
 * scroll-spy active state via IntersectionObserver. Mobile/tablet (< xl): a
 * collapsible accordion so it never occupies a sticky sidebar on small
 * screens.
 */
export function LegalToc({ items }: { items: LegalTocItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);
  const [accordionValue, setAccordionValue] = useState<string>("");
  const visibleIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleIds.current.add(entry.target.id);
          } else {
            visibleIds.current.delete(entry.target.id);
          }
        }
        const firstVisible = items.find((item) => visibleIds.current.has(item.id));
        if (firstVisible) setActiveId(firstVisible.id);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );

    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <>
      {/* Mobile / tablet: collapsible accordion, sits inline in document flow. */}
      <div className="xl:hidden">
        <Accordion
          type="single"
          collapsible
          value={accordionValue}
          onValueChange={setAccordionValue}
          className="border-border rounded-xl border px-4"
        >
          <AccordionItem value="toc" className="border-b-0">
            <AccordionTrigger className="text-brand-navy-900 py-3.5 text-sm font-semibold no-underline hover:no-underline">
              On this page
            </AccordionTrigger>
            <AccordionContent>
              <LegalTocLinks
                items={items}
                activeId={activeId}
                onNavigate={() => setAccordionValue("")}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Desktop: sticky rail with scroll-spy. */}
      <nav
        aria-label="On this page"
        className="hidden xl:sticky xl:top-40 xl:block xl:max-h-[calc(100vh-10rem)] xl:overflow-y-auto"
      >
        <p className="text-brand-navy-900 mb-3 text-xs font-semibold tracking-wide uppercase">
          On this page
        </p>
        <LegalTocLinks items={items} activeId={activeId} />
      </nav>
    </>
  );
}
