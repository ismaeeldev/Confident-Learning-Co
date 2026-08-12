"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { LegalDraftNotice } from "./LegalDraftNotice";
import { LegalToc, type LegalTocItem } from "./LegalToc";
import { LegalSupportColumn } from "./LegalSupportColumn";
import { slugify } from "@/lib/toc";

interface LegalPageProps {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}

/**
 * Shared shell for the four legal pages (Privacy, Terms, Cookies, Refund
 * Policy). Legal copy is passed in as `children` (plain <h2>/<p>/<ul> markup
 * authored per page) and is never touched here — this component only adds
 * structural chrome: heading anchors for the "On this page" TOC, the support
 * column of cross-links, and responsive layout.
 *
 * Desktop (xl+): three-column layout — sticky TOC rail, reading-width content
 * column, sticky "related policies" rail.
 * Mobile/tablet (< xl): single column — TOC as a collapsible accordion,
 * support links as a normal in-flow card. No sticky sidebars.
 */
export function LegalPage({ title, updatedAt, children }: LegalPageProps) {
  const pathname = usePathname();
  const contentRef = useRef<HTMLDivElement>(null);
  const [tocItems, setTocItems] = useState<LegalTocItem[]>([]);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const headings = Array.from(container.querySelectorAll<HTMLHeadingElement>("h2"));
    const seen = new Map<string, number>();

    const items = headings.map((heading) => {
      const text = heading.textContent?.trim() ?? "";
      let id = slugify(text);
      const count = seen.get(id) ?? 0;
      seen.set(id, count + 1);
      if (count > 0) id = `${id}-${count}`;
      heading.id = id;
      return { id, label: text };
    });

    setTocItems(items);
  }, [children]);

  return (
    <Section background="cream" className="pt-10 pb-20 sm:pt-14">
      <Container width="wide">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-heading text-3xl sm:text-4xl">{title}</h1>
          <p className="text-muted-foreground mt-2 mb-8 text-sm">Last updated: {updatedAt}</p>

          <div className="flex flex-col gap-8 xl:grid xl:grid-cols-[13rem_minmax(0,42rem)_16rem] xl:items-start xl:gap-10">
            <LegalToc items={tocItems} />

            <div className="flex min-w-0 flex-col gap-5">
              <LegalDraftNotice />
              <div
                ref={contentRef}
                className="flex flex-col gap-5 leading-relaxed [&_h2]:font-heading [&_h2]:mt-8 [&_h2]:scroll-mt-28 [&_h2]:text-2xl [&_h2]:first:mt-0 sm:[&_h2]:scroll-mt-40 [&_li]:ml-5 [&_li]:list-disc [&_p]:leading-relaxed [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5 [&_a]:text-brand-sage-800 [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-brand-sage-700 [&_a]:focus-visible:ring-focus-ring [&_a]:rounded-sm [&_a]:outline-none [&_a]:focus-visible:ring-3"
              >
                {children}
              </div>
            </div>

            <LegalSupportColumn currentPath={pathname} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
