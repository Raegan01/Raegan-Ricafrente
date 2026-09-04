# Video-Comparison Fidelity Correction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Match the newly supplied target recording with a pinned hero transition and a narrow four-card Projects grid while preserving the existing lower landing-page sections.

**Architecture:** Keep the current section components and replace the superseded three-card variant model with four uniform project articles. Restore the sticky hero through CSS stacking, make the ticker loop from a measured initial phase, and use Playwright geometry plus screenshots to calibrate the target states.

**Tech Stack:** Next.js 16, React 19, TypeScript 6, CSS, Motion 12, Vitest, Testing Library, Playwright

## Global Constraints

- The first new recording, `Desktop 2026.07.14 - 04.17.53.03.mp4`, is the source of truth.
- The page remains one landing page with no inner routes.
- Media remains neutral placeholders; do not add captured video frames as site assets.
- Preserve About, CTA prelude, footer, menu, résumé, social, and email behavior.
- Desktop hero canvas remains 1320px; Projects canvas is approximately 1100px.
- Projects order is `adidas x D.O.N.`, `Desk Mate`, `Ragas & Rhythms`, `Bound & Beyond`.
- Desktop uses four equal 2×2 cards; mobile uses one column.
- Desktop/tablet uses a sticky hero covered by the opaque Projects layer; mobile uses normal flow.
- Fine-pointer devices hide the native cursor only while the custom trail is active.
- No new dependency is permitted.

## File Map

- Modify `data/site-content.ts`: restore four uniform project entries.
- Modify `components/project-card.tsx`: remove layout variants and arrows; overlay metadata.
- Modify `components/projects-section.tsx`: apply a dedicated narrow canvas.
- Modify `components/discipline-ticker.tsx`: render a seamless repeated loop with target initial phase.
- Modify `app/globals.css`: implement cards, sticky stage, cursor hiding, ticker geometry, and responsive fallback.
- Modify `tests/landing-page.test.tsx`: enforce content and preserved-section contracts.
- Modify `e2e/landing-page.spec.ts`: enforce sticky movement, dimensions, cursor, responsive layout, and visual states.
- Update `e2e/landing-page.spec.ts-snapshots/*.png`: store reviewed target-state baselines.

---

### Task 1: Restore the four-project semantic contract

**Files:**
- Modify: `tests/landing-page.test.tsx`
- Modify: `data/site-content.ts`
- Modify: `components/project-card.tsx`

**Interfaces:**
- Consumes: `Project`, `projects`, `MediaPlaceholder`
- Produces: four uniform project articles with no project links or arrow buttons

- [ ] **Step 1: Write the failing four-card test**

Replace the three-card assertions with:

```tsx
const section = screen.getByRole("region", { name: /selected projects/i });
const cards = within(section).getAllByRole("article");
expect(cards).toHaveLength(4);
expect(cards.map((card) => within(card).getByRole("heading", { level: 3 }).textContent))
  .toEqual(["adidas x D.O.N.", "Desk Mate", "Ragas & Rhythms", "Bound & Beyond"]);
expect(within(section).queryByRole("link")).not.toBeInTheDocument();
expect(within(section).queryByRole("button")).not.toBeInTheDocument();
expect(screen.getByText("Hi, I'm Raegan Ricafrente")).toBeInTheDocument();
expect(screen.getByRole("link", { name: /say hello/i })).toHaveAttribute(
  "href", "mailto:ananya.dezign@gmail.com",
);
```

- [ ] **Step 2: Verify the red state**

Run: `pnpm test tests/landing-page.test.tsx`

Expected: FAIL with three articles, missing `adidas x D.O.N.`, and existing arrow buttons.

- [ ] **Step 3: Simplify the data model and restore adidas**

Use this type and collection in `data/site-content.ts`:

