# Ananya Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-route Next.js portfolio landing page that reproduces the inspected Raegan Ricafrente homepage at desktop and mobile sizes, using labeled neutral media placeholders instead of real media.

**Architecture:** A Next.js App Router page composes focused client and server components from typed local content. Custom CSS owns the reference geometry and responsive recomposition; Motion owns progressive enhancement for menu, reveal, ticker, and hover behavior. Unit tests cover structure and interaction, while Playwright covers responsive geometry, overflow, and visual states.

**Tech Stack:** Next.js, React, TypeScript, custom CSS, Motion, Lucide React, Vitest, Testing Library, Playwright, pnpm.

## Global Constraints

- Implement only `/`; do not create inner page routes.
- Keep Home, Projects, About, and Contact as same-page anchors.
- Remove Side Quests from navigation and content.
- Use four labeled neutral project media placeholders plus one portrait placeholder.
- Preserve the inspected 1280×720 desktop and 390×844 mobile compositions.
- Keep the homepage-style contact CTA and email link; do not add a contact form.
- Use the visible email address `ananya.dezign@gmail.com` for both text and `mailto:`.
- Prevent unintended document-level horizontal overflow at 390px.
- Respect `prefers-reduced-motion` and retain usable no-animation states.
- Do not install a generic UI component library.
- Write and run each behavioral test before its corresponding production implementation.

---

## File Structure

- `package.json`: scripts and locked dependency intent.
- `pnpm-lock.yaml`: resolved dependency versions.
- `tsconfig.json`, `next-env.d.ts`, `next.config.ts`: Next.js and TypeScript configuration.
- `eslint.config.mjs`: Next.js lint rules.
- `vitest.config.ts`, `vitest.setup.ts`: unit-test environment.
- `playwright.config.ts`: local browser-test server and reference viewports.
- `app/layout.tsx`: metadata and optimized font variables.
- `app/page.tsx`: the only route, rendering `LandingPage`.
- `app/globals.css`: tokens, reference geometry, responsive layout, and motion fallbacks.
- `components/landing-page.tsx`: section composition and DOM order.
- `components/brand-mark.tsx`: code-native identity symbol.
- `components/header.tsx`: fixed header and menu state owner.
- `components/menu-overlay.tsx`: accessible full-screen menu.
- `components/hero.tsx`: hero and sticky layout.
- `components/discipline-ticker.tsx`: animated/static discipline track.
- `components/about-section.tsx`: biography section.
- `components/media-placeholder.tsx`: dimension-preserving future-media surface.
- `components/projects-section.tsx`: desktop cards and mobile project rhythm.
- `components/contact-section.tsx`: CTA and footer.
- `components/cursor-follower.tsx`: progressive pointer accent.
- `components/reveal.tsx`: shared Motion reveal primitive.
- `data/site-content.ts`: typed navigation, discipline, project, and social content.
- `tests/landing-page.test.tsx`: structure and content behavior.
- `tests/menu-overlay.test.tsx`: menu keyboard and anchor behavior.
- `tests/media-placeholder.test.tsx`: placeholder semantics.
- `e2e/landing-page.spec.ts`: responsive geometry, overflow, and interaction checks.

---

