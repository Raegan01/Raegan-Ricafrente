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
  await expect(page).toHaveTitle("Raegan Ricafrente — Communication Designer");

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

test("Projects divider pushes the header upward after contact and restores it on reverse scroll", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const header = page.locator(".site-header");
  const projects = page.locator("#projects");
  const headerHeight = await header.evaluate(
    (node) => node.getBoundingClientRect().height,
  );
  const projectsTop = await projects.evaluate((node) => {
    const rect = node.getBoundingClientRect();
    return rect.top + window.scrollY;
  });

  await page.evaluate(
    (top) => window.scrollTo(0, top),
    projectsTop - headerHeight - 1,
  );
  await expect(header).toHaveAttribute("data-projects-stuck", "false");

  await page.evaluate(
    (top) => window.scrollTo(0, top),
    projectsTop - headerHeight,
  );
  await expect(header).toHaveAttribute("data-projects-stuck", "true");
  await expect(header).toHaveCSS("background-color", "rgb(255, 255, 255)");

  const pushDistance = 64;
  await page.evaluate(
    (top) => window.scrollTo(0, top),
    projectsTop - headerHeight + pushDistance,
  );
  await expect
    .poll(async () => (await header.boundingBox())?.y ?? 1)
    .toBeCloseTo(-pushDistance, 0);
  await expect
    .poll(async () => {
      const headerBox = await header.boundingBox();
      const projectsBox = await projects.boundingBox();
      return (headerBox?.y ?? 0) + (headerBox?.height ?? 0) - (projectsBox?.y ?? 0);
    })
    .toBeCloseTo(0, 0);

  await page.evaluate(
    (top) => window.scrollTo(0, top),
    projectsTop + headerHeight + 50,
  );
  await expect
    .poll(async () => (await header.boundingBox())?.y ?? 1)
    .toBeCloseTo(-headerHeight, 0);
  await expect(header).toHaveAttribute("data-projects-stuck", "true");

  const reverseDistance = 32;
  await page.evaluate(
    (top) => window.scrollTo(0, top),
    projectsTop - headerHeight + reverseDistance,
  );
  await expect
    .poll(async () => (await header.boundingBox())?.y ?? 1)
    .toBeCloseTo(-reverseDistance, 0);
  await expect
    .poll(async () => {
      const headerBox = await header.boundingBox();
      const projectsBox = await projects.boundingBox();
      return (headerBox?.y ?? 0) + (headerBox?.height ?? 0) - (projectsBox?.y ?? 0);
    })
    .toBeCloseTo(0, 0);

  await page.evaluate(
    (top) => window.scrollTo(0, top),
    projectsTop - headerHeight - 1,
  );
  await expect
    .poll(async () => (await header.boundingBox())?.y ?? 1)
    .toBeCloseTo(0, 0);
  await expect(header).toHaveAttribute("data-projects-stuck", "false");
});

