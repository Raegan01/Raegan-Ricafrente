import { expect, test } from "@playwright/test";

for (const width of [1440, 390]) {
  test(`Brand Identity expands inline and restores the grid at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const toggle = page.getByRole("button", { name: /^(Expand|Collapse) Brand Identity designs$/ });
    const brand = page.locator(".project-card--adidas");
    await toggle.scrollIntoViewIfNeeded();
    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(toggle).toHaveCount(0);
    await expect(brand.getByRole("button")).toHaveCount(1);
    const gallery = page.getByRole("region", { name: "Brand Identity designs" });
    await expect(gallery.getByRole("img")).toHaveCount(3);
    await expect.poll(async () => gallery.evaluate((node) => getComputedStyle(node).opacity)).toBe("1");
    await expect.poll(async () => gallery.locator("img").evaluateAll((images) => images.every((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
    for (const image of await gallery.locator("img").all()) {
      const dimensions = await image.evaluate((node) => {
        const image = node as HTMLImageElement;
        return { rendered: image.clientWidth / image.clientHeight, original: Number(image.getAttribute("width")) / Number(image.getAttribute("height")) };
      });
      expect(Math.abs(dimensions.rendered - dimensions.original)).toBeLessThan(0.01);
    }
    const rect = await brand.boundingBox();
    const grid = await page.locator(".projects-grid").boundingBox();
    expect(rect!.width).toBeCloseTo(grid!.width, 0);
    for (const tone of ["desk", "ragas", "bound"]) {
      const other = await page.locator(`.project-card--${tone}`).boundingBox();
      expect(other!.y).toBeGreaterThanOrEqual(rect!.y + rect!.height);
    }
    if (width > 809) {
      const cards = await Promise.all(["desk", "ragas", "bound"].map((tone) =>
        page.locator(`.project-card--${tone}`).boundingBox(),
      ));
      for (const [index, card] of cards.entries()) {
        expect(card!.y).toBeCloseTo(cards[0]!.y, 0);
        expect(card!.width).toBeCloseTo((grid!.width - 20) / 3, 0);
        if (index > 0) expect(card!.x).toBeGreaterThan(cards[index - 1]!.x);
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await brand.screenshot({ path: test.info().outputPath(`expanded-${width}.png`) });
    await gallery.getByRole("button", { name: "Collapse designs" }).click();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(gallery).toHaveCount(0);
    await expect(toggle).toBeFocused();
    await expect(page.locator("#projects article")).toHaveCount(4);
    if (width > 809) {
      await expect.poll(async () => {
        const first = await brand.boundingBox();
        const second = await page.locator(".project-card--desk").boundingBox();
        return Math.abs(first!.y - second!.y);
      }).toBeLessThan(0.5);
    }
    await page.keyboard.press("Space");
    await expect(gallery).toHaveCount(1);
    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
}

test("Brand Identity respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Expand Brand Identity designs" }).click();
  const gallery = page.getByRole("region", { name: "Brand Identity designs" });
  await expect(gallery).toBeVisible();
  await expect(gallery).toHaveCSS("opacity", "1");
  await page.getByRole("button", { name: "Collapse designs" }).click();
  await expect(gallery).toHaveCount(0);
});

test("Brand Identity animates card geometry rather than jumping to the expanded grid", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const brand = page.locator(".project-card--adidas");
  const sibling = page.locator(".project-card--desk");
  const toggle = page.getByRole("button", { name: "Expand Brand Identity designs" });
  await toggle.scrollIntoViewIfNeeded();
  await toggle.focus();
  const before = await brand.boundingBox();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(150);
  const during = await brand.boundingBox();
  const siblingDuring = await sibling.boundingBox();
  await expect.poll(async () => brand.evaluate((node) => getComputedStyle(node).transform)).toBe("none");
  const after = await brand.boundingBox();
  const siblingAfter = await sibling.boundingBox();
  expect(during!.width).toBeGreaterThan(before!.width + 10);
  expect(during!.width).toBeLessThan(after!.width - 10);
  expect(siblingDuring!.y).toBeLessThan(siblingAfter!.y - 10);
  await page.getByRole("button", { name: "Collapse designs" }).click();
  await expect(page.getByRole("button", { name: "Expand Brand Identity designs" })).toHaveAttribute("aria-expanded", "false");
});
