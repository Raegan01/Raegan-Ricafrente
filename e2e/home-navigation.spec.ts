import { expect, test } from "@playwright/test";

for (const width of [1440, 390]) {
  test(`footer Home returns to the hero at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page).toHaveTitle("Raegan Ricafrente — Communication Designer");

    const home = page.getByRole("navigation", { name: "Footer", exact: true })
      .getByRole("link", { name: "Home", exact: true });

    // Repeat with the same hash to cover returning Home more than once.
    for (let visit = 0; visit < 2; visit++) {
      await home.scrollIntoViewIfNeeded();
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(900);
      await home.click();
      await expect(page).toHaveURL(/#home$/);
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(2);
      await expect(page.locator("#hero-title")).toBeInViewport();
    }
  });
}
