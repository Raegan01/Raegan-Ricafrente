# Visible Sticky Project Cover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the opaque Projects layer visibly rise over a stationary desktop hero for one viewport of native scrolling, while retaining normal flow on mobile, short-height, touch, and coarse-pointer contexts.

**Architecture:** Finish and commit the already-reviewed cursor/input-mode changes currently present in the working tree, then replace the ineffective `100px` invisible sticky interval with a `100svh` staged overlap. The hero stage gains exactly the same distance that the opaque landing flow is pulled upward, preserving downstream layout while giving Projects a full viewport in which to cover the sticky hero.

**Tech Stack:** Next.js 16, React 19, TypeScript 6, CSS sticky positioning, Motion 12, Vitest, Testing Library, Playwright

## Global Constraints

- Use native CSS sticky positioning and document flow; do not add a JavaScript scroll controller, scroll snapping, wheel-speed handling, or a dependency.
- Eligible desktop input requires width at least `810px`, height at least `700px`, hover capability, and a fine pointer.
- The desktop cover distance starts and ships as `100svh`; visual calibration may change only the `--hero-cover-distance` value.
- Mobile, short-height, touch, and coarse-pointer contexts retain normal flow.
- `.landing-flow` remains opaque and above the hero; fixed header controls and the active custom cursor remain above both.
- Preserve the four-project order, 1100px desktop grid, one-column mobile grid, ticker, About, CTA, footer, menu, résumé, social, email, and one-page route contract.
- Media remains neutral placeholders.
- No new dependency or inner route is permitted.
- Preserve the existing uncommitted cursor/input-mode fix wave; do not discard or overwrite it.

## Working-Tree Baseline

The branch intentionally begins this plan with reviewed but uncommitted changes in:

- `app/globals.css`
- `components/cursor-trail.tsx`
- `e2e/landing-page.spec.ts`
- `tests/cursor-trail.test.tsx`

`next-env.d.ts` also contains generated development-path noise and must be restored to the committed production form before the first commit.

---

### Task 1: Finish the pending cursor and input-mode review fixes

**Files:**
- Preserve: `app/globals.css`
- Preserve: `components/cursor-trail.tsx`
- Preserve: `e2e/landing-page.spec.ts`
- Preserve: `tests/cursor-trail.test.tsx`
- Restore: `next-env.d.ts`

**Interfaces:**
- Produces: `html.cursor-trail-active` only while the trail listener is active; custom cursor above menu; normal-flow wide touch input
- Consumes: existing reviewed working-tree changes and `.superpowers/sdd/final-review-fix-report.md`

- [ ] **Step 1: Restore generated Next.js type reference noise**

Use `apply_patch` so `next-env.d.ts` contains:

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/types/routes.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
```

- [ ] **Step 2: Verify the pending focused tests**

Run:

```powershell
pnpm test tests/cursor-trail.test.tsx
.\node_modules\.bin\playwright.CMD test e2e/landing-page.spec.ts --grep "fine input|wide touch|reduced motion|pinned hero transition"
```

Expected: cursor lifecycle `3/3` passes; each of the four focused Playwright cases passes.

- [ ] **Step 3: Verify the pending change scope**

Run:

```powershell
git diff --check
git status --short
```

Expected tracked changes before commit:

```text
M app/globals.css
M components/cursor-trail.tsx
M e2e/landing-page.spec.ts
?? tests/cursor-trail.test.tsx
```

`next-env.d.ts` must not appear.

- [ ] **Step 4: Commit the completed review fixes**

```powershell
git add -- app/globals.css components/cursor-trail.tsx e2e/landing-page.spec.ts tests/cursor-trail.test.tsx
git commit -m "fix: harden cursor and input-mode behavior"
```

### Task 2: Make the Projects cover visible while the hero remains pinned

**Files:**
- Modify: `e2e/landing-page.spec.ts`
- Modify: `app/globals.css`

**Interfaces:**
- Produces: `main --hero-cover-distance: 100svh`, a `200svh` effective hero stage, and an equal negative landing-flow offset
- Consumes: `.hero-stage`, `.hero`, `.landing-flow`, `#hero-title`, `#projects`

- [ ] **Step 1: Replace the ineffective sticky regression with visible-cover geometry**

In `recording desktop keeps fixed controls over a pinned hero transition`, keep the fixed-control assertions and use this geometry contract:

```ts
const viewport = { width: 2542, height: 1261 };
await page.setViewportSize(viewport);
await page.goto("/");

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
```

- [ ] **Step 2: Extend the wide-touch normal-flow regression**

