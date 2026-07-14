import { expect, test, type Page } from "@playwright/test";

async function stabilizeForScreenshot(page: Page) {
  await page.addStyleTag({
    content: [
      ".discipline-track{transform:none!important}",
      ".reveal{opacity:1!important;transform:none!important}",
      ".cursor-trail{display:none!important}",
      "*{scroll-behavior:auto!important}",
    ].join(""),
  });
}

test("recording desktop keeps fixed controls over a pinned hero transition", async ({ page }) => {
  const viewport = { width: 2542, height: 1261 };
  await page.setViewportSize(viewport);
  await page.goto("/");

  await expect(page.locator(".site-header")).toHaveCSS("position", "fixed");
  await expect(page.locator(".site-header__availability")).toBeVisible();

  const gridBox = await page.locator(".hero__grid").boundingBox();
  const availabilityBox = await page
    .locator(".site-header__availability")
    .boundingBox();
  expect(gridBox).not.toBeNull();
  expect(availabilityBox).not.toBeNull();
  expect(availabilityBox!.x + availabilityBox!.width).toBeCloseTo(
    gridBox!.x + gridBox!.width,
    0,
  );

  const title = page.locator("#hero-title");
  const projects = page.locator("#projects");
  const titleStart = await title.boundingBox();
  const projectsStart = await projects.boundingBox();

  expect(projectsStart!.y).toBeCloseTo(viewport.height, 0);

  const earlyScroll = Math.round(viewport.height * 0.25);
  await page.evaluate((top) => window.scrollTo(0, top), earlyScroll);
  await page.waitForFunction((top) => window.scrollY === top, earlyScroll);
  const titleEarly = await title.boundingBox();
  const projectsEarly = await projects.boundingBox();

  expect(Math.abs(titleEarly!.y - titleStart!.y)).toBeLessThan(1);
  expect(projectsEarly!.y).toBeLessThan(viewport.height);
  expect(projectsStart!.y - projectsEarly!.y).toBeCloseTo(earlyScroll, 0);

  const deepScroll = Math.round(viewport.height * 0.75);
  await page.evaluate((top) => window.scrollTo(0, top), deepScroll);
  await page.waitForFunction((top) => window.scrollY === top, deepScroll);
  const titleDeep = await title.boundingBox();
  const projectsDeep = await projects.boundingBox();

  expect(Math.abs(titleDeep!.y - titleStart!.y)).toBeLessThan(1);
  expect(projectsDeep!.y).toBeLessThan(viewport.height * 0.3);
  await expect(page.locator("html")).toHaveCSS("cursor", "none");
});

test("reference desktop geometry uses the centered editorial grid", async ({ page }) => {
  const viewport = { width: 2542, height: 1261 };
  await page.setViewportSize(viewport);
  await page.goto("/");
  await stabilizeForScreenshot(page);

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
  await stabilizeForScreenshot(page);

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

test("four-project geometry uses a narrow equal-card grid", async ({ page }) => {
  await page.setViewportSize({ width: 2542, height: 1261 });
  await page.goto("/");

  const canvas = page.locator(".projects-section__canvas");
  const cards = page.locator("#projects article");
  await expect(cards).toHaveCount(4);
  const canvasBox = await canvas.boundingBox();
  expect(canvasBox!.width).toBeCloseTo(1100, 0);
  const boxes = await cards.evaluateAll((nodes) =>
    nodes.map((node) => node.getBoundingClientRect()),
  );
  expect(boxes[0].width).toBeCloseTo(boxes[1].width, 0);
  expect(boxes[0].height).toBeCloseTo(boxes[1].height, 0);
  expect(boxes[0].width / boxes[0].height).toBeCloseTo(1.2, 1);
  expect(Math.abs(boxes[0].top - boxes[1].top)).toBeLessThan(1);
  expect(boxes[2].top).toBeGreaterThan(boxes[0].bottom);
});

test("mobile layout has no document overflow and keeps bounded horizontal tracks", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await stabilizeForScreenshot(page);

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
  const cards = page.locator("#projects article");
  await expect(cards).toHaveCount(4);

  const columns = await page.locator(".projects-grid").evaluate(
    (node) => getComputedStyle(node).gridTemplateColumns,
  );
  expect(columns.trim().split(/\s+/)).toHaveLength(1);
  const firstCardBox = await cards.first().boundingBox();
  expect(firstCardBox!.width / firstCardBox!.height).toBeCloseTo(1.05, 1);

  await expect(page).toHaveScreenshot("target-mobile-hero.png", {
    animations: "disabled",
  });

  const about = page.locator("#about");
  await about.scrollIntoViewIfNeeded();
  await expect(about).toHaveScreenshot("target-mobile-about.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0.02,
  });
});

