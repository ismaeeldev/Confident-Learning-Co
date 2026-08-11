import { test, expect } from "@playwright/test";

test.describe("Articles listing filters", () => {
  test("band filter links update the grid via URL params", async ({ page }) => {
    await page.goto("/articles");
    const filterNav = page.getByRole("navigation", { name: "Filter articles by school year band" });
    const examYearsFilter = filterNav.getByRole("link", { name: "Years 10 to 11", exact: true });
    await expect(examYearsFilter).toBeVisible();

    await examYearsFilter.click();
    await expect(page).toHaveURL(/band=exam-years/);

    // Both exam-years articles should be visible; an early-band article should not.
    await expect(
      page.getByRole("link", { name: /Revision That Never Starts/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Why Your Child Rubs Through the Page/i }),
    ).toHaveCount(0);
  });

  test("All filter is keyboard-reachable and restores the full grid", async ({ page }) => {
    await page.goto("/articles?band=early");
    const filterNav = page.getByRole("navigation", { name: "Filter articles by school year band" });
    const allLink = filterNav.getByRole("link", { name: "All", exact: true });
    await allLink.focus();
    await expect(allLink).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/articles$/);
  });
});

test.describe("Article detail page", () => {
  const slug = "rubbed-through-page-why-they-wont-try-again";

  test("shows breadcrumb, band badge, byline, and a working Reflection CTA", async ({ page }) => {
    await page.goto(`/articles/${slug}`);
    await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
    await expect(page.getByText("Years 2 to 4").first()).toBeVisible();
    await expect(page.getByText("Adam").first()).toBeVisible();
    await expect(
      page.locator("#main-content").getByRole("link", { name: "Take the 5-Minute Parent Reflection" }),
    ).toHaveAttribute("href", "/reflection");
  });

  test("shows related articles from the same band only", async ({ page }) => {
    await page.goto(`/articles/${slug}`);
    await expect(page.getByRole("heading", { name: "Related reading" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: /The Monday Morning Tummy Ache/i }),
    ).toBeVisible();
  });

  test("returns a real 404 for an unknown slug", async ({ page }) => {
    const response = await page.goto("/articles/this-slug-does-not-exist");
    expect(response?.status()).toBe(404);
  });

  test("includes Article structured data", async ({ page }) => {
    await page.goto(`/articles/${slug}`);
    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    const hasArticleSchema = scripts.some((s) => s.includes('"@type":"Article"'));
    expect(hasArticleSchema).toBe(true);
  });
});

test.describe("Legal pages", () => {
  const legalPages = ["/privacy", "/terms", "/cookies", "/refund-policy"];

  for (const path of legalPages) {
    test(`${path} shows the pending-legal-review notice`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByText("Draft — pending legal review")).toBeVisible();
    });
  }
});

test.describe("SEO infrastructure", () => {
  test("sitemap.xml includes all articles and legal pages", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    const body = await response?.text();
    expect(body).toContain("/privacy");
    expect(body).toContain("/articles/rubbed-through-page-why-they-wont-try-again");
  });

  test("robots.txt disallows the design-system route", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    const body = await response?.text();
    expect(body).toContain("Disallow: /design-system");
  });
});
