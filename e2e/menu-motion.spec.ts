import { expect, test } from "@playwright/test";

for (const width of [390, 1440]) {
  test(`menu staggers its links and animates closing at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.waitForFunction(() => document.querySelector<HTMLElement>(".site-header")!.style.getPropertyValue("--header-push-offset") !== "");
    const staggered = await page.evaluate(async () => {
      document.querySelector<HTMLButtonElement>(".site-header__menu-button")!.click();
      const start = performance.now();
      while (performance.now() - start < 900) {
        await new Promise(requestAnimationFrame);
        const links = document.querySelectorAll(".menu-overlay__nav a");
        if (links.length > 1 && Number(getComputedStyle(links[0]).opacity) > Number(getComputedStyle(links[links.length - 1]).opacity) + 0.1) return true;
      }
      return false;
    });
    expect(staggered).toBe(true);
    const dialog = page.getByRole("dialog");
    await expect(dialog).toHaveCSS("opacity", "1");
    await expect(dialog.getByRole("link", { name: "Contact", exact: true })).toHaveCSS("opacity", "1");
    const closing = await page.evaluate(async () => {
      document.querySelector<HTMLButtonElement>(".menu-overlay__close")!.click();
      const start = performance.now();
      while (performance.now() - start < 700) {
        await new Promise(requestAnimationFrame);
        const panel = document.querySelector(".menu-overlay");
        if (!panel) return false;
        const opacity = Number(getComputedStyle(panel).opacity);
        if (opacity > 0 && opacity < 0.95) return document.body.style.overflow === "hidden";
      }
      return false;
    });
    expect(closing).toBe(true);
    await expect(dialog).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  });
}

test("menu can close during opening and reopen with its focus trap intact", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open menu" });
  const dialog = page.getByRole("dialog");
  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(dialog).toHaveCount(1);
  const first = dialog.locator("a").first();
  const last = dialog.getByRole("link", { name: "LinkedIn" });
  await last.focus();
  await page.keyboard.press("Tab");
  await expect(first).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(last).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("reduced-motion menu appears without sliding or stagger", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const dialog = page.getByRole("dialog");
  const state = await dialog.evaluate(panel => ({
    opacity: getComputedStyle(panel).opacity,
    transform: getComputedStyle(panel).transform,
    links: Array.from(panel.querySelectorAll("nav a"), link => getComputedStyle(link).opacity),
  }));
  expect(state).toEqual({ opacity: "1", transform: "none", links: ["1", "1", "1", "1"] });
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
});