test("mobile Projects divider pushes and restores the header at the contact boundary", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const header = page.locator(".site-header");
  const projects = page.locator("#projects");
  const headerHeight = await header.evaluate(
    (node) => node.getBoundingClientRect().height,
  );
  const projectsTop = await projects.evaluate((node) => {
    const rect = node.getBoundingClientRect();
    return rect.top + window.scrollY;
  });

  await page.evaluate(
    (top) => window.scrollTo(0, top),
    projectsTop - headerHeight - 1,
  );
  await expect(header).toHaveAttribute("data-projects-stuck", "false");
  await expect(header).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(header).toHaveCSS("border-bottom-color", "rgba(0, 0, 0, 0)");

  await page.evaluate(
    (top) => window.scrollTo(0, top),
    projectsTop - headerHeight,
  );

  await expect(header).toHaveAttribute("data-projects-stuck", "true");
  await expect(header).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(header).not.toHaveCSS(
    "border-bottom-color",
    "rgba(0, 0, 0, 0)",
  );

  const pushDistance = 40;
  await page.evaluate(
    (top) => window.scrollTo(0, top),
    projectsTop - headerHeight + pushDistance,
  );
  await expect
    .poll(async () => (await header.boundingBox())?.y ?? 1)
    .toBeCloseTo(-pushDistance, 0);
  await expect
    .poll(async () => {
      const headerBox = await header.boundingBox();
      const projectsBox = await projects.boundingBox();
      return (headerBox?.y ?? 0) + (headerBox?.height ?? 0) - (projectsBox?.y ?? 0);
    })
    .toBeCloseTo(0, 0);

  await page.evaluate(
    (top) => window.scrollTo(0, top),
    projectsTop + headerHeight + 50,
  );
  await expect
    .poll(async () => (await header.boundingBox())?.y ?? 1)
    .toBeCloseTo(-headerHeight, 0);

  const reverseDistance = 24;
  await page.evaluate(
    (top) => window.scrollTo(0, top),
    projectsTop - headerHeight + reverseDistance,
  );
  await expect
    .poll(async () => (await header.boundingBox())?.y ?? 1)
    .toBeCloseTo(-reverseDistance, 0);
  await expect
    .poll(async () => {
      const headerBox = await header.boundingBox();
      const projectsBox = await projects.boundingBox();
      return (headerBox?.y ?? 0) + (headerBox?.height ?? 0) - (projectsBox?.y ?? 0);
    })
    .toBeCloseTo(0, 0);

  await page.evaluate(
    (top) => window.scrollTo(0, top),
    projectsTop - headerHeight - 1,
  );
  await expect
    .poll(async () => (await header.boundingBox())?.y ?? 1)
    .toBeCloseTo(0, 0);
  await expect(header).toHaveAttribute("data-projects-stuck", "false");
  await expect(header).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(header).toHaveCSS("border-bottom-color", "rgba(0, 0, 0, 0)");
});

