import { expect, test } from "@playwright/test";

const productAdOrder = [
  "lipelle-product-ad", "icon-office-after-hours", "icon-product-benefit",
  "icon-comfort-work", "kub-stem-time", "kub-guilt-free-evenings",
  "kub-imagination", "kub-moms-chat", "kub-me-time",
  "chowking-offer", "pesto-pasta-ad", "fresh-vegetable-ad",
  "carrot-ad", "network-ad", "orange-perfume-a",
  "orange-perfume-b", "luxury-ring-a", "luxury-ring-b",
  "affogato-a", "affogato-b", "ovary-good-chocolate",
  "ovary-good-strawberry", "ovary-good-vanilla",
];

const commissionsOrder = [
  "home-crowd-1", "home-crowd-2", "home-crowd-3", "home-crowd-4", "home-crowd-5",
  "commission-email-1", "commission-email-2",
];

for (const variant of [
  { name: "Poster Design", tone: "ragas", count: 8, others: ["adidas", "desk", "bound"] },
  { name: "Product Ads", tone: "desk", count: 23, others: ["adidas", "ragas", "bound"] },
  { name: "Commissions", tone: "bound", count: 7, others: ["adidas", "desk", "ragas"] },
]) {
for (const width of [1440, 390]) {
  test(`${variant.name} displays all ${variant.count} images and reflows the other cards at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await page.getByRole("button", { name: `Expand ${variant.name} designs` }).click();
    const poster = page.locator(`.project-card--${variant.tone}`);
    const gallery = page.getByRole("region", { name: `${variant.name} designs` });
    await expect(gallery.getByRole("img")).toHaveCount(variant.count);
    await expect(poster.getByRole("button")).toHaveCount(1);
    await expect.poll(() => poster.evaluate((node) => getComputedStyle(node).transform)).toBe("none");
    for (const image of await gallery.getByRole("img").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((node) => (node as HTMLImageElement).complete && (node as HTMLImageElement).naturalWidth > 0)).toBe(true);
      const ratioDifference = await image.evaluate((node) => {
        const img = node as HTMLImageElement;
        return Math.abs(img.clientWidth / img.clientHeight - img.naturalWidth / img.naturalHeight);
      });
      expect(ratioDifference).toBeLessThan(0.01);
    }
    const expanded = (await poster.boundingBox())!;
    for (const caption of await gallery.locator("figcaption").all()) {
      await expect(caption).toBeHidden();
    }
    const columns = await gallery.locator("figure").evaluateAll((figures) => {
      const grouped: Record<string, { top: number; bottom: number }[]> = {};
      for (const figure of figures) {
        const rect = figure.getBoundingClientRect();
        (grouped[Math.round(rect.left)] ??= []).push({ top: rect.top, bottom: rect.bottom });
      }
      return Object.values(grouped).map((column) => column.sort((a, b) => a.top - b.top));
    });
    expect(columns).toHaveLength(width > 809 ? 3 : 1);
    if (variant.tone === "desk" || variant.tone === "bound") {
      const expectedOrder = variant.tone === "desk" ? productAdOrder : commissionsOrder;
      const imageColumns = await gallery.locator("img").evaluateAll((images) => {
        const grouped: Record<string, { top: number; src: string }[]> = {};
        for (const image of images) {
          const rect = image.getBoundingClientRect();
          const url = new URL(image.getAttribute("src")!, location.origin);
          const src = (url.searchParams.get("url") ?? url.pathname).split("/").pop()!.replace(/\.(png|jpg)$/, "");
          (grouped[Math.round(rect.left)] ??= []).push({ top: rect.top, src });
        }
        return Object.values(grouped).map((column) => column.sort((a, b) => a.top - b.top).map((image) => image.src));
      });
      for (const [index, column] of imageColumns.entries()) {
        expect(column).toEqual(width > 809 ? expectedOrder.filter((_, order) => order % 3 === index) : expectedOrder);
      }
    }
    for (const column of columns) {
      for (let index = 1; index < column.length; index++) {
        expect(column[index].top - column[index - 1].bottom).toBeCloseTo(12, 0);
      }
    }
    const grid = (await page.locator(".projects-grid").boundingBox())!;
    expect(expanded.width).toBeCloseTo(grid.width, 0);
    expect(expanded.y).toBeCloseTo(grid.y, 0);
    const remaining = await Promise.all(variant.others.map((tone) => page.locator(`.project-card--${tone}`).boundingBox()));
    for (const card of remaining) {
      expect(card!.y).toBeGreaterThanOrEqual(expanded.y + expanded.height);
      if (width > 809) {
        expect(card!.y).toBeCloseTo(remaining[0]!.y, 0);
        expect(card!.width).toBeCloseTo((grid.width - 20) / 3, 0);
      } else {
        expect(card!.width).toBeCloseTo(grid.width, 0);
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await gallery.getByRole("button", { name: "Collapse designs" }).click();
    await expect(gallery).toHaveCount(0);
    await expect(page.getByRole("button", { name: `Expand ${variant.name} designs` })).toBeFocused();
    await expect(page.locator("#projects article")).toHaveCount(4);
    expect(errors).toEqual([]);
  });
}
}

test("switching galleries keeps only one open and preserves keyboard focus", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Expand Brand Identity designs" }).click();
  await expect(page.getByRole("region", { name: "Brand Identity designs" })).toBeVisible();
  await page.getByRole("button", { name: "Expand Poster Design designs" }).click();
  await expect(page.getByRole("region", { name: "Brand Identity designs" })).toHaveCount(0);
  await expect(page.getByRole("region", { name: "Poster Design designs" }).getByRole("img")).toHaveCount(8);
  await expect(page.locator(".project-card--ragas")).toBeFocused();
  await page.getByRole("button", { name: "Expand Brand Identity designs" }).click();
  await expect(page.getByRole("region", { name: "Poster Design designs" })).toHaveCount(0);
  await expect(page.locator(".project-card--adidas")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Expand Brand Identity designs" })).toBeFocused();
  const posterToggle = page.getByRole("button", { name: "Expand Poster Design designs" });
  await posterToggle.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("region", { name: "Poster Design designs" })).toHaveCSS("opacity", "1");
  await page.keyboard.press("Escape");
  await expect(posterToggle).toBeFocused();
  await page.getByRole("button", { name: "Expand Product Ads designs" }).click();
  await expect(page.getByRole("region", { name: "Product Ads designs" }).getByRole("img")).toHaveCount(23);
  await expect(page.locator(".project-card--desk")).toBeFocused();
  await posterToggle.click();
  await expect(page.getByRole("region", { name: "Product Ads designs" })).toHaveCount(0);
  await expect(page.locator(".project-card--ragas")).toBeFocused();
  await page.getByRole("button", { name: "Expand Product Ads designs" }).click();
  await expect(page.getByRole("region", { name: "Poster Design designs" })).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Expand Product Ads designs" })).toBeFocused();
  await page.getByRole("button", { name: "Expand Commissions designs" }).click();
  await expect(page.getByRole("region", { name: "Commissions designs" }).getByRole("img")).toHaveCount(7);
  await expect(page.locator(".project-card--bound")).toBeFocused();
  await posterToggle.click();
  await expect(page.getByRole("region", { name: "Commissions designs" })).toHaveCount(0);
  await page.getByRole("button", { name: "Expand Commissions designs" }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Expand Commissions designs" })).toBeFocused();
});
