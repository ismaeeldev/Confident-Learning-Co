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
      <Section background="cream" className="pt-12 sm:pt-16">
        <Container>
          <Reveal>
            <EditorialImage shotNote="Section header: shot 9 or 10, one of you outdoors, soft light, full width with text over it" />
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="font-heading mt-8 text-4xl sm:text-5xl">Learning Confidence, Answered</h1>
          </Reveal>
        </Container>
      </Section>

      <Section background="white">
        <Container>
          <Reveal>
            <nav
              className="mb-10 flex flex-wrap gap-2"
              aria-label="Filter articles by school year band"
            >
              {filters.map((filter) => {
                const isActive = filter.value === activeBand;
                return (
                  <Link
                    key={filter.value}
                    href={filter.value === "all" ? "/articles" : `/articles?band=${filter.value}`}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <Badge
                      variant={isActive ? "secondary" : "outline"}
                      className={cn(
                        "px-4 py-2 text-sm",
                        !isActive && "text-brand-navy-900 border-brand-sage-600",
                      )}
                    >
                      {filter.label}
                    </Badge>
                  </Link>
                );
              })}
            </nav>
          </Reveal>

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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