test("Projects menu link lands below the opaque sticky header", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const header = page.locator(".site-header");
  const projects = page.locator("#projects");
  const headerHeight = await header.evaluate(
    (node) => node.getBoundingClientRect().height,
  );

  await page.getByRole("button", { name: /open menu/i }).click();
  await page
    .getByRole("dialog", { name: /site menu/i })
    .getByRole("link", { name: "Projects", exact: true })
    .click();

  await expect
    .poll(async () => (await projects.boundingBox())?.y ?? -1)
    .toBeCloseTo(headerHeight, 0);
  await expect(header).toHaveAttribute("data-projects-stuck", "true");
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

test("adidas hover expands only its project row and reveals the decorative arrow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 2542, height: 1101 });
  await page.goto("/");

  const cards = page.locator("#projects article");
  const topRow = page.locator(".projects-grid__row").first();
  const adidas = cards.nth(0);
  const adidasContent = adidas.locator(".project-card__content");
  const projectContext = adidasContent.locator("p").last();
  const arrow = adidas.locator(".project-card__arrow");
  const initialBoxes = await cards.evaluateAll((nodes) =>
    nodes.map((node) => node.getBoundingClientRect()),
  );
  const initialContentBox = await adidasContent.boundingBox();
  const initialContextBox = await projectContext.boundingBox();
  const initialArrowBox = await arrow.boundingBox();
  const initialContentBottomGap =
    initialBoxes[0].bottom -
    (initialContentBox!.y + initialContentBox!.height);
  expect(
    await arrow.evaluate((node) =>
      node.parentElement?.classList.contains("project-card__content"),
    ),
  ).toBe(true);
  expect(initialArrowBox!.y).toBeGreaterThanOrEqual(initialBoxes[0].bottom - 1);
  await expect(topRow).toHaveCSS("transition-duration", "1.25s");

  await adidas.hover();
  await page.waitForTimeout(250);

  const midTransitionBoxes = await cards.evaluateAll((nodes) =>
    nodes.map((node) => node.getBoundingClientRect()),
  );
  const midTransitionRatio =
    midTransitionBoxes[0].width / midTransitionBoxes[1].width;
  expect(midTransitionRatio).toBeGreaterThan(1.05);
  expect(midTransitionRatio).toBeLessThan(1.45);

  await expect
    .poll(async () => {
      const boxes = await cards.evaluateAll((nodes) =>
        nodes.map((node) => node.getBoundingClientRect()),
      );
      return boxes[0].width / boxes[1].width;
    })
    .toBeCloseTo(1.5, 1);
  await expect(arrow).toHaveCSS("opacity", "1");
  const hoveredContextBox = await projectContext.boundingBox();
  const hoveredArrowBox = await arrow.boundingBox();
  const arrowGap =
    hoveredArrowBox!.y -
    (hoveredContextBox!.y + hoveredContextBox!.height);
  expect(arrowGap).toBeGreaterThanOrEqual(24);
  expect(arrowGap).toBeLessThanOrEqual(28);
  const contextTravel = initialContextBox!.y - hoveredContextBox!.y;
  const arrowTravel = initialArrowBox!.y - hoveredArrowBox!.y;
  expect(arrowTravel).toBeCloseTo(contextTravel, 0);
  await expect
    .poll(async () => {
      const cardBox = await adidas.boundingBox();
      const contentBox = await adidasContent.boundingBox();
      return cardBox!.y + cardBox!.height - (contentBox!.y + contentBox!.height);
    })
    .toBeGreaterThan(initialContentBottomGap + 50);

  const hoveredBoxes = await cards.evaluateAll((nodes) =>
    nodes.map((node) => node.getBoundingClientRect()),
  );
  expect(Math.abs(hoveredBoxes[0].height - hoveredBoxes[1].height)).toBeLessThan(1);
  expect(Math.abs(hoveredBoxes[2].width - hoveredBoxes[3].width)).toBeLessThan(1);
  expect(hoveredBoxes[2].width).toBeCloseTo(initialBoxes[2].width, 0);
  expect(hoveredBoxes[3].width).toBeCloseTo(initialBoxes[3].width, 0);

  await page.mouse.move(0, 0);

  await expect
    .poll(async () => {
      const boxes = await cards.evaluateAll((nodes) =>
        nodes.map((node) => node.getBoundingClientRect()),
      );
      return Math.abs(boxes[0].width - boxes[1].width);
    })
    .toBeLessThan(1);
  await expect(arrow).toHaveCSS("opacity", "0");
  await expect
    .poll(async () => {
      const cardBox = await adidas.boundingBox();
      const contentBox = await adidasContent.boundingBox();
      return cardBox!.y + cardBox!.height - (contentBox!.y + contentBox!.height);
    })
    .toBeCloseTo(initialContentBottomGap, 0);
});

