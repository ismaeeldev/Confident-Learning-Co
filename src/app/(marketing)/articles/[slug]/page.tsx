import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { EditorialImage } from "@/components/content/EditorialImage";
import { FounderPortrait } from "@/components/content/FounderPortrait";
import { ScopeNotice } from "@/components/content/ScopeNotice";
import { PrimaryCTA } from "@/components/content/PrimaryCTA";
import { ArticleCard } from "@/components/content/ArticleCard";
import { NewsletterFormSlot } from "@/components/content/NewsletterFormSlot";
import { JsonLd } from "@/components/content/JsonLd";
import { ReadingProgress } from "@/components/content/ReadingProgress";
import { ArticleTOCDesktop, ArticleTOCMobile } from "@/components/content/ArticleTOC";
import { ShareRail } from "@/components/content/ShareRail";
import { PUBLIC_ROUTES, CHILD_BAND_LABELS } from "@/config/canon";
import { getAllSlugs, getArticleBySlug, getRelatedArticles } from "@/lib/articles";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/structuredData";
import { extractHeadings } from "@/lib/toc";
import { env } from "@/lib/env";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.seoTitle,
    description: article.seoDescription,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      title: article.seoTitle,
      description: article.seoDescription,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author],
      images: [{ url: article.featuredImage }],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getRelatedArticles(article);
  const headings = extractHeadings(article.body);
  const shareUrl = new URL(`/articles/${article.slug}`, env.NEXT_PUBLIC_SITE_URL).toString();

  return (
    <>
      <JsonLd data={articleJsonLd(article)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Articles", path: PUBLIC_ROUTES.articles },
          { label: article.title, path: `/articles/${article.slug}` },
        ])}
      />

      <Section background="cream" className="relative overflow-hidden pt-12 sm:pt-16 pb-12">
        {/* Subtle ambient background glow bubbles */}
        <div aria-hidden="true" className="from-brand-gold-100/50 via-brand-sage-100/25 pointer-events-none absolute -top-24 -right-32 size-[32rem] rounded-full blur-3xl" />
        <div aria-hidden="true" className="bg-brand-sage-200/20 pointer-events-none absolute -bottom-32 -left-24 size-[26rem] rounded-full blur-3xl" />

        <Container width="reading" className="relative">
          <Reveal>
            <Breadcrumbs
              items={[
                { label: "Articles", href: PUBLIC_ROUTES.articles },
                { label: article.title },
              ]}
            />
          </Reveal>
          <Reveal delay={0.05}>
            <div className="mt-8 flex flex-col gap-5">
              
              {/* Premium color-coded age-band badge */}
              {(() => {
                const config = {
                  early: { dot: "bg-brand-gold-500" },
                  middle: { dot: "bg-brand-sage-600" },
                  "lower-secondary": { dot: "bg-brand-navy-700" },
                  "exam-years": { dot: "bg-brand-gold-700" },
                }[article.ageBand] || { dot: "bg-brand-gold-500" };
                return (
                  <span className="bg-white/95 text-brand-navy-900 border border-brand-cream-300 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide uppercase shadow-sm backdrop-blur-sm w-fit select-none">
                    <span aria-hidden="true" className={`size-1.5 rounded-full ${config.dot}`} />
                    {CHILD_BAND_LABELS[article.ageBand]}
                  </span>
                );
              })()}

              <h1 className="font-heading text-brand-navy-950 text-[clamp(2.15rem,3.2vw+1.2rem,3.4rem)] leading-[1.08] text-balance">
                {article.title}
              </h1>

              {/* Decorative divider line */}
              <div className="flex items-center gap-3 w-40 mt-1">
                <div className="h-[1.5px] bg-brand-gold-500/40 flex-1" />
                <svg className="size-2.5 text-brand-gold-600 fill-brand-gold-600 rotate-45" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" />
                </svg>
                <div className="h-[1.5px] bg-brand-gold-500/40 flex-1" />
              </div>

              <p className="text-brand-navy-800 text-lg leading-relaxed font-medium mt-2">{article.excerpt}</p>
              
              {/* Premium author byline badge */}
              <div className="flex flex-wrap items-center gap-3 bg-white/50 backdrop-blur-sm border border-brand-cream-300/40 px-4 py-2.5 rounded-2xl w-fit shadow-[var(--shadow-elevation-1)] mt-2">
                <FounderPortrait
                  founder={article.author}
                  shotNote="byline portrait"
                  aspect="square"
                  compact
                  className="size-10 shrink-0 rounded-full border border-brand-cream-300/60"
                />
                <div className="text-sm">
                  <p className="font-bold text-brand-navy-950 leading-tight">{article.author}</p>
                  <p className="text-muted-foreground text-xs">{article.authorRole}</p>
                </div>
                <div aria-hidden="true" className="w-[1px] h-6 bg-brand-cream-300 mx-2 hidden sm:block" />
                <span className="text-muted-foreground text-xs sm:text-sm font-medium">
                  {article.readingTimeMinutes} min read
                </span>
              </div>

              <ShareRail
                url={shareUrl}
                title={article.title}
                orientation="horizontal"
                className="border-border -mx-1 border-t pt-4 lg:hidden mt-2"
              />
            </div>
          </Reveal>
        </Container>
      </Section>

      <div id="article-content">
        <ReadingProgress targetId="article-content" />

        <Section background="white">
          <Container width="standard">
            <div className="lg:grid lg:grid-cols-[1fr_224px] lg:items-start lg:gap-16">
              <div className="mx-auto w-full max-w-[720px]">
                {/* Featured image wrapped in a premium double border notched frame */}
                <Reveal>
                  <div className="relative p-6 sm:p-8 bg-white border border-brand-cream-300 rounded-[32px] shadow-[0_20px_50px_-12px_rgba(20,32,56,0.08)] mb-10">
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
                        shotNote={article.featuredImageAlt}
                        src={article.featuredImage}
                        alt={article.featuredImageAlt}
                        className="rounded-xl transition-transform duration-500 hover:scale-[1.01]"
                      />
                    </div>
                  </div>
                </Reveal>

                <ArticleTOCMobile headings={headings} />

                <Reveal delay={0.05}>
                  <div className="prose-article mt-8 flex flex-col gap-5 leading-relaxed [&_blockquote]:border-brand-gold-500 [&_blockquote]:text-brand-navy-900 [&_blockquote]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:pl-5 [&_blockquote]:text-xl [&_blockquote]:leading-snug [&_blockquote]:font-medium [&_blockquote]:font-heading [&_blockquote]:not-italic [&_h2]:font-heading [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:scroll-mt-28 [&_h3]:font-heading [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:scroll-mt-28 [&_a]:text-brand-sage-800 [&_a]:underline [&_a]:underline-offset-4">
                    <MDXRemote
                      source={article.body}
                      options={{
                        mdxOptions: {
                          remarkPlugins: [remarkGfm],
                          rehypePlugins: [
                            rehypeSlug,
                            [rehypeAutolinkHeadings, { behavior: "wrap" }],
                          ],
                        },
                      }}
                    />
                  </div>
                </Reveal>

                <Reveal delay={0.1}>
                  <div className="mt-10">
                    <ScopeNotice />
                  </div>
                </Reveal>

                <Reveal delay={0.15}>
                  <div className="mt-10 text-center">
                    <PrimaryCTA href={PUBLIC_ROUTES.reflection}>
                      Take the 5-Minute Parent Reflection
                    </PrimaryCTA>
                  </div>
                </Reveal>
              </div>

              <aside className="hidden lg:sticky lg:top-28 lg:flex lg:flex-col lg:gap-8">
                <ArticleTOCDesktop headings={headings} />
                <div className="border-border flex flex-col items-center gap-4 border-t pt-6">
                  <ShareRail url={shareUrl} title={article.title} orientation="vertical" />
                </div>
              </aside>
            </div>
          </Container>
        </Section>
      </div>

      <Section background="cream">
        <Container width="reading">
          <Reveal>
            <NewsletterFormSlot />
          </Reveal>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section background="white">
          <Container>
            <Reveal>
              <h2 className="font-heading mb-6 text-2xl sm:text-3xl">Related reading</h2>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <Reveal key={item.slug} delay={index * 0.05}>
                  <ArticleCard
                    article={{
                      slug: item.slug,
                      title: item.title,
                      excerpt: item.excerpt,
                      author: item.author,
                      authorRole: item.authorRole,
                      ageBand: item.ageBand,
                      readingTimeMinutes: item.readingTimeMinutes,
                      imageShotNote: item.featuredImageAlt,
                      image: item.featuredImage,
                    }}
                  />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
