import { brand } from "@/config/brand";
import { env } from "@/lib/env";
import type { Article } from "@/domain/content/articleSchema";

function siteUrl(path: string): string {
  return new URL(path, env.NEXT_PUBLIC_SITE_URL).toString();
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.name,
    slogan: brand.tagline,
    url: siteUrl("/"),
    logo: siteUrl("/logo.png"),
  };
}

export function personJsonLd(name: "Adam" | "Michela", role: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle: role,
    worksFor: {
      "@type": "Organization",
      name: brand.name,
    },
  };
}

export function articleJsonLd(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: siteUrl(article.featuredImage),
    author: {
      "@type": "Person",
      name: article.author,
      jobTitle: article.authorRole,
    },
    publisher: {
      "@type": "Organization",
      name: brand.name,
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: siteUrl(`/articles/${article.slug}`),
  };
}

export function breadcrumbJsonLd(items: { label: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: siteUrl(item.path),
    })),
  };
}