test("Desk Mate hover expands the right card and reveals its editorial arrow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 2542, height: 1101 });
  await page.goto("/");

  const cards = page.locator("#projects article");
  const topRow = page.locator(".projects-grid__row").first();
  const deskMate = cards.nth(1);
  const deskContent = deskMate.locator(".project-card__content");
  const projectContext = deskContent.locator("p").last();
  const arrow = deskMate.locator(".project-card__arrow");
  await expect(arrow).toHaveCount(1);

  const initialBoxes = await cards.evaluateAll((nodes) =>
    nodes.map((node) => node.getBoundingClientRect()),
  );
  const initialContextBox = await projectContext.boundingBox();
  const initialArrowBox = await arrow.boundingBox();
  expect(
    await arrow.evaluate((node) =>
      node.parentElement?.classList.contains("project-card__content"),
    ),
  ).toBe(true);
  expect(initialArrowBox!.y).toBeGreaterThanOrEqual(initialBoxes[1].bottom - 1);
  await expect(arrow).toHaveCSS("opacity", "0");
  await expect(topRow).toHaveCSS("transition-duration", "1.25s");

  await deskMate.hover();
  await page.waitForTimeout(250);

  const midTransitionBoxes = await cards.evaluateAll((nodes) =>
    nodes.map((node) => node.getBoundingClientRect()),
  );
  const midTransitionRatio =
    midTransitionBoxes[1].width / midTransitionBoxes[0].width;
  expect(midTransitionRatio).toBeGreaterThan(1.05);
  expect(midTransitionRatio).toBeLessThan(1.45);

  await expect
    .poll(async () => {
      const boxes = await cards.evaluateAll((nodes) =>
        nodes.map((node) => node.getBoundingClientRect()),
      );
      return boxes[1].width / boxes[0].width;
    })
    .toBeCloseTo(1.5, 1);
  await expect(arrow).toHaveCSS("opacity", "1");

  const hoveredBoxes = await cards.evaluateAll((nodes) =>
    nodes.map((node) => node.getBoundingClientRect()),
  );
  const hoveredContextBox = await projectContext.boundingBox();
  const hoveredArrowBox = await arrow.boundingBox();
  const arrowGap =
    hoveredArrowBox!.y -
    (hoveredContextBox!.y + hoveredContextBox!.height);
  expect(arrowGap).toBeGreaterThanOrEqual(24);
  expect(arrowGap).toBeLessThanOrEqual(28);
  expect(initialArrowBox!.y - hoveredArrowBox!.y).toBeCloseTo(
    initialContextBox!.y - hoveredContextBox!.y,
    0,
  );
  expect(hoveredBoxes[2].width).toBeCloseTo(initialBoxes[2].width, 0);
  expect(hoveredBoxes[3].width).toBeCloseTo(initialBoxes[3].width, 0);

  await page.mouse.move(0, 0);

  await expect
    .poll(async () => {
      const boxes = await cards.evaluateAll((nodes) =>
        nodes.map((node) => node.getBoundingClientRect()),
      );
      return Math.abs(boxes[0].width - boxes[1].width);
    })
    .toBeLessThan(1);
  await expect(arrow).toHaveCSS("opacity", "0");
});

test("Ragas hover mirrors the editorial expansion within its own row", async ({
  page,
}) => {
  await page.setViewportSize({ width: 2542, height: 1101 });
  await page.goto("/");

  const cards = page.locator("#projects article");
  const secondRow = page.locator(".projects-grid__row").nth(1);
  const ragas = cards.nth(2);
  const ragasContent = ragas.locator(".project-card__content");
  const projectContext = ragasContent.locator("p").last();
  const arrow = ragas.locator(".project-card__arrow");
  await expect(arrow).toHaveCount(1);

  const initialBoxes = await cards.evaluateAll((nodes) =>
    nodes.map((node) => node.getBoundingClientRect()),
  );
  const initialContextBox = await projectContext.boundingBox();
  const initialArrowBox = await arrow.boundingBox();
  expect(
    await arrow.evaluate((node) =>
      node.parentElement?.classList.contains("project-card__content"),
    ),
  ).toBe(true);
  expect(initialArrowBox!.y).toBeGreaterThanOrEqual(initialBoxes[2].bottom - 1);
  await expect(arrow).toHaveCSS("opacity", "0");
  await expect(secondRow).toHaveCSS("transition-duration", "1.25s");

  await ragas.hover();
  await page.waitForTimeout(250);

  const midTransitionBoxes = await cards.evaluateAll((nodes) =>
    nodes.map((node) => node.getBoundingClientRect()),
  );
  const midTransitionRatio =
    midTransitionBoxes[2].width / midTransitionBoxes[3].width;
  expect(midTransitionRatio).toBeGreaterThan(1.05);
  expect(midTransitionRatio).toBeLessThan(1.45);

  await expect
    .poll(async () => {
      const boxes = await cards.evaluateAll((nodes) =>
        nodes.map((node) => node.getBoundingClientRect()),
      );
      return boxes[2].width / boxes[3].width;
    })
    .toBeCloseTo(1.5, 1);
  await expect(arrow).toHaveCSS("opacity", "1");

  const hoveredBoxes = await cards.evaluateAll((nodes) =>
    nodes.map((node) => node.getBoundingClientRect()),
  );
  const hoveredContextBox = await projectContext.boundingBox();
  const hoveredArrowBox = await arrow.boundingBox();
  const arrowGap =
    hoveredArrowBox!.y -
    (hoveredContextBox!.y + hoveredContextBox!.height);
  expect(arrowGap).toBeGreaterThanOrEqual(24);
  expect(arrowGap).toBeLessThanOrEqual(28);
  expect(initialArrowBox!.y - hoveredArrowBox!.y).toBeCloseTo(
    initialContextBox!.y - hoveredContextBox!.y,
    0,
  );
  expect(hoveredBoxes[0].width).toBeCloseTo(initialBoxes[0].width, 0);
  expect(hoveredBoxes[1].width).toBeCloseTo(initialBoxes[1].width, 0);

  await page.mouse.move(0, 0);

  await expect
    .poll(async () => {
      const boxes = await cards.evaluateAll((nodes) =>
        nodes.map((node) => node.getBoundingClientRect()),
      );
      return Math.abs(boxes[2].width - boxes[3].width);
    })
    .toBeLessThan(1);
  await expect(arrow).toHaveCSS("opacity", "0");
});

