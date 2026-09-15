import { expect, test } from "@playwright/test";

for (const width of [390, 1440, 2534]) {
  test(`See them all shows an uncropped ordered masonry gallery at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.setViewportSize({ width, height: 1129 });
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "See them all" });
    await toggle.click();
    const gallery = page.getByRole("region", { name: "All project images" });
    const images = gallery.getByRole("img");
    await expect(images).toHaveCount(41);
    const columns = width < 810 ? 2 : 4;
    await expect.poll(async () => {
      const boxes = await images.evaluateAll(nodes => nodes.map(node => {
        const box = node.getBoundingClientRect();
        return { x: Math.round(box.x), y: box.y, width: box.width, height: box.height };
      }));
      return new Set(boxes.map(box => box.x)).size;
    }).toBe(columns);
    const boxes = await images.evaluateAll(nodes => nodes.map(node => {
      const image = node as HTMLImageElement;
      const box = image.getBoundingClientRect();
      return { x: box.x, y: box.y, bottom: box.bottom, width: box.width, height: box.height,
        ratio: Number(image.getAttribute("width")) / Number(image.getAttribute("height")) };
    }));
    for (let i = 0; i < boxes.length; i++) {
      expect(Math.abs(boxes[i].width / boxes[i].height - boxes[i].ratio)).toBeLessThan(0.01);
      if (i % columns > 0) expect(boxes[i].x).toBeGreaterThan(boxes[i - 1].x);
      if (i >= columns) {
        expect(Math.abs(boxes[i].x - boxes[i - columns].x)).toBeLessThan(1);
        expect(boxes[i].y - boxes[i - columns].bottom).toBeGreaterThanOrEqual(11);
        expect(boxes[i].y - boxes[i - columns].bottom).toBeLessThan(26);
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    // Scroll through every image to exercise lazy loading, including the final emails.
    for (let i = 0; i < 41; i++) {
      await images.nth(i).scrollIntoViewIfNeeded();
      await expect.poll(() => images.nth(i).evaluate(node => (node as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    }
    await page.getByRole("button", { name: "Back to projects" }).click();
    await expect(page.locator("#projects").getByRole("article")).toHaveCount(4);
    await expect(toggle).toBeFocused();
    await expect(toggle).toBeInViewport();
    await toggle.click();
    await expect(gallery).toBeVisible();
    expect(errors).toEqual([]);
  });
}