### Task 1: Scaffold the Next.js and Test Tooling Foundation

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next-env.d.ts`
- Create: `next.config.ts`
- Create: `eslint.config.mjs`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `playwright.config.ts`
- Create: `.gitignore`

**Interfaces:**
- Consumes: The empty repository and bundled pnpm runtime.
- Produces: `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm test:e2e`, and `pnpm build` commands used by every later task.

- [ ] **Step 1: Create the package manifest and configuration**

Create `package.json`:

```json
{
  "name": "ananya-portfolio-landing",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Create `next-env.d.ts`:

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
```

Create `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
```

Create `eslint.config.mjs`:

```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores([".next/**", "playwright-report/**", "test-results/**"]),
]);
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    css: true,
  },
});
```

Create `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
});
```

Create `playwright.config.ts`:

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: "http://127.0.0.1:3000" },
  webServer: {
    command: "pnpm dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

Create `.gitignore`:

```gitignore
node_modules/
.next/
out/
coverage/
playwright-report/
test-results/
.env*
!.env.example
*.tsbuildinfo
```

- [ ] **Step 2: Install the scoped dependencies**

Run:

```powershell
pnpm add next@latest react@latest react-dom@latest motion lucide-react
pnpm add -D typescript @types/node @types/react @types/react-dom eslint eslint-config-next vitest vite @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test
```

Expected: `package.json` and `pnpm-lock.yaml` contain only the approved runtime and test dependencies.

- [ ] **Step 3: Verify the empty test harness**

Run: `pnpm test -- --passWithNoTests`

Expected: exit 0 with no test files discovered.

- [ ] **Step 4: Commit the tooling foundation**

```powershell
git add package.json pnpm-lock.yaml tsconfig.json next-env.d.ts next.config.ts eslint.config.mjs vitest.config.ts vitest.setup.ts playwright.config.ts .gitignore
git commit -m "chore: scaffold Next.js landing page tooling"
```

---

### Task 2: Build the Semantic Landing-Page Structure

**Files:**
- Create: `tests/landing-page.test.tsx`
- Create: `data/site-content.ts`
- Create: `components/landing-page.tsx`
- Create: `components/brand-mark.tsx`
- Create: `components/hero.tsx`
- Create: `components/about-section.tsx`
- Create: `components/projects-section.tsx`
- Create: `components/contact-section.tsx`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`

**Interfaces:**
- Consumes: React, Next.js App Router, and testing harness from Task 1.
- Produces: `LandingPage`, typed `siteContent`, section IDs `home`, `about`, `projects`, and `contact`, and the only route at `/`.

- [ ] **Step 1: Write the failing structure test**

Create `tests/landing-page.test.tsx`:

```tsx
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LandingPage } from "@/components/landing-page";

describe("LandingPage", () => {
  it("renders the approved single-page sections and copy", () => {
    render(<LandingPage />);

    expect(screen.getByRole("heading", { level: 1, name: /design is my favorite way to overthink/i })).toBeInTheDocument();
    expect(document.querySelector("#home")).toBeInTheDocument();
    expect(document.querySelector("#about")).toBeInTheDocument();
    expect(document.querySelector("#projects")).toBeInTheDocument();
    expect(document.querySelector("#contact")).toBeInTheDocument();
  });

  it("contains four projects without inner-route links", () => {
    render(<LandingPage />);
    const projects = screen.getByRole("region", { name: /selected projects/i });

    for (const name of ["adidas x D.O.N.", "Desk Mate", "Ragas & Rhythms", "Bound & Beyond"]) {
      expect(within(projects).getByText(name)).toBeInTheDocument();
    }

    expect(within(projects).queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByText("Side Quests")).not.toBeInTheDocument();
  });

  it("uses the visible email address as the mail target", () => {
    render(<LandingPage />);
    expect(screen.getByRole("link", { name: /ananya\.dezign@gmail\.com/i })).toHaveAttribute(
      "href",
      "mailto:ananya.dezign@gmail.com",
    );
  });
});
```

- [ ] **Step 2: Run the structure test and verify RED**

Run: `pnpm test tests/landing-page.test.tsx`

Expected: FAIL because `@/components/landing-page` does not exist.

- [ ] **Step 3: Add typed content and the minimal semantic components**

Create `data/site-content.ts` with exported `navigation`, `disciplines`, `projects`, and `socials`. Use these exact project records:

