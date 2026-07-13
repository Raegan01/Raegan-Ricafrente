import { expect, test } from "@playwright/test";

test("recording desktop keeps fixed controls over a normal-flow hero", async ({ page }) => {
  await page.setViewportSize({ width: 2542, height: 1261 });
  await page.goto("/");

  await expect(page.locator(".site-header")).toHaveCSS("position", "fixed");
  await expect(page.locator(".site-header__availability")).toBeVisible();
  await expect(page.locator(".hero")).toHaveCSS("position", "relative");

  const heroBox = await page.locator(".hero-stage").boundingBox();
  const projectsTop = await page.locator("#projects").evaluate(
    (node) => node.getBoundingClientRect().top + window.scrollY,
  );
  expect(heroBox).not.toBeNull();
  expect(heroBox!.height).toBeCloseTo(1261, 1);
  expect(projectsTop).toBeCloseTo(heroBox!.height, 1);
});

test("reference desktop geometry uses the centered editorial grid", async ({ page }) => {
  const viewport = { width: 2542, height: 1261 };
  await page.setViewportSize(viewport);
  await page.goto("/");
  await page.addStyleTag({
    content:
      ".discipline-list,.reveal{transform:none!important}.cursor-follower{display:none!important}",
  });

  const grid = page.locator(".hero__grid");
  await expect(grid).toBeVisible();
  const gridBox = await grid.boundingBox();
  expect(gridBox).not.toBeNull();
  expect(gridBox!.width).toBeCloseTo(1320, 0);
  expect(gridBox!.x).toBeCloseTo((viewport.width - gridBox!.width) / 2 + 2, 0);
  expect(gridBox!.y).toBeCloseTo(110, 0);
  expect(gridBox!.height).toBeCloseTo(viewport.height - 150, 0);

  const titleLines = page.locator(".hero__title-line");
  await expect(titleLines).toHaveCount(3);
  await expect(titleLines).toHaveText(["Design is my", "favorite way to", "overthink"]);

  const brandBox = await page.locator(".site-header__brand").boundingBox();
  const supportBox = await page.locator(".hero__support").boundingBox();
  const roleBox = await page.locator(".hero__role").boundingBox();
  const tickerBox = await page.locator(".discipline-ticker").boundingBox();

  expect(brandBox!.x).toBeCloseTo(gridBox!.x, 0);
  expect(roleBox!.x).toBeCloseTo(gridBox!.x, 0);
  expect(supportBox!.x).toBeCloseTo(gridBox!.x + gridBox!.width / 4, 0);
  expect(tickerBox!.x).toBeCloseTo(gridBox!.x + gridBox!.width / 4, 0);

  await expect(page).toHaveScreenshot("reference-desktop-hero.png", {
    animations: "disabled",
  });
});

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
  await expect(projects.locator("article")).toHaveCount(3);

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
  expect(projectsTop).toBeLessThan(aboutTop);
  await expect(page.locator("#projects article")).toHaveCount(3);

  const featureDisplay = await page.locator(".project-card--feature").evaluate(
    (node) => getComputedStyle(node).display,
  );
  expect(featureDisplay).toBe("flex");

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