test("Bound & Beyond hover expands the right card with its editorial reveal", async ({
  page,
}) => {
  await page.setViewportSize({ width: 2542, height: 1101 });
  await page.goto("/");

  const cards = page.locator("#projects article");
  const secondRow = page.locator(".projects-grid__row").nth(1);
  const bound = cards.nth(3);
  const boundContent = bound.locator(".project-card__content");
  const projectContext = boundContent.locator("p").last();
  const arrow = bound.locator(".project-card__arrow");
  await expect(arrow).toHaveCount(1);

  const initialBoxes = await cards.evaluateAll((nodes) =>
    nodes.map((node) => node.getBoundingClientRect()),
  );
  const initialContextBox = await projectContext.boundingBox();
  const initialArrowBox = await arrow.boundingBox();
  expect(
    await arrow.evaluate((node) =>
      node.parentElement?.classList.contains("project-card__content"),
    ),
  ).toBe(true);
  expect(initialArrowBox!.y).toBeGreaterThanOrEqual(initialBoxes[3].bottom - 1);
  await expect(arrow).toHaveCSS("opacity", "0");
  await expect(secondRow).toHaveCSS("transition-duration", "1.25s");

  await bound.hover();
  await page.waitForTimeout(250);

  const midTransitionBoxes = await cards.evaluateAll((nodes) =>
    nodes.map((node) => node.getBoundingClientRect()),
  );
  const midTransitionRatio =
    midTransitionBoxes[3].width / midTransitionBoxes[2].width;
  expect(midTransitionRatio).toBeGreaterThan(1.05);
  expect(midTransitionRatio).toBeLessThan(1.45);

  await expect
    .poll(async () => {
      const boxes = await cards.evaluateAll((nodes) =>
        nodes.map((node) => node.getBoundingClientRect()),
      );
      return boxes[3].width / boxes[2].width;
    })
    .toBeCloseTo(1.5, 1);
  await expect(arrow).toHaveCSS("opacity", "1");

  const hoveredBoxes = await cards.evaluateAll((nodes) =>
    nodes.map((node) => node.getBoundingClientRect()),
  );
  const hoveredContextBox = await projectContext.boundingBox();
  const hoveredArrowBox = await arrow.boundingBox();
  const arrowGap =
    hoveredArrowBox!.y -
    (hoveredContextBox!.y + hoveredContextBox!.height);
  expect(arrowGap).toBeGreaterThanOrEqual(24);
  expect(arrowGap).toBeLessThanOrEqual(28);
  expect(initialArrowBox!.y - hoveredArrowBox!.y).toBeCloseTo(
    initialContextBox!.y - hoveredContextBox!.y,
    0,
  );
  expect(hoveredBoxes[0].width).toBeCloseTo(initialBoxes[0].width, 0);
  expect(hoveredBoxes[1].width).toBeCloseTo(initialBoxes[1].width, 0);

  await page.mouse.move(0, 0);

  await expect
    .poll(async () => {
      const boxes = await cards.evaluateAll((nodes) =>
        nodes.map((node) => node.getBoundingClientRect()),
      );
      return Math.abs(boxes[2].width - boxes[3].width);
    })
    .toBeLessThan(1);
  await expect(arrow).toHaveCSS("opacity", "0");
});