test("target desktop scroll states", async ({ page }) => {
  const viewport = { width: 2542, height: 1261 };
  await page.setViewportSize(viewport);
  await page.goto("/");
  await stabilizeForScreenshot(page);

  await page.evaluate(() => window.scrollTo(0, 0));
  const heroScreenshot = await page.screenshot({ animations: "disabled" });
  await expect(page).toHaveScreenshot("target-desktop-hero.png", {
    animations: "disabled",
  });

  await page.evaluate(() => window.scrollTo(0, 180));
  await page.waitForFunction(() => window.scrollY === 180);
  const projectsBox = await page.locator("#projects").boundingBox();
  expect(projectsBox).not.toBeNull();
  expect(projectsBox!.y).toBeLessThan(viewport.height);
  const overlapScreenshot = await page.screenshot({
    animations: "disabled",
  });
  expect(overlapScreenshot.equals(heroScreenshot)).toBe(false);
  await expect(page).toHaveScreenshot("target-desktop-overlap.png", {
    animations: "disabled",
  });

  const projectsTop = await page.locator("#projects").evaluate((node) => {
    const rect = node.getBoundingClientRect();
    return rect.top + window.scrollY;
  });
  await page.evaluate((top) => window.scrollTo(0, top), projectsTop);
  await page.waitForFunction((top) => window.scrollY === top, projectsTop);
  await expect(page.locator("#projects")).toHaveScreenshot(
    "target-desktop-project-grid.png",
    { animations: "disabled" },
  );

  await page.locator("#about").scrollIntoViewIfNeeded();
  await expect(page.locator("#about")).toHaveScreenshot(
    "target-desktop-about.png",
    { animations: "disabled" },
  );

  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(page.locator("#contact")).toHaveScreenshot(
    "target-desktop-footer.png",
    { animations: "disabled" },
  );
});

test("reduced motion disables continuous landing-page motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".cursor-trail")).toHaveCSS("display", "none");
  await expect(page.locator("html")).not.toHaveClass(/cursor-trail-active/);
  await expect(page.locator("html")).toHaveCSS("cursor", "auto");
  await expect(page.locator(".discipline-track")).toHaveCSS("transform", "none");
});

test("fine input keeps the custom cursor above the open menu", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/cursor-trail-active/);
  await expect(page.locator("html")).toHaveCSS("cursor", "none");

  await page.getByRole("button", { name: /open menu/i }).click();
  await page.mouse.move(640, 360);

  const menu = page.getByRole("dialog", { name: /site menu/i });
  const cursor = page.locator(".cursor-trail");
  const leadingSegment = cursor.locator('[data-segment-index="0"]');
  await expect(menu).toBeVisible();
  await expect(cursor).toBeVisible();
  await expect(leadingSegment).toBeVisible();
  await expect
    .poll(async () => (await leadingSegment.boundingBox())?.x ?? -1)
    .toBeGreaterThan(600);
  const [menuZIndex, cursorZIndex] = await Promise.all([
    menu.evaluate((node) => Number.parseInt(getComputedStyle(node).zIndex, 10)),
    cursor.evaluate((node) => Number.parseInt(getComputedStyle(node).zIndex, 10)),
  ]);
  expect(cursorZIndex).toBeGreaterThan(menuZIndex);
});

test("wide touch input keeps the hero in normal flow", async ({
  baseURL,
  browser,
}) => {
  const context = await browser.newContext({
    baseURL,
    hasTouch: true,
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();

  try {
    await page.goto("/");
    expect(
      await page.evaluate(() => matchMedia("(pointer: coarse)").matches),
    ).toBe(true);
    await expect(page.locator(".hero")).toHaveCSS("position", "relative");
    await expect(page.locator(".landing-flow")).toHaveCSS("margin-top", "0px");
    const heroBottom = await page.locator(".hero-stage").evaluate((node) => {
      const rect = node.getBoundingClientRect();
      return rect.top + window.scrollY + rect.height;
    });
    const projectsTop = await page.locator("#projects").evaluate((node) => {
      const rect = node.getBoundingClientRect();
      return rect.top + window.scrollY;
    });
    expect(projectsTop).toBeCloseTo(heroBottom, 0);
    await expect(page.locator("html")).not.toHaveClass(/cursor-trail-active/);
    await expect(page.locator("html")).toHaveCSS("cursor", "auto");
  } finally {
    await context.close();
  }
});

test("landing controls do not expose internal routes", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('a[href^="/"]')).toHaveCount(0);
  await expect(page.locator("#projects article")).toHaveCount(4);
});