```ts
export type Project = {
  title: string;
  discipline: string;
  context: string;
  placeholderLabel: string;
  tone: "adidas" | "desk" | "ragas" | "bound";
};

export const projects: Project[] = [
  { title: "adidas x D.O.N.", discipline: "Pop-up Store", context: "Retail & Brand Environment | Collaborative Project", placeholderLabel: "PROJECT IMAGE 01", tone: "adidas" },
  { title: "Desk Mate", discipline: "D2C Lifestyle & Consumer", context: "Branding & Identity | Classroom Project", placeholderLabel: "PROJECT IMAGE 02", tone: "desk" },
  { title: "Ragas & Rhythms", discipline: "Publication Design", context: "Design for Print | Classroom Project", placeholderLabel: "PROJECT IMAGE 03", tone: "ragas" },
  { title: "Bound & Beyond", discipline: "D2C Lifestyle & Consumer", context: "System Thinking | Classroom Project", placeholderLabel: "PROJECT IMAGE 04", tone: "bound" },
];
```

- [ ] **Step 4: Replace ProjectCard with uniform overlay markup**

```tsx
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className={`project-card project-card--${project.tone}`}>
      <MediaPlaceholder
        className="project-card__media"
        description={`Future ${project.title} project image`}
        kind="image"
        label={project.placeholderLabel}
      />
      <div className="project-card__content">
        <h3>{project.title}</h3>
        <p>{project.discipline}</p>
        <p>{project.context}</p>
      </div>
    </article>
  );
}
```

- [ ] **Step 5: Verify and commit**

Run: `pnpm test tests/landing-page.test.tsx`

Expected: PASS.

```powershell
git add -- tests/landing-page.test.tsx data/site-content.ts components/project-card.tsx
git commit -m "fix: restore recorded four-project content"
```

### Task 2: Match the narrow 2×2 Projects composition

**Files:**
- Modify: `components/projects-section.tsx`
- Modify: `app/globals.css`
- Modify: `e2e/landing-page.spec.ts`

**Interfaces:**
- Produces: `.projects-section__canvas` at 1100px and four equal 1.2:1 cards

- [ ] **Step 1: Add failing desktop geometry assertions**

```ts
const canvas = page.locator(".projects-section__canvas");
const cards = page.locator("#projects article");
await expect(cards).toHaveCount(4);
const canvasBox = await canvas.boundingBox();
expect(canvasBox!.width).toBeCloseTo(1100, 0);
const boxes = await cards.evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect()));
expect(boxes[0].width).toBeCloseTo(boxes[1].width, 0);
expect(boxes[0].height).toBeCloseTo(boxes[1].height, 0);
expect(boxes[0].width / boxes[0].height).toBeCloseTo(1.2, 1);
expect(Math.abs(boxes[0].top - boxes[1].top)).toBeLessThan(1);
expect(boxes[2].top).toBeGreaterThan(boxes[0].bottom);
```

- [ ] **Step 2: Verify the red state**

Run: `.\node_modules\.bin\playwright.CMD test e2e/landing-page.spec.ts --grep "four-project geometry"`

Expected: FAIL because the canvas is 1320px and the feature card spans two columns.

- [ ] **Step 3: Add the narrow canvas class**

Change the wrapper in `ProjectsSection` to:

```tsx
<div className="section-canvas projects-section__canvas">
```

- [ ] **Step 4: Implement measured desktop card CSS**

