import { expect, test } from "@playwright/test";

for (const width of [298, 390]) {
  test(`mobile footer follows the reference hierarchy at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const footer = page.locator(".site-footer");
    await footer.scrollIntoViewIfNeeded();
    await expect(footer.locator(".site-footer__email")).toBeVisible();
    await expect(footer.locator(".site-footer__email")).toHaveAttribute("href", "mailto:rae.ricafrente01@gmail.com");
    await expect(footer.locator("h2")).toHaveCSS("border-bottom-width", "0px");
    expect(await footer.locator("h2").evaluate(element => {
      const style = getComputedStyle(element);
      return Math.round((element.getBoundingClientRect().height - parseFloat(style.paddingBottom) - parseFloat(style.borderBottomWidth)) / parseFloat(style.lineHeight));
    })).toBe(2);
    const geometry = await footer.evaluate(element => {
      const rect = (selector: string) => {
        const r = element.querySelector(selector)!.getBoundingClientRect();
        return { x: r.x, y: r.y, right: r.right, bottom: r.bottom, width: r.width };
      };
      return { title: rect("h2"), email: rect(".site-footer__email"), button: rect(".site-footer__aside > .button"), socials: rect(".social-list"), nav: rect("nav"), mark: rect(".site-footer__mark"), copyright: rect("small") };
    });
    expect(geometry.title.x).toBeCloseTo(width * 14 / 298, 0);
    expect(geometry.email.x).toBeCloseTo(geometry.title.x, 0);
    expect(geometry.email.y).toBeGreaterThan(geometry.title.bottom);
    expect(geometry.button.y).toBeGreaterThan(geometry.email.bottom);
    expect(geometry.button.right).toBeCloseTo(width - geometry.title.x, 0);
    expect(geometry.socials.y).toBeGreaterThan(geometry.button.bottom);
    expect(geometry.nav.y).toBeGreaterThan(geometry.socials.bottom);
    expect(geometry.nav.x).toBeCloseTo(geometry.title.x, 0);
    expect(geometry.mark.y).toBeGreaterThan(geometry.nav.y);
    expect(geometry.mark.bottom).toBeLessThanOrEqual(geometry.copyright.y + 1);
    await expect(footer.getByRole("navigation").getByRole("link")).toHaveText(["Home", "Projects", "About", "Contact"]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    await footer.getByRole("button", { name: "Contact Me", exact: true }).click();
    await expect(page.locator("#contact-inquiry")).toBeVisible();
  });
}
