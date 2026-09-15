import { expect, test } from "@playwright/test";

for (const width of [390, 513, 1440]) {
  test(`carrot ad keeps its size and is centered only on mobile at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.setViewportSize({ width, height: 1121 });
    await page.goto("/");
    await page.getByRole("button", { name: "Expand Product Ads designs" }).click();
    const card = page.locator(".project-card--desk");
    await expect.poll(() => card.evaluate(node => getComputedStyle(node).transform)).toBe("none");
    const carrot = page.locator('#product-ads-gallery img[src*="carrot-ad"]');
    await carrot.scrollIntoViewIfNeeded();
    await carrot.evaluate(node => (node as HTMLImageElement).decode());
    const geometry = await carrot.evaluate(node => {
      const figure = node.closest("figure")!;
      const parent = figure.closest(innerWidth < 810 ? ".brand-gallery__boards" : ".brand-gallery__column")!;
      const box = node.getBoundingClientRect();
      const container = parent.getBoundingClientRect();
      // The previous start alignment is the baseline for unchanged image sizing.
      figure.style.alignSelf = "start";
      const baseline = node.getBoundingClientRect();
      figure.style.removeProperty("align-self");
      return { left: box.left - container.left, right: container.right - box.right,
        width: box.width, height: box.height, originalWidth: baseline.width, originalHeight: baseline.height };
    });
    expect(geometry.width).toBeCloseTo(geometry.originalWidth, 1);
    expect(geometry.height).toBeCloseTo(geometry.originalHeight, 1);
    if (width < 810) {
      expect(Math.abs(geometry.left - geometry.right)).toBeLessThan(1);
    } else {
      expect(Math.abs(geometry.left)).toBeLessThan(1);
    }
    expect(errors).toEqual([]);
  });
}