```css
.projects-section__canvas { width: min(1100px, calc(100vw - 100px)); }
.projects-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.project-card { position: relative; aspect-ratio: 1.2; overflow: hidden; border-radius: 12px; color: white; }
.project-card__media { position: absolute; inset: 0; }
.project-card::after { position: absolute; z-index: 1; inset: 48% 0 0; content: ""; background: linear-gradient(transparent, rgba(0,0,0,.72)); }
.project-card__content { position: absolute; z-index: 2; right: 30px; bottom: 26px; left: 30px; font-family: "IBM Plex Mono", monospace; }
.project-card__content h3 { margin: 0 0 8px; font-size: 39px; font-weight: 600; line-height: 1.05; }
.project-card__content p { margin: 5px 0 0; font-size: 12px; font-weight: 600; }
.project-card--adidas .media-placeholder { --placeholder-start:#8f9691; --placeholder-end:#59605d; }
.project-card--desk .media-placeholder { --placeholder-start:#b6aa9a; --placeholder-end:#827564; }
.project-card--ragas .media-placeholder { --placeholder-start:#252220; --placeholder-end:#090a0a; }
.project-card--bound .media-placeholder { --placeholder-start:#9eaea4; --placeholder-end:#687d72; }
```

Set the Projects heading to `80px`, keep the heading/CTA inside the 1100px canvas, and remove every `--feature`, `--standard`, and arrow rule.

- [ ] **Step 5: Add the mobile one-column override**

```css
@media (max-width: 809px) {
  .projects-section__canvas { width: auto; }
  .projects-grid { grid-template-columns: 1fr; gap: 18px; }
  .project-card { aspect-ratio: 1.05; }
  .project-card__content { right: 22px; bottom: 22px; left: 22px; }
  .project-card__content h3 { font-size: 27px; }
}
```

- [ ] **Step 6: Verify and commit**

Run: `.\node_modules\.bin\playwright.CMD test e2e/landing-page.spec.ts --grep "four-project geometry|mobile layout"`

Expected: PASS.

```powershell
git add -- components/projects-section.tsx app/globals.css e2e/landing-page.spec.ts
git commit -m "fix: match recorded project grid geometry"
```

### Task 3: Restore the pinned hero and target pointer behavior

**Files:**
- Modify: `app/globals.css`
- Modify: `e2e/landing-page.spec.ts`

**Interfaces:**
- Produces: desktop sticky hero, advancing Projects layer, fine-pointer native-cursor hiding

- [ ] **Step 1: Add a failing sticky-scroll regression**

```ts
const title = page.locator("#hero-title");
const projects = page.locator("#projects");
const titleBefore = await title.boundingBox();
const projectsBefore = await projects.boundingBox();
await page.evaluate(() => window.scrollTo(0, 80));
const titleAfter = await title.boundingBox();
const projectsAfter = await projects.boundingBox();
expect(Math.abs(titleAfter!.y - titleBefore!.y)).toBeLessThan(1);
expect(projectsAfter!.y).toBeLessThan(projectsBefore!.y - 70);
await expect(page.locator("html")).toHaveCSS("cursor", "none");
```

- [ ] **Step 2: Verify the red state**

Run: `.\node_modules\.bin\playwright.CMD test e2e/landing-page.spec.ts --grep "pinned hero transition"`

Expected: FAIL because the title moves with normal flow and the native cursor remains enabled.

- [ ] **Step 3: Restore sticky stage and layered cover**

```css
@media (min-width: 810px) and (min-height: 700px) {
  .hero-stage { height: calc(100svh + 100px); }
  .hero { position: sticky; top: 0; height: 100svh; }
}
.landing-flow { position: relative; z-index: 2; background: var(--paper); }
@media (hover: hover) and (pointer: fine) {
  html, body, a, button { cursor: none; }
}
@media (max-width: 809px), (max-height: 699px) {
  .hero-stage { height: 1030px; }
  .hero { position: relative; height: 844px; }
}
```

- [ ] **Step 4: Calibrate the stage distance**

Capture at scroll positions `0`, `80`, `100`, and `180`. Adjust only the `100px` stage extension until the Projects boundary and stationary hero match target quarter-second frames from 7.0–9.0 seconds.

- [ ] **Step 5: Verify and commit**

Run: `.\node_modules\.bin\playwright.CMD test e2e/landing-page.spec.ts --grep "pinned hero transition"`

Expected: PASS.

```powershell
git add -- app/globals.css e2e/landing-page.spec.ts
git commit -m "fix: restore recorded pinned hero transition"
```