Add these assertions to `wide touch input keeps the hero in normal flow`:

```ts
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
```

- [ ] **Step 3: Verify the RED state**

Run:

```powershell
.\node_modules\.bin\playwright.CMD test e2e/landing-page.spec.ts --grep "pinned hero transition|wide touch"
```

Expected: the desktop test fails because Projects begins `100px` below the viewport and the title moves before Projects substantially covers it; the wide-touch test remains green.

- [ ] **Step 4: Implement the staged overlap CSS**

Keep the base flow explicit:

```css
.landing-flow {
  position: relative;
  z-index: 2;
  margin-top: 0;
  background: var(--paper);
}
```

Replace the eligible desktop sticky block with:

```css
@media (min-width: 810px) and (min-height: 700px) and (hover: hover) and (pointer: fine) {
  main {
    --hero-cover-distance: 100svh;
  }

  .hero-stage {
    height: calc(100svh + var(--hero-cover-distance));
  }

  .hero {
    position: sticky;
    top: 0;
    height: 100svh;
  }

  .landing-flow {
    margin-top: calc(-1 * var(--hero-cover-distance));
  }
}
```

Do not change the mobile/short-height hero dimensions.

- [ ] **Step 5: Verify GREEN and commit**

Run:

```powershell
.\node_modules\.bin\playwright.CMD test e2e/landing-page.spec.ts --grep "pinned hero transition|wide touch"
```

Expected: both tests pass; desktop title stays within `1px` at 25% and 75% cover states; wide touch remains normal flow.

```powershell
git add -- app/globals.css e2e/landing-page.spec.ts
git commit -m "fix: keep hero pinned during visible project cover"
```

### Task 3: Calibrate visual cover states and run release verification

**Files:**
- Modify: `e2e/landing-page.spec.ts`
- Update: `e2e/landing-page.spec.ts-snapshots/target-desktop-overlap-win32.png`
- Create: `e2e/landing-page.spec.ts-snapshots/target-desktop-deep-overlap-win32.png`
- Update only if deterministic capture changes: `e2e/landing-page.spec.ts-snapshots/target-desktop-project-grid-win32.png`

**Interfaces:**
- Produces: distinct early and deep cover baselines tied to viewport-relative scroll positions
- Consumes: the Task 2 staged overlap and `stabilizeForScreenshot`

- [ ] **Step 1: Capture viewport-relative early and deep cover states**

In `target desktop scroll states`, replace the fixed `180px` overlap state with:

```ts
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
```

Keep the existing deterministic absolute-top Projects capture after these states.

- [ ] **Step 2: Regenerate only affected baselines**

Run:

```powershell
.\node_modules\.bin\playwright.CMD test e2e/landing-page.spec.ts --grep "target desktop scroll states" --update-snapshots
```

Expected: one focused test passes; early overlap is updated; deep overlap is created; hero baseline remains unchanged.

- [ ] **Step 3: Inspect visual states**

Use the local image viewer on:

```text
e2e/landing-page.spec.ts-snapshots/target-desktop-hero-win32.png
e2e/landing-page.spec.ts-snapshots/target-desktop-overlap-win32.png
e2e/landing-page.spec.ts-snapshots/target-desktop-deep-overlap-win32.png
e2e/landing-page.spec.ts-snapshots/target-desktop-project-grid-win32.png
```

Acceptance:

- hero baseline has no Projects pixels inside the viewport;
- early cover shows Projects covering roughly the lower quarter while the title remains in its original position;
- deep cover shows Projects covering roughly the lower three quarters while the title remains in its original position;
- fixed header controls remain above the opaque Projects layer;
- project grid remains the 1100px four-card composition.

- [ ] **Step 4: Run complete release verification**

Run:

```powershell
pnpm test
pnpm lint
pnpm typecheck
.\node_modules\.bin\playwright.CMD test
pnpm build
git diff --check
```

Expected: all commands exit `0`; all unit and Playwright tests pass; build routes remain `/` and `/_not-found` only.

- [ ] **Step 5: Commit calibrated baselines**

```powershell
git add -- e2e/landing-page.spec.ts e2e/landing-page.spec.ts-snapshots/target-desktop-overlap-win32.png e2e/landing-page.spec.ts-snapshots/target-desktop-deep-overlap-win32.png e2e/landing-page.spec.ts-snapshots/target-desktop-project-grid-win32.png
git commit -m "test: lock visible project cover states"
```

If the deterministic Projects baseline is byte-identical to its committed version, omit it from `git add`.