```ts
export type Project = {
  title: string;
  discipline: string;
  context: string;
  placeholderLabel: string;
};

export const navigation = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export const disciplines = [
  "Branding",
  "3D",
  "Publication",
  "Packaging",
  "Motion Graphics",
  "Typography",
  "Spatial / Exhibition Design",
  "Layout",
] as const;

export const projects: Project[] = [
  { title: "adidas x D.O.N.", discipline: "Pop-up Store", context: "Retail & Brand Environment | Collaborative Project", placeholderLabel: "PROJECT IMAGE 01" },
  { title: "Desk Mate", discipline: "D2C Lifestyle & Consumer", context: "Branding & Identity | Classroom Project", placeholderLabel: "PROJECT IMAGE 02" },
  { title: "Ragas & Rhythms", discipline: "Publication Design", context: "Design for Print | Classroom Project", placeholderLabel: "PROJECT IMAGE 03" },
  { title: "Bound & Beyond", discipline: "D2C Lifestyle & Consumer", context: "System Thinking | Classroom Project", placeholderLabel: "PROJECT IMAGE 04" },
];

export const socials = [
  { label: "Instagram", href: "https://www.instagram.com/anu.dezign" },
  { label: "Behance", href: "https://www.behance.net/ananyamehrotra2" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/ananya-mehrotra-625495275" },
  { label: "Medium", href: "https://medium.com/@ananyamehrotra1712" },
] as const;
```

Implement `BrandMark`, `Hero`, `AboutSection`, `ProjectsSection`, and `ContactSection` as semantic components. `LandingPage` must render them inside `<main>`, with `Hero` at `#home`, About at `#about`, Projects at `#projects`, and Contact at `#contact`. Project items must be `<article>` elements, not links.

Create `app/layout.tsx` with `Inter`, `IBM_Plex_Mono`, and `Outfit` from `next/font/google`, assign CSS variables, import `app/globals.css`, and set metadata title `Raegan Ricafrente — Communication Designer`.

Create `app/page.tsx`:

```tsx
import { LandingPage } from "@/components/landing-page";

export default function Page() {
  return <LandingPage />;
}
```

Create a minimal `app/globals.css` reset so the semantic test can render without layout assumptions:

```css
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; color: #14181a; background: #fff; font-family: var(--font-outfit), sans-serif; }
button, a { font: inherit; }
```

- [ ] **Step 4: Run the structure test and verify GREEN**

Run: `pnpm test tests/landing-page.test.tsx`

Expected: 3 tests pass.

- [ ] **Step 5: Run type checking**

Run: `pnpm typecheck`

Expected: exit 0 with no TypeScript errors.

- [ ] **Step 6: Commit semantic structure**

```powershell
git add app components data tests/landing-page.test.tsx
git commit -m "feat: add semantic single-page portfolio structure"
```

---

### Task 3: Add Media Placeholder Semantics

**Files:**
- Create: `tests/media-placeholder.test.tsx`
- Create: `components/media-placeholder.tsx`
- Modify: `components/about-section.tsx`
- Modify: `components/projects-section.tsx`

**Interfaces:**
- Consumes: project records from `data/site-content.ts`.
- Produces: `MediaPlaceholder({ label, description, kind, className })` used by About and Projects.

- [ ] **Step 1: Write the failing placeholder test**

Create `tests/media-placeholder.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MediaPlaceholder } from "@/components/media-placeholder";

describe("MediaPlaceholder", () => {
  it("labels a future image without pretending to be an image", () => {
    render(<MediaPlaceholder label="PROJECT IMAGE 01" description="Future adidas project image" kind="image" />);
    const frame = screen.getByRole("group", { name: "Future adidas project image" });
    expect(frame).toHaveAttribute("data-media-kind", "image");
    expect(screen.getByText("PROJECT IMAGE 01")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `pnpm test tests/media-placeholder.test.tsx`

Expected: FAIL because `MediaPlaceholder` does not exist.

- [ ] **Step 3: Implement the placeholder and integrate five frames**

Create `components/media-placeholder.tsx`:

```tsx
type MediaPlaceholderProps = {
  label: string;
  description: string;
  kind: "image" | "video";
  className?: string;
};

