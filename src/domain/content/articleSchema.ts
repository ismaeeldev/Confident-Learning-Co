import { z } from "zod";
import { CHILD_BANDS } from "@/config/canon";

/** Typed frontmatter schema for launch articles. See docs/01-ProjectScope.md 1.6. */
export const articleFrontmatterSchema = z.object({
  title: z.string().min(1).max(120),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase kebab-case"),
  excerpt: z.string().min(1).max(300),
  author: z.enum(["Adam", "Michela"]),
  authorRole: z.string().min(1),
  ageBand: z.enum(CHILD_BANDS),
  featuredImage: z.string().min(1),
  featuredImageAlt: z.string().min(1),
  seoTitle: z.string().min(1).max(70),
  seoDescription: z.string().min(1).max(160),
  publishedAt: z.string().date(),
  updatedAt: z.string().date(),
});

export type ArticleFrontmatter = z.infer<typeof articleFrontmatterSchema>;

export interface Article extends ArticleFrontmatter {
  body: string;
  readingTimeMinutes: number;
}

/** Adam authors early/middle-band articles; Michela authors secondary-band articles. See source-files byline rule. */
export function isValidBylineForBand(author: ArticleFrontmatter["author"], ageBand: ArticleFrontmatter["ageBand"]): boolean {
  const secondaryBands = ["lower-secondary", "exam-years"];
  if (secondaryBands.includes(ageBand)) return author === "Michela";
  return author === "Adam";
}
