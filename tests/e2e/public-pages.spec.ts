import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = [
  "/",
  "/reflection",
  "/parent-guide",
  "/inside-the-loop",
  "/work-with-us",
  "/about",
  "/articles",
  "/articles/rubbed-through-page-why-they-wont-try-again",
  "/privacy",
  "/terms",
  "/cookies",
  "/refund-policy",
];

for (const path of pages) {
  test(`${path} has no automatic accessibility violations`, async ({ page }) => {
    await page.goto(path);
    // Let mount-triggered reveal animations settle before scanning contrast.
    await page.waitForTimeout(1000);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });

  for (const width of [320, 375, 768, 1024, 1280, 1440]) {
    test(`${path} renders without horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(path);
      const hasOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      expect(hasOverflow).toBe(false);
    });
  }
}

test.describe("header navigation never wraps across the responsive matrix", () => {
  for (const width of [1024, 1152, 1280, 1440, 1920]) {
    test(`nav stays on one line at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 400 });
      await page.goto("/");
      const nav = page.locator("header nav[aria-label='Primary']");
      // Below xl (1280px) the desktop nav is hidden in favour of the mobile menu.
      if (width < 1280) {
        await expect(nav).toBeHidden();
        await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
      } else {
        const box = await nav.boundingBox();
        expect(box).not.toBeNull();
        // A single-line nav is ~20-24px tall; wrapping onto two lines roughly doubles it.
        expect(box!.height).toBeLessThan(30);
      }
    });
  }
});

test("Home routes its dominant CTA to the Reflection and never sells the Guide", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const reflectionLinks = page.locator('a[href="/reflection"]:visible');
  await expect(reflectionLinks.first()).toBeVisible();
  await expect(page.locator('a[href="/checkout/guide"]')).toHaveCount(0);
  await expect(page.getByText(/get the parent guide/i)).toHaveCount(0);
});

test("Inside the Loop CTA routes to the Parent Guide, not a direct checkout", async ({ page }) => {
  await page.goto("/inside-the-loop");
  await expect(page.getByRole("link", { name: "Start with the Parent Guide" })).toHaveAttribute(
    "href",
    "/parent-guide",
  );
});

test("Work With Us Closely has no direct Group/Reset checkout", async ({ page }) => {
  await page.goto("/work-with-us");
  await expect(page.locator('a[href="/checkout/guide"]')).toHaveCount(0);
  const pathwayButton = page.getByRole("button", { name: /book a pathway call/i });
  await expect(pathwayButton).toBeDisabled();
});

test("mobile menu opens and closes", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("link", { name: "The Reflection" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
});