test("About portrait uses the supplied profile image inside the stacked-card frame", async ({
  page,
}) => {
  await page.setViewportSize({ width: 2540, height: 1100 });
  await page.goto("/");

  const about = page.locator("#about");
  await about.scrollIntoViewIfNeeded();
  const stack = about.locator(".about-section__portrait-stack");
  const backCard = stack.locator(".about-section__portrait-layer");
  const frontCard = stack.locator(".about-section__portrait");
  const portrait = frontCard.getByRole("img", {
    name: "Portrait of Raegan Ricafrente",
  });

  await expect(stack).toHaveCSS("width", "270px");
  await expect(stack).toHaveCSS("height", "340px");
  await expect(portrait).toBeVisible();
  await expect(portrait).toHaveAttribute("src", "/images/profile2.png");
  await expect(portrait).toHaveAttribute("loading", "eager");
  await expect
    .poll(() => portrait.evaluate((image) => (image as HTMLImageElement).naturalWidth))
    .toBe(1024);
  const portraitScale = await portrait.evaluate((image) => {
    const transform = new DOMMatrix(getComputedStyle(image).transform);
    return transform.a;
  });
  expect(portraitScale).toBeLessThanOrEqual(1.25);
  await expect(frontCard).toHaveCSS("background-color", "rgb(53, 98, 171)");
  await expect(frontCard).toHaveCSS("background-image", "none");
  await expect(frontCard).toHaveCSS("border-radius", "20px");
  await expect(backCard).toHaveCSS("background-color", "rgb(39, 59, 90)");
  await expect(backCard).toHaveCSS("border-radius", "20px");

  const [frontTransform, backTransform] = await Promise.all([
    frontCard.evaluate((node) => getComputedStyle(node).transform),
    backCard.evaluate((node) => getComputedStyle(node).transform),
  ]);
  expect(frontTransform).not.toBe("none");
  expect(backTransform).not.toBe("none");
  expect(frontTransform).not.toBe(backTransform);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await page.locator("#about").scrollIntoViewIfNeeded();
  const mobileStack = page.locator(".about-section__portrait-stack");
  const mobileFront = mobileStack.locator(".about-section__portrait");
  const mobileBack = mobileStack.locator(".about-section__portrait-layer");
  await expect(mobileStack).toHaveCSS("width", "220px");
  await expect(mobileStack).toHaveCSS("height", "278px");
  await expect(mobileFront).toHaveCSS("border-radius", "20px");
  await expect(mobileBack).toHaveCSS("border-radius", "20px");
  const mobileSizes = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(mobileSizes.scroll).toBe(mobileSizes.client);
});

