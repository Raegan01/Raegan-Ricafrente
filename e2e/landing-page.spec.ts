import { expect, test } from "@playwright/test";

test("desktop layout keeps the editorial grid and menu overlay", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");
  await page.addStyleTag({
    content:
      ".discipline-list,.reveal{transform:none!important}.cursor-follower{display:none!important}",
  });

  const heroHeading = page.getByRole("heading", { level: 1 });
  await expect(heroHeading).toContainText("Design is my");
  const heroFontSize = await heroHeading.evaluate((node) =>
    Number.parseFloat(getComputedStyle(node).fontSize),
  );
  expect(heroFontSize).toBeGreaterThanOrEqual(90);

  const projects = page.locator("#projects");
  await expect(projects).toBeVisible();
  await expect(projects.locator("article")).toHaveCount(4);

  await expect(page).toHaveScreenshot("desktop-hero.png", {
    animations: "disabled",
  });

  await page.getByRole("button", { name: /open menu/i }).click();
  await expect(page.getByRole("dialog", { name: /site menu/i })).toHaveScreenshot(
    "desktop-menu.png",
    { animations: "disabled" },
  );
});

test("mobile layout has no document overflow and keeps bounded horizontal tracks", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.addStyleTag({
    content:
      ".discipline-list,.reveal{transform:none!important}.cursor-follower{display:none!important}",
  });

  const sizes = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(sizes.scroll).toBe(sizes.client);

  const aboutTop = await page
    .locator("#about")
    .evaluate((node) => node.getBoundingClientRect().top + window.scrollY);
  const projectsTop = await page
    .locator("#projects")
    .evaluate((node) => node.getBoundingClientRect().top + window.scrollY);
  expect(aboutTop).toBeLessThan(projectsTop);

  await expect(page).toHaveScreenshot("mobile-hero.png", {
    animations: "disabled",
  });

  const about = page.locator("#about");
  await about.scrollIntoViewIfNeeded();
  await expect(about).toHaveScreenshot("mobile-about.png", {
    animations: "disabled",
  });

  const projectSection = page.locator("#projects");
  await projectSection.scrollIntoViewIfNeeded();
  await expect(projectSection).toHaveScreenshot("mobile-projects.png", {
    animations: "disabled",
  });
});
