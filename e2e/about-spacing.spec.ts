import { expect, test } from "@playwright/test";

for (const width of [298, 390, 430]) {
  test(`mobile Projects matches About padding at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const spacing = await page.evaluate(() => {
      const about = getComputedStyle(document.querySelector(".about-section")!);
      const projects = getComputedStyle(document.querySelector(".projects-section")!);
      const heading = getComputedStyle(document.querySelector(".projects-section .section-heading-row")!);
      return { aboutTop: about.paddingTop, aboutBottom: about.paddingBottom, top: projects.paddingTop, bottom: projects.paddingBottom, extraTop: heading.paddingTop };
    });
    expect(spacing.top).toBe(spacing.aboutTop);
    expect(spacing.bottom).toBe(spacing.aboutBottom);
    expect(spacing.extraTop).toBe("0px");
  });

  test(`mobile About has doubled spacing at both edges at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const spacing = await page.evaluate(() => {
      const about = getComputedStyle(document.querySelector(".about-section")!);
      const footer = getComputedStyle(document.querySelector(".site-footer__grid")!);
      const cta = getComputedStyle(document.querySelector(".about-section .cta-prelude")!);
      return { top: parseFloat(about.paddingTop), bottom: parseFloat(about.paddingBottom), footer: parseFloat(footer.paddingTop), extraBottom: parseFloat(cta.paddingBottom) };
    });
    expect(spacing.top).toBeCloseTo((spacing.footer + 13.1) * 2, 2);
    expect(spacing.bottom).toBeCloseTo((spacing.footer + 13.1) * 2, 2);
    expect(spacing.extraBottom).toBe(0);
    await page.getByRole("button", { name: "Say Hello!" }).click();
    await expect(page.locator("#contact-inquiry")).toBeVisible();
  });
}

test("desktop About retains its existing spacing", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator(".about-section")).toHaveCSS("padding-top", "40px");
  await expect(page.locator(".about-section .cta-prelude")).toHaveCSS("padding-bottom", "40px");
  await expect(page.locator(".projects-section")).toHaveCSS("padding-bottom", "128px");
  await expect(page.locator(".projects-section .section-heading-row")).toHaveCSS("padding-top", "76px");
});