test("About portrait hover straightens and enlarges only the front card", async ({
  page,
  browser,
}) => {
  const desktop = page;
  await desktop.setViewportSize({ width: 2540, height: 1100 });
  await desktop.goto("/");
  const stack = desktop.locator(".about-section__portrait-stack");
  const front = stack.locator(".about-section__portrait");
  const back = stack.locator(".about-section__portrait-layer");
  await stack.scrollIntoViewIfNeeded();

  const initialFrontTransform = await front.evaluate(
    (node) => getComputedStyle(node).transform,
  );
  const initialBackTransform = await back.evaluate(
    (node) => getComputedStyle(node).transform,
  );
  await expect(front).toHaveCSS("transition-duration", "0.5s");

  await stack.hover();
  await desktop.waitForTimeout(250);
  const midMatrix = await front.evaluate((node) => {
    const matrix = new DOMMatrix(getComputedStyle(node).transform);
    return { a: matrix.a, b: matrix.b };
  });
  expect(midMatrix.a).toBeGreaterThan(1.01);
  expect(Math.abs(midMatrix.b)).toBeLessThan(0.03);

  await expect
    .poll(() =>
      front.evaluate((node) => {
        const matrix = new DOMMatrix(getComputedStyle(node).transform);
        return [matrix.a, matrix.b, matrix.c, matrix.d];
      }),
    )
    .toEqual([1.06, 0, 0, 1.06]);
  await expect(back).toHaveCSS("transform", initialBackTransform);

  await desktop.mouse.move(0, 0);
  await expect(front).toHaveCSS("transform", initialFrontTransform);

  const reducedContext = await browser.newContext({
    baseURL: "http://localhost:3000",
    reducedMotion: "reduce",
    viewport: { width: 2540, height: 1100 },
  });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto("/");
  const reducedStack = reducedPage.locator(".about-section__portrait-stack");
  const reducedFront = reducedStack.locator(".about-section__portrait");
  await reducedStack.scrollIntoViewIfNeeded();
  const reducedTransform = await reducedFront.evaluate(
    (node) => getComputedStyle(node).transform,
  );
  await reducedStack.hover();
  await reducedPage.waitForTimeout(50);
  await expect(reducedFront).toHaveCSS("transform", reducedTransform);
  await reducedContext.close();

  const mobileContext = await browser.newContext({
    baseURL: "http://localhost:3000",
    viewport: { width: 390, height: 844 },
  });
  const mobile = await mobileContext.newPage();
  await mobile.goto("/");
  const mobileStack = mobile.locator(".about-section__portrait-stack");
  const mobileFront = mobileStack.locator(".about-section__portrait");
  await mobileStack.scrollIntoViewIfNeeded();
  const mobileTransform = await mobileFront.evaluate(
    (node) => getComputedStyle(node).transform,
  );
  await mobileStack.hover();
  await expect(mobileFront).toHaveCSS("transform", mobileTransform);
  await mobileContext.close();
});

test("mobile keeps equal project widths and hides the adidas hover arrow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const cards = page.locator("#projects article");
  const adidas = cards.nth(0);
  const initialWidth = (await adidas.boundingBox())!.width;

  await adidas.hover();

  await expect
    .poll(async () => (await adidas.boundingBox())!.width)
    .toBeCloseTo(initialWidth, 0);
  await expect(adidas.locator(".project-card__arrow")).toHaveCSS("opacity", "0");

  const sizes = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(sizes.scroll).toBe(sizes.client);
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

  const earlyScroll = Math.round(viewport.height * 0.25);
  await page.evaluate((top) => window.scrollTo(0, top), earlyScroll);
  await page.waitForFunction((top) => window.scrollY === top, earlyScroll);
  const earlyProjectsBox = await page.locator("#projects").boundingBox();
  expect(earlyProjectsBox!.y).toBeLessThan(viewport.height);
  const earlyScreenshot = await page.screenshot({ animations: "disabled" });
  expect(earlyScreenshot.equals(heroScreenshot)).toBe(false);
  await expect(page).toHaveScreenshot("target-desktop-overlap.png", {
    animations: "disabled",
  });

  const deepScroll = Math.round(viewport.height * 0.75);
  await page.evaluate((top) => window.scrollTo(0, top), deepScroll);
  await page.waitForFunction((top) => window.scrollY === top, deepScroll);
  const deepProjectsBox = await page.locator("#projects").boundingBox();
  expect(deepProjectsBox!.y).toBeLessThan(viewport.height * 0.3);
  const deepScreenshot = await page.screenshot({ animations: "disabled" });
  expect(deepScreenshot.equals(earlyScreenshot)).toBe(false);
  await expect(page).toHaveScreenshot("target-desktop-deep-overlap.png", {
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
