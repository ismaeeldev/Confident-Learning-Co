import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { EditorialImage } from "@/components/content/EditorialImage";
import { ArticleCard } from "@/components/content/ArticleCard";
import { Badge } from "@/components/ui/badge";
import { CHILD_BAND_LABELS, CHILD_BANDS, type ChildBand } from "@/config/canon";
import { getArticlesByBand } from "@/lib/articles";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Learning Confidence, Answered",
  description: "Articles organised by school year band, from ages 6 to 16.",
  openGraph: {
    title: "Learning Confidence, Answered: The Confident Learning Co.",
    description: "Expert articles and actionable guides on rebuilding children's learning confidence, organised by age group bands from 6 to 16.",
    type: "website",
    url: "/articles",
    siteName: "The Confident Learning Co.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learning Confidence, Answered: The Confident Learning Co.",
    description: "Expert articles and actionable guides on rebuilding children's learning confidence, organised by age group bands from 6 to 16.",
  },
};

type BandFilter = ChildBand | "all";

function isBandFilter(value: string | undefined): value is BandFilter {
  return value === "all" || (CHILD_BANDS as readonly string[]).includes(value ?? "");
}

interface ArticlesPageProps {
  searchParams: Promise<{ band?: string }>;
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const params = await searchParams;
  const activeBand: BandFilter = isBandFilter(params.band) ? params.band : "all";
  const articles = getArticlesByBand(activeBand);

  const filters: { label: string; value: BandFilter }[] = [
    { label: "All", value: "all" },
    ...CHILD_BANDS.map((band) => ({ label: CHILD_BAND_LABELS[band], value: band })),
  ];

  return (
    <>
      <Section background="cream" className="relative overflow-hidden pt-12 pb-10 sm:pt-16 sm:pb-14">
        {/* Subtle ambient background glows */}
        <div aria-hidden="true" className="from-brand-gold-100/50 via-brand-sage-100/30 pointer-events-none absolute -top-24 -right-32 size-[32rem] rounded-full blur-3xl" />
        <div aria-hidden="true" className="bg-brand-sage-200/20 pointer-events-none absolute -bottom-32 -left-24 size-[26rem] rounded-full blur-3xl" />

        <Container>
          <Reveal>
            <div className="relative p-6 sm:p-8 bg-white border border-brand-cream-300 rounded-[32px] shadow-[0_20px_50px_-12px_rgba(20,32,56,0.08)] max-w-5xl mx-auto">
              <div className="absolute inset-4 border border-brand-gold-500/30 rounded-[20px] pointer-events-none">
                <div className="absolute -top-1.5 -left-1.5 size-3 bg-white border border-brand-gold-500 flex items-center justify-center rotate-45">
                  <div className="size-1 bg-brand-gold-500 rounded-full" />
                </div>
                <div className="absolute -top-1.5 -right-1.5 size-3 bg-white border border-brand-gold-500 flex items-center justify-center rotate-45">
                  <div className="size-1 bg-brand-gold-500 rounded-full" />
                </div>
                <div className="absolute -bottom-1.5 -left-1.5 size-3 bg-white border border-brand-gold-500 flex items-center justify-center rotate-45">
                  <div className="size-1 bg-brand-gold-500 rounded-full" />
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 size-3 bg-white border border-brand-gold-500 flex items-center justify-center rotate-45">
                  <div className="size-1 bg-brand-gold-500 rounded-full" />
                </div>
              </div>
              <div className="relative border border-dashed border-brand-sage-300/50 bg-brand-sage-100/30 rounded-[18px] p-2 overflow-hidden">
                <EditorialImage
                  shotNote="Section header: shot 9 or 10, one of you outdoors, soft light, full width with text over it"
                  className="rounded-xl transition-transform duration-500 hover:scale-[1.01]"
                />
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="text-center mt-10">
            <h1 className="font-heading max-w-3xl mx-auto text-brand-navy-950 text-[clamp(2.25rem,4vw+1rem,3.75rem)] leading-[1.05] text-balance">
              Learning Confidence, Answered
            </h1>
            
            {/* Decorative divider line */}
            <div className="flex items-center justify-center gap-3 w-40 mt-4 mx-auto">
              <div className="h-[1.5px] bg-brand-gold-500/40 flex-1" />
              <svg className="size-2.5 text-brand-gold-600 fill-brand-gold-600 rotate-45" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" />
              </svg>
              <div className="h-[1.5px] bg-brand-gold-500/40 flex-1" />
            </div>
          </Reveal>
        </Container>
      </Section>

      <div className="border-b border-brand-cream-300 bg-white/95 sticky top-16 z-30 shadow-[0_2px_15px_-3px_rgba(20,32,56,0.03)] backdrop-blur-sm sm:top-20">
        <Container>
          <Reveal>
            <nav
              className="scrollbar-none -mx-5 flex gap-2.5 overflow-x-auto px-5 py-3.5 sm:mx-0 sm:justify-center sm:overflow-visible sm:px-0"
              aria-label="Filter articles by school year band"
            >
              {filters.map((filter) => {
                const isActive = filter.value === activeBand;
                return (
                  <Link
                    key={filter.value}
                    href={filter.value === "all" ? "/articles" : `/articles?band=${filter.value}`}
                    scroll={false}
                    aria-current={isActive ? "true" : undefined}
                    className="focus-visible:ring-focus-ring shrink-0 rounded-full outline-none focus-visible:ring-3"
                  >
                    <Badge
                      className={cn(
                        "rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 border shadow-sm select-none",
                        isActive
                          ? "bg-brand-navy-950 text-brand-cream-100 border-transparent hover:bg-brand-navy-900"
                          : "bg-white/90 text-brand-navy-900 border-brand-sage-300/80 hover:border-brand-sage-500 hover:bg-brand-sage-50/50 hover:text-brand-navy-950",
                      )}
                    >
                      {filter.label}
                    </Badge>
                  </Link>
                );
              })}
            </nav>
          </Reveal>
        </Container>
      </div>

      <Section background="white" className="pt-10 sm:pt-14">
        <Container>
          <h2 className="sr-only">
            {activeBand === "all" ? "All articles" : `Articles for ${CHILD_BAND_LABELS[activeBand]}`}
          </h2>

          {articles.length === 0 ? (
            <Reveal delay={0.05}>
              <div className="border-brand-sage-300 bg-surface-sage flex flex-col items-center gap-3 rounded-2xl border border-dashed p-12 text-center">
                <p className="text-brand-sage-800 max-w-md">
                  No articles in this band yet.
                </p>
              </div>
            </Reveal>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:gap-10">
              {articles.map((article, index) => (
                <Reveal key={article.slug} delay={index * 0.04}>
                  <ArticleCard
                    article={{
                      slug: article.slug,
                      title: article.title,
                      excerpt: article.excerpt,
                      author: article.author,
                      authorRole: article.authorRole,
                      ageBand: article.ageBand,
                      readingTimeMinutes: article.readingTimeMinutes,
                      imageShotNote: article.featuredImageAlt,
                      image: article.featuredImage,
                    }}
                  />
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