export function MediaPlaceholder({ label, description, kind, className = "" }: MediaPlaceholderProps) {
  return (
    <div
      className={`media-placeholder ${className}`.trim()}
      data-media-kind={kind}
      role="group"
      aria-label={description}
    >
      <span className="media-placeholder__cross" aria-hidden="true" />
      <span className="media-placeholder__label">{label}</span>
    </div>
  );
}
```

Use one `PORTRAIT IMAGE` placeholder in About and map all four `placeholderLabel` values into Projects. Add no `<img>` or `<video>` elements.

- [ ] **Step 4: Run placeholder and page tests and verify GREEN**

Run: `pnpm test tests/media-placeholder.test.tsx tests/landing-page.test.tsx`

Expected: 4 tests pass.

- [ ] **Step 5: Commit placeholders**

```powershell
git add components/media-placeholder.tsx components/about-section.tsx components/projects-section.tsx tests/media-placeholder.test.tsx
git commit -m "feat: add dimension-ready media placeholders"
```

---

### Task 4: Implement the Accessible Full-Screen Menu

**Files:**
- Create: `tests/menu-overlay.test.tsx`
- Create: `components/header.tsx`
- Create: `components/menu-overlay.tsx`
- Modify: `components/landing-page.tsx`

**Interfaces:**
- Consumes: `navigation` and `socials` from `data/site-content.ts`.
- Produces: `Header` with accessible open/close state, Escape dismissal, focus return, body scroll lock, and anchor selection.

- [ ] **Step 1: Write the failing menu tests**

Create `tests/menu-overlay.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Header } from "@/components/header";

afterEach(() => { document.body.style.overflow = ""; });

describe("Header menu", () => {
  it("opens, locks scrolling, closes with Escape, and restores focus", async () => {
    const user = userEvent.setup();
    render(<Header />);
    const trigger = screen.getByRole("button", { name: /open menu/i });

    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: /site menu/i })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: /site menu/i })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("contains only same-page navigation and closes after selection", async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByRole("button", { name: /open menu/i }));

    const projects = screen.getByRole("link", { name: "Projects" });
    expect(projects).toHaveAttribute("href", "#projects");
    expect(screen.queryByText("Side Quests")).not.toBeInTheDocument();

    await user.click(projects);
    expect(screen.queryByRole("dialog", { name: /site menu/i })).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests and verify RED**

Run: `pnpm test tests/menu-overlay.test.tsx`

Expected: FAIL because `Header` does not exist.

- [ ] **Step 3: Implement Header and MenuOverlay**

`Header` is a client component that owns `open`, a trigger ref, and `closeMenu`. `MenuOverlay` is rendered only while open. Use Motion for opacity and vertical entrance, but keep semantic button and link elements.

`MenuOverlay` must:

- render `role="dialog"`, `aria-modal="true"`, and `aria-label="Site menu"`;
- focus its Close button on mount;
- listen for Escape;
- set `document.body.style.overflow = "hidden"` while mounted and restore the previous value on cleanup;
- call `onClose` on every navigation selection;
- render résumé, email, and social links after navigation;
- return focus to the Menu trigger when closed.

Use this exact header interface:

```tsx
export function Header(): React.ReactElement;

type MenuOverlayProps = {
  onClose: () => void;
};
```

Mount `<Header />` before `<main>` in `LandingPage`.

- [ ] **Step 4: Run menu tests and verify GREEN**

Run: `pnpm test tests/menu-overlay.test.tsx`

Expected: 2 tests pass with no act warnings.

- [ ] **Step 5: Run all unit tests**

Run: `pnpm test`

Expected: all tests pass.

- [ ] **Step 6: Commit menu behavior**

```powershell
git add components/header.tsx components/menu-overlay.tsx components/landing-page.tsx tests/menu-overlay.test.tsx
git commit -m "feat: add accessible full-screen navigation"
```

---

### Task 5: Add Progressive Motion and Cursor Behavior

**Files:**
- Create: `components/reveal.tsx`
- Create: `components/discipline-ticker.tsx`
- Create: `components/cursor-follower.tsx`
- Modify: `components/hero.tsx`
- Modify: `components/projects-section.tsx`
- Modify: `components/contact-section.tsx`
- Modify: `components/landing-page.tsx`
- Modify: `tests/landing-page.test.tsx`

**Interfaces:**
- Consumes: Motion and `disciplines`.
- Produces: `Reveal`, `DisciplineTicker`, and `CursorFollower` with reduced-motion-safe static behavior.