### Task 4: Make the ticker seamless and calibrate visual states

**Files:**
- Modify: `components/discipline-ticker.tsx`
- Modify: `app/globals.css`
- Modify: `e2e/landing-page.spec.ts`
- Update: `e2e/landing-page.spec.ts-snapshots/*.png`

**Interfaces:**
- Produces: two aria-deduplicated ticker tracks and reviewed hero/overlap/grid screenshots

- [ ] **Step 1: Add ticker and preserved-section assertions**

```tsx
const ticker = screen.getByRole("group", { name: /design disciplines/i });
expect(within(ticker).getAllByRole("listitem").map((item) => item.textContent).slice(0, 5))
  .toEqual(["Spatial / Exhibition Design", "Layout", "Branding", "3D", "Publication"]);
expect(ticker.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
expect(screen.getByText("Hi, I'm Raegan Ricafrente")).toBeInTheDocument();
expect(screen.getByRole("heading", { name: /let's create something/i })).toBeInTheDocument();
expect(screen.getByRole("link", { name: /view resume/i })).toHaveAttribute(
  "href", expect.stringContaining("drive.google.com"),
);
expect(screen.getByRole("link", { name: /say hello/i })).toHaveAttribute(
  "href", "mailto:ananya.dezign@gmail.com",
);
```

- [ ] **Step 2: Verify the red state**

Run: `pnpm test tests/landing-page.test.tsx`

Expected: FAIL because the ticker currently begins at the original array start and uses a pseudo-element clone.

- [ ] **Step 3: Render two explicit tracks**

Use this order and structure in `components/discipline-ticker.tsx`:

```tsx
const displayOrder = [
  "Spatial / Exhibition Design", "Layout", "Branding", "3D",
  "Publication", "Packaging", "Motion Graphics", "Typography",
] as const;

<div className="discipline-ticker" role="group" aria-label="Design disciplines">
  <motion.div
    animate={reducedMotion ? { x: "0%" } : { x: ["0%", "-50%"] }}
    className="discipline-track"
    transition={reducedMotion ? { duration: 0 } : { duration: 18, ease: "linear", repeat: Infinity }}
  >
    {[false, true].map((duplicate) => (
      <ul aria-hidden={duplicate || undefined} className="discipline-list" key={String(duplicate)}>
        {displayOrder.map((discipline) => <li key={discipline}>{discipline}</li>)}
      </ul>
    ))}
  </motion.div>
</div>
```

Use `.discipline-track { display:flex; width:max-content; }` and `.discipline-list { display:flex; flex:none; gap:9px; padding-right:9px; }`. Remove the pseudo-element clone.

- [ ] **Step 4: Capture and inspect target states**

Add the overlap screenshot alongside the existing hero and Projects screenshots:

```ts
await page.evaluate(() => window.scrollTo(0, 80));
await expect(page).toHaveScreenshot("target-desktop-overlap.png", {
  animations: "disabled",
});
await page.locator("#projects").scrollIntoViewIfNeeded();
await expect(page.locator("#projects")).toHaveScreenshot(
  "target-desktop-project-grid.png",
  { animations: "disabled" },
);
```

Run:

` .\node_modules\.bin\playwright.CMD test --update-snapshots`

Inspect every candidate against the extracted target frames before accepting it.

- [ ] **Step 5: Run complete verification**

Run: `pnpm test; pnpm lint; pnpm typecheck; .\node_modules\.bin\playwright.CMD test; pnpm build`

Expected: all commands exit 0; all tests and screenshots pass; build contains `/` and `/_not-found` only.

- [ ] **Step 6: Commit calibrated correction**

```powershell
git add -- components/discipline-ticker.tsx app/globals.css tests/landing-page.test.tsx e2e/landing-page.spec.ts e2e/landing-page.spec.ts-snapshots
git commit -m "fix: calibrate landing page to target video"
```
