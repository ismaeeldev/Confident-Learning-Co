import "server-only";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import {
  articleFrontmatterSchema,
  isValidBylineForBand,
  type Article,
} from "@/domain/content/articleSchema";
import type { ChildBand } from "@/config/canon";

const ARTICLES_DIR = path.join(process.cwd(), "src/content/articles");

let cache: Article[] | null = null;

function loadArticles(): Article[] {
  if (cache) return cache;

  const files = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".mdx"));
  const articles: Article[] = [];
  const seenSlugs = new Set<string>();

  for (const file of files) {
    const raw = readFileSync(path.join(ARTICLES_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    const frontmatter = articleFrontmatterSchema.parse(data);

    if (seenSlugs.has(frontmatter.slug)) {
      throw new Error(`Duplicate article slug: ${frontmatter.slug}`);
    }
    seenSlugs.add(frontmatter.slug);

    if (!isValidBylineForBand(frontmatter.author, frontmatter.ageBand)) {
      throw new Error(
        `Invalid byline for ${frontmatter.slug}: ${frontmatter.author} cannot author ${frontmatter.ageBand} content`,
      );
    }

    articles.push({
      ...frontmatter,
      body: content,
      readingTimeMinutes: Math.max(1, Math.ceil(readingTime(content).minutes)),
    });
  }

  articles.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  cache = articles;
  return articles;
}

export function getAllArticles(): Article[] {
  return loadArticles();
}

export function getArticlesByBand(band: ChildBand | "all"): Article[] {
  const all = loadArticles();
  return band === "all" ? all : all.filter((a) => a.ageBand === band);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return loadArticles().find((a) => a.slug === slug);
}

export function getRelatedArticles(article: Article, limit = 3): Article[] {
  return loadArticles()
    .filter((a) => a.slug !== article.slug && a.ageBand === article.ageBand)
    .slice(0, limit);
}

export function getAllSlugs(): string[] {
  return loadArticles().map((a) => a.slug);
}