- [ ] **Step 1: Extend the failing landing-page test**

Add this test:

```tsx
it("keeps animated content represented once in the accessibility tree", () => {
  render(<LandingPage />);
  expect(screen.getAllByRole("heading", { name: /projects/i })).toHaveLength(1);
  expect(screen.getAllByText("Motion Graphics")).toHaveLength(1);
  expect(screen.getByTestId("cursor-follower")).toHaveAttribute("aria-hidden", "true");
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `pnpm test tests/landing-page.test.tsx`

Expected: FAIL because the ticker and cursor follower are not implemented.

- [ ] **Step 3: Implement progressive motion primitives**

Create `Reveal` as a client component using `motion.div`, `useReducedMotion`, and `whileInView`. For reduced motion, render the final state immediately.

Create `DisciplineTicker` as one semantic `<ul aria-label="Design disciplines">`; duplicate visual tracks must use `aria-hidden="true"` so each label appears only once to assistive technology.

Create `CursorFollower` as a fixed `motion.span` with `data-testid="cursor-follower"` and `aria-hidden="true"`. Attach `pointermove` only when `(pointer: fine)` and reduced motion is false. Never hide or replace the system cursor.

Integrate Reveal with section labels and supporting copy, ticker in Hero, cursor at page level, and repeated-label button visuals with a single accessible label.

- [ ] **Step 4: Run the updated test and verify GREEN**

Run: `pnpm test tests/landing-page.test.tsx`

Expected: all landing-page tests pass.

- [ ] **Step 5: Commit progressive motion**

```powershell
git add components tests/landing-page.test.tsx
git commit -m "feat: add reduced-motion-safe interactions"
```

---

### Task 6: Implement Pixel-Calibrated Responsive Styling

**Files:**
- Create: `e2e/landing-page.spec.ts`
- Modify: `app/globals.css`
- Modify: all visual components only where class hooks are required.

**Interfaces:**
- Consumes: semantic and interactive DOM from Tasks 2–5.
- Produces: desktop and mobile layouts matching the inspected reference geometry.

- [ ] **Step 1: Write the failing browser geometry tests**

Create `e2e/landing-page.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("desktop layout keeps the editorial grid and menu overlay", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Design is my");
  const projects = page.locator("#projects");
  await expect(projects).toBeVisible();
  await expect(projects.locator("article")).toHaveCount(4);

  await page.getByRole("button", { name: /open menu/i }).click();
  await expect(page.getByRole("dialog", { name: /site menu/i })).toHaveScreenshot("desktop-menu.png");
});

test("mobile layout has no document overflow and keeps bounded horizontal tracks", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const sizes = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(sizes.scroll).toBe(sizes.client);

  const aboutTop = await page.locator("#about").evaluate((node) => node.getBoundingClientRect().top + window.scrollY);
  const projectsTop = await page.locator("#projects").evaluate((node) => node.getBoundingClientRect().top + window.scrollY);
  expect(aboutTop).toBeLessThan(projectsTop);
  await expect(page).toHaveScreenshot("mobile-landing.png", { fullPage: true });
});
```

- [ ] **Step 2: Start the app and run the tests to verify RED**

Run: `pnpm test:e2e`

Expected: FAIL because the reference layout and screenshot baselines do not exist.

- [ ] **Step 3: Implement design tokens and desktop geometry**

Expand `app/globals.css` with:

- font variables and sizes matching the spec;
- `--page-gutter: 50px`, `--header-height: 93px`, `--ink: #14181a`, `--paper: #fff`, `--accent: #287cf5`;
- fixed header above content;
- hero min-height and sticky inner frame;
- 98px IBM Plex Mono hero headline and 92px Projects heading;
- two-column project grid with equal columns, 450–500px desktop card height, rounded corners, bottom metadata overlays, and neutral placeholder fills;
- split About composition with portrait placeholder and biography;
- full-width contact/footer geometry and large faded identity mark;
- dark full-screen menu with vertical grid lines and right-aligned navigation.

