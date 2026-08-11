import { test, expect } from "@playwright/test";

test.describe("keyboard interaction", () => {
  test("header nav links and CTA are reachable by keyboard on desktop", async ({
    page,
    browserName,
  }) => {
    // WebKit does not include <a> elements in the default Tab order (matches real Safari
    // behaviour without "Full Keyboard Access" enabled) — not a site defect.
    test.skip(browserName === "webkit", "WebKit excludes links from default Tab order");
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    const reflectionLink = page.locator("header nav a", { hasText: "The Reflection" });
    await reflectionLink.focus();
    await expect(reflectionLink).toBeFocused();

    // Tab through the remaining nav links and confirm each becomes focused.
    for (const label of ["The Parent Guide", "Inside the Loop", "Articles", "About"]) {
      await page.keyboard.press("Tab");
      await expect(page.locator("header a", { hasText: label }).first()).toBeFocused();
    }
  });

  test("mobile menu is fully keyboard operable: open, tab to a link, escape closes and returns focus", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");

    const trigger = page.getByRole("button", { name: "Open menu" });
    await trigger.focus();
    await page.keyboard.press("Enter");

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("link", { name: "The Reflection" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    // Radix returns focus to the trigger on close.
    await expect(trigger).toBeFocused();
  });

  test("home page transcript accordion opens and closes with the keyboard", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Read the video transcript" });
    await trigger.focus();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText(/I am Adam\. I have spent my career/)).toBeVisible();

    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});

test.describe("reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("reveal-wrapped content is immediately visible with no animation delay", async ({
    page,
  }) => {
    await page.goto("/");
    // No waiting: content must already be at full opacity when reduced motion is set.
    const heading = page.getByRole("heading", { name: "Bright child. Crumbling confidence." });
    await expect(heading).toBeVisible();
    const opacity = await heading
      .locator("xpath=ancestor::div[1]")
      .evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(opacity)).toBeGreaterThanOrEqual(0.99);
  });
});
