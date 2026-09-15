import { expect, test } from "@playwright/test";

for (const width of [390, 1440, 2535]) {
  for (const source of ["menu", "footer"]) {
    test(`${source} About aligns the divider without an empty header gap at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const about = page.locator("#about");
      for (let repeat = 0; repeat < 2; repeat++) {
        if (source === "menu") {
          // Start from Home so the desktop header is visible.
          await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
          await page.getByRole("button", { name: "Open menu" }).click();
          await page.getByRole("dialog").getByRole("link", { name: "About", exact: true }).click();
          await expect(page.getByRole("dialog")).toHaveCount(0);
        } else {
          await page.locator(".site-footer").getByRole("link", { name: "About", exact: true }).click();
        }
        const target = width < 810 ? await page.locator(".site-header").evaluate(node => node.getBoundingClientRect().bottom) : 0;
        await expect.poll(async () => Math.abs((await about.boundingBox())!.y - target)).toBeLessThan(2);
      }
    });
  }
}