Use CSS grid/flex rather than absolute positioning for primary structure. Restrict absolute positioning to decorative marks, overlays, and reference-aligned labels.

- [ ] **Step 4: Implement the 809px and 1199px breakpoint behavior**

At `max-width: 1199px`, scale display type and card heights fluidly with `clamp()` while keeping the two-column grid. At `max-width: 809px`:

- set `--page-gutter: 28px`;
- reduce the hero headline to `clamp(29px, 8vw, 42px)`;
- order About before Projects;
- stack project entries;
- present title and placeholder as the inspected alternating mobile rhythm;
- make discipline movement live in an `overflow-x: auto` container;
- hide the cursor follower;
- ensure every full-bleed visual remains inside a document-width clipping wrapper.

Add a global guard:

```css
html, body { max-width: 100%; overflow-x: clip; }
```

Add reduced-motion behavior:

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 5: Generate and inspect the initial screenshots**

Run: `pnpm test:e2e -- --update-snapshots`

Expected: desktop menu and mobile page baselines are written. Inspect them against the recorded source measurements; do not treat baseline creation as proof of fidelity.

- [ ] **Step 6: Run browser tests and verify GREEN**

Run: `pnpm test:e2e`

Expected: both tests pass, including exact 390px overflow equality.

- [ ] **Step 7: Commit responsive styling and baselines**

```powershell
git add app/globals.css components e2e
git commit -m "feat: match responsive portfolio composition"
```

---

### Task 7: Final Verification and Handoff Preparation

**Files:**
- Modify: `README.md`
- Modify: any implementation file only if a verification failure requires a test-first correction.

**Interfaces:**
- Consumes: the complete landing page.
- Produces: verified local delivery instructions and evidence for handoff.

- [ ] **Step 1: Add concise project documentation**

Create `README.md` containing:

```markdown
# Ananya Portfolio Landing Page

Single-page Next.js recreation of the Raegan Ricafrente portfolio homepage.

## Commands

- `pnpm dev` — local development
- `pnpm test` — unit and interaction tests
- `pnpm test:e2e` — responsive browser checks
- `pnpm lint` — ESLint
- `pnpm typecheck` — TypeScript
- `pnpm build` — production build

## Media replacement

Project and portrait media are intentionally represented by labeled placeholders. Replace their future source metadata in `data/site-content.ts` without changing the layout components.
```

- [ ] **Step 2: Run the full unit-test suite**

Run: `pnpm test`

Expected: all tests pass with zero warnings.

- [ ] **Step 3: Run lint and type checks**

Run:

```powershell
pnpm lint
pnpm typecheck
```

Expected: both commands exit 0.

- [ ] **Step 4: Run browser verification**

Run: `pnpm test:e2e`

Expected: desktop and mobile checks pass with no screenshot differences and no overflow failure.

- [ ] **Step 5: Run the production build**

Run: `pnpm build`

Expected: Next.js exits 0 and reports `/` as the only intentionally implemented application route.

- [ ] **Step 6: Review repository scope**

Run:

```powershell
git status --short
rg --files app
rg -n "Side Quests|href=\"/(projects|about|contact|showcase)" app components data
```

Expected: only expected final files are uncommitted; `app` contains only `layout.tsx`, `page.tsx`, and `globals.css`; prohibited route text and inner hrefs are absent.

- [ ] **Step 7: Commit final documentation**

```powershell
git add README.md
git commit -m "docs: add landing page development guide"
```

- [ ] **Step 8: Record the final verification evidence**

Run:

```powershell
git status --short
git log --oneline -8
```

Expected: clean status and a traceable series of design, tooling, feature, interaction, styling, and documentation commits.

---

## Plan Self-Review

- Every approved section and exclusion maps to an implementation task and an acceptance check.
- Component and data interfaces use consistent names across tasks.
- No inner route, form, backend, CMS, or real media work is included.
- Test-first steps precede semantic, placeholder, menu, motion, and responsive behavior implementations.
- Configuration scaffolding is isolated from production behavior.
- No incomplete markers or deferred implementation instructions remain.
