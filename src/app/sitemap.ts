import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { getAllArticles } from "@/lib/articles";
import { PUBLIC_ROUTES } from "@/config/canon";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.NEXT_PUBLIC_SITE_URL;
  const staticRoutes: MetadataRoute.Sitemap = [
    PUBLIC_ROUTES.home,
    PUBLIC_ROUTES.reflection,
    PUBLIC_ROUTES.parentGuide,
    PUBLIC_ROUTES.insideTheLoop,
    // Work With Us Closely is members-only (not public-facing) — see note in
    // src/app/(marketing)/work-with-us/page.tsx — deliberately excluded here.
    // Phase 11 (Annexe A): pathway, where-to-start, and pathway/booked are
    // all deliberately excluded here too — pathway is members-only, and
    // where-to-start/pathway/booked must be unlisted even though they're
    // reachable without signing in.
    PUBLIC_ROUTES.about,
    PUBLIC_ROUTES.articles,
    PUBLIC_ROUTES.privacy,
    PUBLIC_ROUTES.terms,
    PUBLIC_ROUTES.communityTerms,
    PUBLIC_ROUTES.cookies,
    PUBLIC_ROUTES.refundPolicy,
  ].map((path) => ({
    url: new URL(path, base).toString(),
    lastModified: new Date(),
  }));

  const articleRoutes: MetadataRoute.Sitemap = getAllArticles().map((article) => ({
    url: new URL(PUBLIC_ROUTES.articleDetail(article.slug), base).toString(),
    lastModified: new Date(article.updatedAt),
  }));

  return [...staticRoutes, ...articleRoutes];
}
