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
import { AgeBandBadge } from "@/components/content/AgeBandBadge";
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
import { PUBLIC_ROUTES } from "@/config/canon";
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

      <Section background="cream" className="pt-12 sm:pt-16">
        <Container width="reading">
          <Reveal>
            <Breadcrumbs
              items={[
                { label: "Articles", href: PUBLIC_ROUTES.articles },
                { label: article.title },
              ]}
            />
          </Reveal>
          <Reveal delay={0.05}>
            <div className="mt-6 flex flex-col gap-4">
              <AgeBandBadge band={article.ageBand} />
              <h1 className="font-heading text-[clamp(2rem,3.5vw+1.1rem,3rem)] leading-[1.08] text-balance">
                {article.title}
              </h1>
              <p className="text-brand-navy-800 text-lg leading-relaxed">{article.excerpt}</p>
              <div className="flex flex-wrap items-center gap-3">
                <FounderPortrait
                  founder={article.author}
                  shotNote="byline portrait"
                  aspect="square"
                  compact
                  className="size-12 shrink-0"
                />
                <div className="text-sm">
                  <p className="font-medium">{article.author}</p>
                  <p className="text-muted-foreground">{article.authorRole}</p>
                </div>
                <span className="text-muted-foreground ml-auto text-sm">
                  {article.readingTimeMinutes} min read
                </span>
              </div>
              <ShareRail
                url={shareUrl}
                title={article.title}
                orientation="horizontal"
                className="border-border -mx-1 border-t pt-4 lg:hidden"
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
                <Reveal>
                  <EditorialImage
                    shotNote={article.featuredImageAlt}
                    src={article.featuredImage}
                    alt={article.featuredImageAlt}
                    className="mb-10"
                  />
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
