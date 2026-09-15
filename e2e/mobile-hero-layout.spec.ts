import { expect, test } from "@playwright/test";

for (const width of [297, 390, 430]) {
  test(`mobile availability sits under MENU inside the sticky header at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 849 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    for (const selector of ["#home", "#projects"]) {
      await page.locator(selector).evaluate((node) => {
        window.scrollTo({ top: node.getBoundingClientRect().top + window.scrollY, behavior: "instant" });
      });
      const header = (await page.locator(".site-header").boundingBox())!;
      const menu = (await page.getByRole("button", { name: "Open menu" }).boundingBox())!;
      const availability = (await page.locator(".site-header__availability").boundingBox())!;
      expect(availability.y).toBeGreaterThanOrEqual(menu.y + menu.height);
      expect(availability.y + availability.height).toBeLessThanOrEqual(header.y + header.height - 4);
      expect(availability.x + availability.width).toBeCloseTo(menu.x + menu.width, 0);
      await expect(page.locator(".site-header__availability")).toBeInViewport();
    }
  });

  test(`mobile hero follows the compact reference composition at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 849 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const scale = width / 390;
    const guide = page.locator(".hero__grid");
    await expect(guide).toBeVisible();
    const box = await guide.boundingBox();
    expect(box!.y).toBeCloseTo(91 * scale, 0);
    const hero = await page.locator(".hero-stage").boundingBox();
    expect(box!.y + box!.height).toBeCloseTo(hero!.height, 0);
    const headline = await page.locator(".hero__main").boundingBox();
    expect(headline!.y).toBeCloseTo(365 * scale, 0);
    expect(headline!.x).toBeCloseTo(35 * scale, 0);
    await expect.poll(async () => (await page.locator(".hero__support").boundingBox())!.y).toBeCloseTo(504 * scale, 0);
    const support = await page.locator(".hero__support").boundingBox();
    expect(support!.y).toBeGreaterThan(headline!.y + headline!.height);
    expect(support!.y).toBeCloseTo(504 * scale, 0);
    const role = await page.locator(".hero__role").boundingBox();
    expect(role!.y).toBeCloseTo(618 * scale, 0);
    const ticker = await page.locator(".discipline-ticker").boundingBox();
    expect(ticker!.y).toBeCloseTo(668 * scale, 0);
    expect(ticker!.width).toBe(width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    await expect(page.getByRole("link", { name: "Raegan Ricafrente — Home" })).toBeVisible();
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });
}
