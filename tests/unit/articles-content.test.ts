import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getAllArticles } from "@/lib/articles";
import { ARCHETYPE_KEYS, CHILD_BANDS } from "@/config/canon";

const articles = getAllArticles();

describe("launch article set", () => {
  it("has exactly eight articles", () => {
    expect(articles).toHaveLength(8);
  });

  it("has unique slugs", () => {
    const slugs = articles.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has exactly two articles per age band", () => {
    for (const band of CHILD_BANDS) {
      const count = articles.filter((a) => a.ageBand === band).length;
      expect(count, `expected 2 articles for band "${band}"`).toBe(2);
    }
  });

  it("has valid authors for every band (Adam: early/middle, Michela: lower-secondary/exam-years)", () => {
    for (const article of articles) {
      const expectedAuthor =
        article.ageBand === "lower-secondary" || article.ageBand === "exam-years"
          ? "Michela"
          : "Adam";
      expect(article.author, `${article.slug} has wrong byline`).toBe(expectedAuthor);
    }
  });

  it("keeps SEO metadata within safe length limits", () => {
    for (const article of articles) {
      expect(article.seoTitle.length, `${article.slug} seoTitle too long`).toBeLessThanOrEqual(70);
      expect(
        article.seoDescription.length,
        `${article.slug} seoDescription too long`,
      ).toBeLessThanOrEqual(160);
    }
  });

  it("never exposes internal archetype names in public-facing text", () => {
    for (const article of articles) {
      const publicText = `${article.title} ${article.excerpt} ${article.body}`.toLowerCase();
      for (const archetype of ARCHETYPE_KEYS) {
        expect(
          publicText.includes(archetype.toLowerCase()),
          `${article.slug} leaks internal archetype name "${archetype}"`,
        ).toBe(false);
      }
    }
  });

  it("points every featured image at a file that actually exists", () => {
    for (const article of articles) {
      const filePath = path.join(process.cwd(), "public", article.featuredImage);
      expect(existsSync(filePath), `${article.slug} featuredImage missing: ${article.featuredImage}`).toBe(
        true,
      );
    }
  });

  it("gives every article a positive reading time", () => {
    for (const article of articles) {
      expect(article.readingTimeMinutes).toBeGreaterThan(0);
    }
  });
});
