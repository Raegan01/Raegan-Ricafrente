# Desktop Hero Grid Correction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Match the supplied desktop reference with a centered four-column editorial hero while preserving the current mobile landing page.

**Architecture:** Keep the existing React component boundaries and correct the layout at the CSS composition layer. Add one semantic grid element to `Hero`, give the headline explicit line spans, and extend the current cursor component into a small motion trail without adding dependencies.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS, Motion, Playwright, Vitest

## Global Constraints

- The first user-supplied screenshot is the desktop visual source of truth at 2542 by 1261.
- The page remains a single landing page with no inner routes.
- Desktop uses a centered 1320-pixel maximum canvas with four equal 330-pixel columns.
- Existing mobile behavior below 1200 pixels must remain intact.
- No new runtime dependency is permitted.

---

### Task 1: Desktop geometry regression

**Files:**
- Modify: `e2e/landing-page.spec.ts`

**Interfaces:**
- Consumes: `.hero__grid`, `.site-header__inner`, `.hero__title-line`, `.hero__support`, `.hero__role`, `.discipline-ticker`
- Produces: Playwright assertions that define the 2048-pixel desktop canvas and anchors

- [ ] **Step 1: Write the failing desktop geometry test**

Add a 2542 by 1261 test that expects the hero grid to be centered, width near 1320 pixels, four equal columns, three explicit headline lines, and key elements aligned to the first two grid lines.

- [ ] **Step 2: Run the desktop test to verify it fails**

Run: `pnpm exec playwright test e2e/landing-page.spec.ts --grep "reference desktop geometry"`

Expected: FAIL because `.hero__grid`, `.site-header__inner`, and `.hero__title-line` do not exist.

- [ ] **Step 3: Commit the red test with the implementation task**

The regression test and its minimal production correction will be committed together after the green run.

### Task 2: Centered editorial hero

**Files:**
- Modify: `components/header.tsx`
- Modify: `components/hero.tsx`
- Modify: `app/globals.css`
- Test: `e2e/landing-page.spec.ts`

**Interfaces:**
- Consumes: the existing `Header`, `Hero`, `DisciplineTicker`, and desktop media-query structure
- Produces: `.site-header__inner`, `.hero__grid`, `.hero__canvas`, and `.hero__title-line`

- [ ] **Step 1: Add minimal semantic wrappers**

Wrap the header content in `.site-header__inner`, add an aria-hidden `.hero__grid`, wrap positioned hero content in `.hero__canvas`, and split the heading into three `.hero__title-line` spans without changing its accessible text.

- [ ] **Step 2: Implement the desktop canvas CSS**

Define `--desktop-canvas: 1320px`, center it with `width: min(var(--desktop-canvas), calc(100vw - 100px))`, draw five vertical rules, and place hero content against the four equal columns. Replace the hard-coded 720/820-pixel desktop hero heights with `100vh` and `calc(100vh + 100px)`. Override these wrappers below 1200 pixels so the existing tablet and mobile coordinates continue to apply.

- [ ] **Step 3: Run the focused e2e test**

Run: `pnpm exec playwright test e2e/landing-page.spec.ts --grep "reference desktop geometry"`

Expected: PASS with the canvas and content anchors inside their stated tolerances.

### Task 3: Segmented cursor trail

**Files:**
- Modify: `components/cursor-follower.tsx`
- Modify: `app/globals.css`
- Modify: `tests/landing-page.test.tsx`

**Interfaces:**
- Consumes: pointer coordinates and the existing `.cursor-follower` visual token
- Produces: fourteen `.cursor-follower__segment` elements with decreasing lag

- [ ] **Step 1: Write the failing component assertion**

Render the landing page and expect fourteen cursor trail segments inside the aria-hidden cursor follower.

- [ ] **Step 2: Run the unit test to verify it fails**

Run: `pnpm test tests/landing-page.test.tsx`

Expected: FAIL because no `.cursor-follower__segment` elements exist.

- [ ] **Step 3: Implement the minimal trail**

Render fourteen spring-driven cursor segments from the existing pointer motion values, with progressively slower springs creating the trail. Disable the trail under 810 pixels and for reduced motion.

- [ ] **Step 4: Run the focused unit test**

Run: `pnpm test tests/landing-page.test.tsx`

Expected: PASS.

### Task 4: Visual tuning and full verification

**Files:**
- Modify: `app/globals.css` only if screenshot comparison exposes measured discrepancies
- Update: `e2e/landing-page.spec.ts-snapshots/desktop-hero-win32.png`

**Interfaces:**
- Consumes: the completed desktop geometry and cursor trail
- Produces: a reviewed desktop screenshot and verified regression suite

- [ ] **Step 1: Capture and inspect a 2542 by 1261 screenshot**

Run the local site with cursor and reveal transforms disabled, capture the hero, and compare header, grid lines, headline, support copy, role label, ticker, availability, and blue trail against the reference.

- [ ] **Step 2: Tune measured discrepancies**

Change only the relevant desktop CSS variables or anchor positions, then repeat the screenshot comparison until the composition matches within a few pixels.

- [ ] **Step 3: Run complete verification**

Run: `pnpm test && pnpm lint && pnpm typecheck && pnpm test:e2e && pnpm build`

Expected: all commands exit 0, seven or more unit tests pass, all Playwright tests pass, and Next.js builds only the landing route plus its framework not-found route.

- [ ] **Step 4: Commit the correction**

Stage only the correction files and commit with `fix: match centered desktop hero grid`.
