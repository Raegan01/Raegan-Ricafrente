# Recording-Fidelity Landing Page Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the existing single-page Next.js portfolio so its desktop layout, native scrolling, motion, and interactions match the supplied recording while all media remains represented by neutral placeholders.

**Architecture:** Keep the current App Router entry point and split the landing page into focused section components backed by typed content data. Use CSS Grid and normal document flow for layout, Motion only for the ticker, restrained reveals, menu transition, and an 18-segment pointer trail, and Playwright screenshots at recorded scroll states for visual calibration.

**Tech Stack:** Next.js 16, React 19, TypeScript 6, CSS, Motion 12, Lucide React, Vitest, Testing Library, Playwright

## Global Constraints

- The supplied 2560 × 1440 desktop recording is the visual and behavioral source of truth; the captured page viewport used by the browser tests is 2542 × 1261.
- The desktop editorial canvas is approximately 1320px wide and centered.
- The result remains one landing page with no project, About, résumé, or contact inner routes.
- Exactly three projects appear: `Desk Mate`, `Ragas & Rhythms`, and `Bound & Beyond`.
- Every project image, video, and portrait remains a neutral placeholder with the recorded dimensions and clipping.
- Browser chrome, recorder overlays, and the `Made in Framer` badge are excluded.
- Header brand, menu, and availability label remain fixed; hero and sections use normal document flow and native smooth scrolling without scroll snapping.
- Menu and footer navigation use landing-page anchors only.
- `View Resume` uses the already supplied external `resumeHref`; email CTAs use the existing `mailto:ananya.dezign@gmail.com` target.
- Touch/coarse-pointer devices do not render the cursor trail, and reduced-motion users do not receive continuous or spring-driven motion.
- No new dependency is required.
- Preserve unrelated working-tree changes, including the generated `next-env.d.ts` modification; stage only files named by each task.

## File Structure

- Modify `data/site-content.ts`: define the three recorded projects and their layout/tone metadata.
- Modify `components/landing-page.tsx`: compose sections in recorded order.
- Modify `components/header.tsx`: own all fixed top-level controls, including availability.
- Modify `components/hero.tsx`: remove fixed/sticky-only content and keep the editorial hero in normal flow.
- Create `components/project-card.tsx`: render feature and standard project variants.
- Modify `components/projects-section.tsx`: render the recorded heading and three-card arrangement.
- Modify `components/about-section.tsx`: render the two-column About layout and layered portrait placeholder.
- Create `components/cta-prelude.tsx`: render the centered résumé and email call-to-action block.
- Create `components/footer.tsx`: render the contact footer, social controls, sitemap, and oversized mark.
- Delete `components/contact-section.tsx` after its responsibilities move to `CtaPrelude` and `Footer`.
- Create `components/cursor-trail.tsx` and delete `components/cursor-follower.tsx`: implement the 18-segment pointer trail.
- Modify `components/discipline-ticker.tsx`: make continuous motion conditional on reduced-motion preference.
- Modify `components/reveal.tsx`: use the short recorded entrance treatment.
- Modify `components/media-placeholder.tsx`: keep placeholder surfaces decorative while retaining deterministic test metadata.
- Modify `app/globals.css`: define desktop geometry, section layouts, responsive stacking, and motion states.
- Modify `tests/landing-page.test.tsx`: enforce content, order, controls, and trail contract.
- Modify `tests/menu-overlay.test.tsx`: enforce same-page navigation and résumé/email behavior.
- Modify `e2e/landing-page.spec.ts`: verify desktop geometry, recorded scroll states, mobile reflow, reduced motion, and absence of inner navigation.
- Update `e2e/landing-page.spec.ts-snapshots/*.png`: store reviewed screenshots for the new composition.

---

### Task 1: Lock the recorded content and section order

**Files:**
- Modify: `tests/landing-page.test.tsx`
- Modify: `tests/media-placeholder.test.tsx`
- Modify: `data/site-content.ts`
- Modify: `components/landing-page.tsx`
- Modify: `components/media-placeholder.tsx`

**Interfaces:**
- Consumes: existing `Project`, `projects`, `AboutSection`, `ProjectsSection`, and `ContactSection`
- Produces: `Project.layout: "feature" | "standard"`, `Project.tone: "desk" | "ragas" | "bound"`, three-project data, and Projects-before-About document order

- [ ] **Step 1: Replace the four-project test with a failing three-project and order contract**

Add these assertions to `tests/landing-page.test.tsx`:

```tsx
it("renders the recorded three-project composition without inner links", () => {
  render(<LandingPage />);
  const section = screen.getByRole("region", { name: /selected projects/i });

  expect(within(section).getAllByRole("article")).toHaveLength(3);
  expect(within(section).getByText("Desk Mate")).toBeInTheDocument();
  expect(within(section).getByText("Ragas & Rhythms")).toBeInTheDocument();
  expect(within(section).getByText("Bound & Beyond")).toBeInTheDocument();
  expect(within(section).queryByText("adidas x D.O.N.")).not.toBeInTheDocument();
  expect(within(section).queryByRole("link")).not.toBeInTheDocument();
});

it("orders projects, about, CTA, and footer like the recording", () => {
  render(<LandingPage />);
  const projects = document.querySelector("#projects")!;
  const about = document.querySelector("#about")!;
  const contact = document.querySelector("#contact")!;

  expect(projects.compareDocumentPosition(about)).toBe(
    Node.DOCUMENT_POSITION_FOLLOWING,
  );
  expect(about.compareDocumentPosition(contact)).toBe(
    Node.DOCUMENT_POSITION_FOLLOWING,
  );
});
```

- [ ] **Step 2: Run the focused test and confirm the red state**

Run: `pnpm test tests/landing-page.test.tsx`

Expected: FAIL because four project articles render and About precedes Projects.

- [ ] **Step 3: Replace the project model and collection with the recorded three entries**

Use this model and collection in `data/site-content.ts`, retaining the existing `navigation`, `disciplines`, `socials`, and `resumeHref` exports unchanged:

```ts
export type Project = {
  title: string;
  discipline: string;
  context: string;
  placeholderLabel: string;
  layout: "feature" | "standard";
  tone: "desk" | "ragas" | "bound";
};

export const projects: Project[] = [
  {
    title: "Desk Mate",
    discipline: "D2C Lifestyle & Consumer",
    context: "Branding & Identity | Classroom Project",
    placeholderLabel: "PROJECT IMAGE 01",
    layout: "feature",
    tone: "desk",
  },
  {
    title: "Ragas & Rhythms",
    discipline: "Publication Design",
    context: "Design for Print | Classroom Project",
    placeholderLabel: "PROJECT IMAGE 02",
    layout: "standard",
    tone: "ragas",
  },
  {
    title: "Bound & Beyond",
    discipline: "D2C Lifestyle & Consumer",
    context: "System Thinking | Classroom Project",
    placeholderLabel: "PROJECT IMAGE 03",
    layout: "standard",
    tone: "bound",
  },
];
```

- [ ] **Step 4: Put Projects before About without changing the contact component yet**

Use this temporary composition in `components/landing-page.tsx`:

```tsx
export function LandingPage() {
  return (
    <>
      <Header />
      <CursorFollower />
      <main>
        <Hero />
        <div className="landing-flow">
          <ProjectsSection />
          <AboutSection />
        </div>
        <ContactSection />
      </main>
    </>
  );
}
```

- [ ] **Step 5: Make media placeholders decorative**

Replace the expectation in `tests/media-placeholder.test.tsx` with:

```tsx
const frame = screen.getByTestId("media-placeholder");
expect(frame).toHaveAttribute("data-media-kind", "image");
expect(frame).toHaveAttribute("data-description", "Future adidas project image");
expect(frame).toHaveAttribute("aria-hidden", "true");
expect(screen.queryByRole("group")).not.toBeInTheDocument();
expect(screen.queryByRole("img")).not.toBeInTheDocument();
```

Update the wrapper in `components/media-placeholder.tsx` to:

```tsx
<div
  aria-hidden="true"
  className={`media-placeholder ${className}`.trim()}
  data-description={description}
  data-media-kind={kind}
  data-testid="media-placeholder"
>
  <span className="media-placeholder__cross" aria-hidden="true" />
  <span className="media-placeholder__label">{label}</span>
</div>
```

- [ ] **Step 6: Run the focused unit suite**

Run: `pnpm test tests/landing-page.test.tsx tests/media-placeholder.test.tsx`

Expected: PASS for the three-project, section-order, email, cursor-count, and decorative-placeholder assertions.

- [ ] **Step 7: Commit the recorded content contract**

```powershell
git add -- tests/landing-page.test.tsx tests/media-placeholder.test.tsx data/site-content.ts components/landing-page.tsx components/media-placeholder.tsx
git commit -m "test: lock recorded landing page content"
```

### Task 2: Convert the header and hero to the recorded document flow

**Files:**
- Modify: `e2e/landing-page.spec.ts`
- Modify: `components/header.tsx`
- Modify: `components/hero.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `Header`, `Hero`, `.site-header__inner`, `.hero__grid`, `.hero__canvas`
- Produces: `.site-header__availability`, a fixed top shell, and a normal-flow `100svh` desktop hero

- [ ] **Step 1: Add a failing fixed-shell and normal-flow geometry test**

Add this Playwright test before the existing screenshot tests:

```ts
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
  expect(heroBox!.height).toBeCloseTo(1261, 1);
  expect(projectsTop).toBeCloseTo(heroBox!.height, 1);
});
```

- [ ] **Step 2: Run the geometry test and confirm the red state**

Run: `pnpm exec playwright test e2e/landing-page.spec.ts --grep "fixed controls"`

Expected: FAIL because availability still belongs to Hero and the desktop hero is sticky inside a taller stage.

- [ ] **Step 3: Move availability into the fixed header**

Inside `.site-header__inner` in `components/header.tsx`, render the availability label after the brand and before the menu button:

```tsx
<p className="site-header__availability">[ Available for project ]</p>
```

Remove `.hero__availability` from `components/hero.tsx`. Keep the grid, canvas, headline, supporting copy, role, and ticker unchanged.

- [ ] **Step 4: Replace sticky desktop hero behavior with normal flow**

Apply these base and desktop rules in `app/globals.css`, preserving the existing centered canvas anchors:

```css
.hero-stage {
  position: relative;
  z-index: 1;
  height: 100svh;
  min-height: 760px;
  background: var(--paper);
}

.hero {
  position: relative;
  height: 100%;
  background: var(--paper);
}

.site-header__availability {
  position: fixed;
  z-index: 51;
  top: 98px;
  right: max(var(--page-gutter), calc((100vw - var(--desktop-canvas)) / 2));
  margin: 0;
  font-size: 16px;
  letter-spacing: 0.052em;
  pointer-events: none;
}

@media (min-width: 1200px) {
  .hero-stage {
    height: 100svh;
  }

  .hero {
    height: 100%;
    padding: 0;
  }
}
```

In the mobile media query, set `.site-header__availability { top: 99px; right: 36px; font-size: 11px; }` and remove the old mobile `.hero__availability` rule.

- [ ] **Step 5: Run the focused geometry test**

Run: `pnpm exec playwright test e2e/landing-page.spec.ts --grep "fixed controls"`

Expected: PASS; hero height is within one pixel of the viewport height and Projects begins immediately after it.

- [ ] **Step 6: Commit the fixed shell and hero flow**

```powershell
git add -- e2e/landing-page.spec.ts components/header.tsx components/hero.tsx app/globals.css
git commit -m "fix: match recorded hero scroll behavior"
```

### Task 3: Build the asymmetric three-project showcase

**Files:**
- Create: `components/project-card.tsx`
- Modify: `components/projects-section.tsx`
- Modify: `app/globals.css`
- Modify: `tests/landing-page.test.tsx`

**Interfaces:**
- Consumes: `Project` from `data/site-content.ts` and `MediaPlaceholder`
- Produces: `ProjectCard({ project }: { project: Project })`, `.project-card--feature`, and `.project-card--standard`

- [ ] **Step 1: Add failing variant assertions**

Append to the three-project test in `tests/landing-page.test.tsx`:

```tsx
const cards = within(section).getAllByRole("article");
expect(cards[0]).toHaveClass("project-card--feature", "project-card--desk");
expect(cards[1]).toHaveClass("project-card--standard", "project-card--ragas");
expect(cards[2]).toHaveClass("project-card--standard", "project-card--bound");
expect(within(cards[0]).getByRole("button", { name: /open desk mate project/i })).toBeDisabled();
```

- [ ] **Step 2: Run the unit test and confirm the red state**

Run: `pnpm test tests/landing-page.test.tsx`

Expected: FAIL because the variant classes and decorative project control do not exist.

- [ ] **Step 3: Create the project-card component**

Create `components/project-card.tsx` with:

```tsx
import { ArrowUpRight } from "lucide-react";
import { MediaPlaceholder } from "@/components/media-placeholder";
import type { Project } from "@/data/site-content";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      className={`project-card project-card--${project.layout} project-card--${project.tone}`}
    >
      <MediaPlaceholder
        className="project-card__media"
        description={`Future ${project.title} project image`}
        kind="image"
        label={project.placeholderLabel}
      />
      <div className="project-card__content">
        <div>
          <h3>{project.title}</h3>
          <p>{project.discipline}</p>
          <p>{project.context}</p>
        </div>
        <button
          aria-label={`Open ${project.title} project`}
          className="project-card__arrow"
          disabled
          type="button"
        >
          <ArrowUpRight aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
```

- [ ] **Step 4: Make ProjectsSection use the recorded canvas and ProjectCard**

Replace the component body in `components/projects-section.tsx` with:

```tsx
export function ProjectsSection() {
  return (
    <section className="projects-section" id="projects" aria-label="Selected projects">
      <div className="section-canvas">
        <Reveal className="section-heading-row">
          <div>
            <p className="eyebrow">[ Project ]</p>
            <h2 id="projects-title">Projects</h2>
            <p className="projects-section__intro">
              <em>What looks effortless here is the result of deliberate overthinking.</em>
            </p>
          </div>
          <span className="button button--dark" aria-hidden="true">See them all</span>
        </Reveal>
        <div className="projects-grid" id="projects-grid">
          {projects.map((project) => <ProjectCard key={project.title} project={project} />)}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Replace the project layout rules with explicit feature and standard variants**

Define the following desktop structure in `app/globals.css`; retain the existing placeholder base styles:

```css
.section-canvas {
  width: min(var(--desktop-canvas), calc(100vw - 100px));
  margin: 0 auto;
}

.projects-section {
  padding: 0 0 128px;
  border-top: 1px solid var(--line);
  background: var(--paper);
}

.section-heading-row {
  display: flex;
  min-height: 286px;
  align-items: flex-end;
  justify-content: space-between;
  padding: 76px 0 44px;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.project-card {
  overflow: hidden;
  border-radius: 12px;
  background: #ecebea;
  transition: transform 260ms ease;
}

.project-card:hover {
  transform: translateY(-3px);
}

.project-card--feature {
  display: grid;
  min-height: 488px;
  grid-column: 1 / -1;
  grid-template-columns: 40% 60%;
}

.project-card--feature .project-card__content {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 42px;
  color: var(--ink);
  background: #9fa995;
}

.project-card--standard {
  display: flex;
  min-height: 585px;
  flex-direction: column;
}

.project-card--standard .project-card__media {
  min-height: 450px;
  flex: 1;
}

.project-card--standard .project-card__content {
  display: flex;
  min-height: 135px;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px;
  color: var(--ink);
  background: var(--paper);
}

.project-card__content h3 {
  margin: 0 0 8px;
  font-family: "IBM Plex Mono", monospace;
  font-size: 32px;
  font-weight: 600;
  line-height: 1.08;
}

.project-card__content p {
  margin: 3px 0 0;
  font-size: 12px;
}

.project-card__arrow {
  display: grid;
  width: 52px;
  height: 52px;
  flex: none;
  place-items: center;
  border: 1px solid currentColor;
  border-radius: 50%;
  color: inherit;
  background: transparent;
}
```

Add these neutral media tones without bitmap assets:

```css
.project-card--desk .media-placeholder {
  --placeholder-start: #d2d1ca;
  --placeholder-end: #a9ada5;
}

.project-card--ragas .media-placeholder {
  --placeholder-start: #d6d0c5;
  --placeholder-end: #aaa397;
}

.project-card--bound .media-placeholder {
  --placeholder-start: #333636;
  --placeholder-end: #17191a;
  color: rgba(255, 255, 255, 0.62);
}
```

- [ ] **Step 6: Run the unit suite and inspect the desktop section**

Run: `pnpm test tests/landing-page.test.tsx`

Expected: PASS for project count, names, variant classes, and absence of project links.

- [ ] **Step 7: Commit the showcase**

```powershell
git add -- components/project-card.tsx components/projects-section.tsx app/globals.css tests/landing-page.test.tsx
git commit -m "feat: recreate recorded project showcase"
```

### Task 4: Rebuild About, CTA prelude, and footer

**Files:**
- Modify: `components/about-section.tsx`
- Create: `components/cta-prelude.tsx`
- Create: `components/footer.tsx`
- Modify: `components/landing-page.tsx`
- Delete: `components/contact-section.tsx`
- Modify: `app/globals.css`
- Modify: `tests/landing-page.test.tsx`

**Interfaces:**
- Consumes: `MediaPlaceholder`, `Reveal`, `resumeHref`, `socials`, and landing-page anchors
- Produces: `CtaPrelude`, `Footer`, `.about-section__portrait-stack`, `.cta-prelude`, and `.site-footer`

- [ ] **Step 1: Add failing semantic CTA and footer assertions**

Add to `tests/landing-page.test.tsx`:

```tsx
it("keeps the résumé and email CTAs and omits inner-page destinations", () => {
  render(<LandingPage />);

  expect(screen.getByRole("link", { name: /view resume/i })).toHaveAttribute(
    "href",
    expect.stringContaining("drive.google.com"),
  );
  expect(screen.getByRole("link", { name: /say hello/i })).toHaveAttribute(
    "href",
    "mailto:ananya.dezign@gmail.com",
  );
  expect(screen.getByRole("link", { name: /contact me/i })).toHaveAttribute(
    "href",
    "mailto:ananya.dezign@gmail.com",
  );
  expect(screen.queryByRole("link", { name: /learn more/i })).not.toBeInTheDocument();
  expect(screen.queryByText("Side Quests")).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test and confirm the red state**

Run: `pnpm test tests/landing-page.test.tsx`

Expected: FAIL because `Contact Me` is absent and `Learn More` is currently an anchor.

- [ ] **Step 3: Replace About with the recorded two-column structure**

In `components/about-section.tsx`, keep the approved copy but use this structural body:

```tsx
<section className="about-section" id="about" aria-labelledby="about-title">
  <div className="section-canvas about-section__grid">
    <div className="about-section__visual">
      <p className="eyebrow">[ About ]</p>
      <p className="about-section__kicker">Why Choose Me</p>
      <div className="about-section__portrait-stack">
        <span aria-hidden="true" className="about-section__portrait-layer" />
        <MediaPlaceholder
          className="about-section__portrait"
          description="Future portrait illustration of Ananya Mehrotra"
          kind="image"
          label="PORTRAIT IMAGE"
        />
      </div>
    </div>
    <Reveal className="about-section__content">
      <h2 id="about-title">Hi, I&apos;m Ananya Mehrotra</h2>
      <h3>Communication Designer</h3>
      <p className="about-section__copy">
        who blends logic with creativity to craft minimal, thoughtful work,
        with a strong foundation in typography, branding, and digital design.
        I enjoy building visual systems that feel clear, intentional, and
        emotionally resonant, bringing a calm, research-first mindset to
        every design challenge and a love for creating work that fosters
        clarity and connection.
      </p>
      <span className="button button--dark" aria-hidden="true">Learn More</span>
    </Reveal>
  </div>
</section>
```

- [ ] **Step 4: Create the CTA prelude**

Create `components/cta-prelude.tsx`:

```tsx
import { Reveal } from "@/components/reveal";
import { resumeHref } from "@/data/site-content";

export function CtaPrelude() {
  return (
    <section className="cta-prelude" aria-labelledby="cta-prelude-title">
      <Reveal className="cta-prelude__inner">
        <h2 id="cta-prelude-title">Every design starts with a thought worth exploring</h2>
        <p>Let&apos;s talk and create something unforgettable.</p>
        <div className="cta-prelude__actions">
          <a className="button" href={resumeHref} rel="noreferrer" target="_blank">
            View Resume <span className="button__dot" aria-hidden="true" />
          </a>
          <a className="button button--dark" href="mailto:ananya.dezign@gmail.com">
            Say Hello!
          </a>
        </div>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 5: Create the contact footer**

Create `components/footer.tsx` with the recorded heading split, email CTA, social list, landing sitemap, and oversized mark:

```tsx
import { socials } from "@/data/site-content";

export function Footer() {
  return (
    <footer className="site-footer" id="contact" aria-labelledby="contact-title">
      <div className="section-canvas site-footer__grid">
        <div>
          <h2 id="contact-title">
            Let&apos;s create something
            <span>awesome together.</span>
          </h2>
          <a className="site-footer__email" href="mailto:ananya.dezign@gmail.com">
            ananya.dezign@gmail.com
          </a>
          <ul className="social-list" aria-label="Social links">
            {socials.map((social) => (
              <li key={social.label}>
                <a href={social.href} rel="noreferrer" target="_blank">{social.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="site-footer__aside">
          <a className="button button--dark" href="mailto:ananya.dezign@gmail.com">Contact Me</a>
          <nav aria-label="Footer">
            <p>Sitemap</p>
            <a href="#home">Home</a>
            <a href="#projects">Projects</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
        <span className="site-footer__mark" aria-hidden="true">a.</span>
      </div>
      <small>© 2026 Ananya Mehrotra. All rights reserved.</small>
    </footer>
  );
}
```

- [ ] **Step 6: Compose the extracted sections and remove ContactSection**

Update `components/landing-page.tsx` to render `<CtaPrelude />` and `<Footer />` after `<AboutSection />`, then delete `components/contact-section.tsx` and its import.

- [ ] **Step 7: Implement the recorded About, CTA, and footer geometry**

Use these desktop anchors in `app/globals.css`:

```css
.about-section {
  padding: 92px 0 132px;
  border-top: 1px solid var(--line);
}

.about-section__grid {
  display: grid;
  grid-template-columns: 42% 58%;
  gap: 34px;
}

.about-section__portrait-stack {
  position: relative;
  width: 320px;
  height: 405px;
  margin: 52px 0 0 38px;
}

.about-section__portrait-layer,
.about-section__portrait {
  position: absolute;
  inset: 0;
  border-radius: 34px 34px 96px 34px;
}

.about-section__portrait-layer {
  background: #c8c8c3;
  transform: rotate(7deg) translate(14px, 4px);
}

.about-section__portrait {
  transform: rotate(-3deg);
}

.cta-prelude {
  padding: 124px 0 116px;
  border-top: 1px solid var(--line);
  text-align: center;
}

.cta-prelude__inner {
  width: min(720px, calc(100vw - 56px));
  margin: 0 auto;
}

.cta-prelude__actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 36px;
}

.site-footer {
  position: relative;
  overflow: hidden;
  border-top: 1px solid var(--line);
}

.site-footer__grid {
  position: relative;
  display: grid;
  min-height: 560px;
  grid-template-columns: 1fr 210px;
  gap: 64px;
  padding-top: 52px;
  padding-bottom: 90px;
}

.site-footer__mark {
  position: absolute;
  right: 260px;
  bottom: -118px;
  color: #e5e6e7;
  font-family: "IBM Plex Mono", monospace;
  font-size: 420px;
  font-weight: 700;
  line-height: 1;
}

.about-section__kicker {
  margin-top: 34px;
  font-family: "IBM Plex Mono", monospace;
  font-size: 24px;
  font-weight: 600;
}

.about-section__content {
  padding-top: 44px;
}

.about-section__content h2 {
  margin-bottom: 28px;
  font-size: 20px;
  font-weight: 650;
}

.about-section__content h3 {
  max-width: 760px;
  margin-bottom: 18px;
  font-family: "IBM Plex Mono", monospace;
  font-size: clamp(48px, 4.6vw, 72px);
  font-weight: 600;
  line-height: 1.12;
}

.about-section__copy {
  max-width: 700px;
  color: #4e5355;
  font-size: 18px;
  line-height: 1.45;
}

.about-section__content .button {
  margin-top: 42px;
}

.site-footer h2 {
  font-family: "IBM Plex Mono", monospace;
  font-size: 46px;
  font-weight: 600;
  line-height: 1.28;
}

.site-footer h2 span {
  display: block;
  color: #a4a7a8;
}

.site-footer__email {
  display: inline-block;
  margin-top: 28px;
  font-family: "IBM Plex Mono", monospace;
  font-size: 14px;
}

.site-footer__aside {
  position: relative;
  z-index: 2;
}

.site-footer__aside nav {
  display: flex;
  flex-direction: column;
  gap: 17px;
  margin-top: 70px;
  font-size: 14px;
}

.site-footer__aside nav p {
  padding-bottom: 17px;
  border-bottom: 1px solid var(--line);
  font-family: "IBM Plex Mono", monospace;
  font-size: 16px;
  font-weight: 600;
}

.site-footer > small {
  display: block;
  padding: 18px var(--page-gutter);
  border-top: 1px solid var(--line);
  color: #696e70;
  font-family: "IBM Plex Mono", monospace;
  font-size: 11px;
}
```

Keep the existing `.social-list` square-control rules. Remove every obsolete `.contact-section__*` selector after the new `.cta-prelude__*` and `.site-footer__*` rules are in place.

- [ ] **Step 8: Run the focused unit suite**

Run: `pnpm test tests/landing-page.test.tsx tests/media-placeholder.test.tsx`

Expected: PASS with active résumé and email links, no Learn More inner link, and neutral placeholders hidden from the accessibility tree.

- [ ] **Step 9: Commit the lower-page rebuild**

```powershell
git add -- components/about-section.tsx components/cta-prelude.tsx components/footer.tsx components/landing-page.tsx components/contact-section.tsx app/globals.css tests/landing-page.test.tsx
git commit -m "feat: recreate recorded about and footer"
```

### Task 5: Match the cursor trail and restrained motion

**Files:**
- Modify: `tests/landing-page.test.tsx`
- Create: `components/cursor-trail.tsx`
- Delete: `components/cursor-follower.tsx`
- Modify: `components/landing-page.tsx`
- Modify: `components/discipline-ticker.tsx`
- Modify: `components/reveal.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: Motion `MotionValue`, `useMotionValue`, `useSpring`, `useReducedMotion`
- Produces: `CursorTrail`, 18 `.cursor-trail__segment` elements, reduced-motion ticker behavior, and a 12px reveal

- [ ] **Step 1: Change the cursor contract to the recorded 18 segments**

Replace the old 14-segment assertion with:

```tsx
expect(screen.getByTestId("cursor-trail")).toHaveAttribute("aria-hidden", "true");
expect(
  screen.getByTestId("cursor-trail").querySelectorAll(".cursor-trail__segment"),
).toHaveLength(18);
```

- [ ] **Step 2: Run the focused test and confirm the red state**

Run: `pnpm test tests/landing-page.test.tsx`

Expected: FAIL because `cursor-trail` does not exist.

- [ ] **Step 3: Create the 18-segment spring trail**

Create `components/cursor-trail.tsx`:

```tsx
"use client";

import { motion, type MotionValue, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect } from "react";

const trailSegments = Array.from({ length: 18 }, (_, index) => index);

function CursorSegment({ index, targetX, targetY }: {
  index: number;
  targetX: MotionValue<number>;
  targetY: MotionValue<number>;
}) {
  const stiffness = Math.max(54, 640 - index * 33);
  const damping = Math.max(17, 39 - index * 1.15);
  const x = useSpring(targetX, { damping, stiffness });
  const y = useSpring(targetY, { damping, stiffness });

  return (
    <motion.span
      className="cursor-trail__segment"
      data-segment-index={index}
      style={{ opacity: Math.max(0.42, 1 - index * 0.032), x, y }}
    />
  );
}

export function CursorTrail() {
  const reducedMotion = useReducedMotion();
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  useEffect(() => {
    if (reducedMotion || !window.matchMedia("(pointer: fine)").matches) return;
    const move = (event: PointerEvent) => {
      rawX.set(event.clientX - 5);
      rawY.set(event.clientY - 5);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [rawX, rawY, reducedMotion]);

  return (
    <span aria-hidden="true" className="cursor-trail" data-testid="cursor-trail">
      {trailSegments.map((index) => (
        <CursorSegment index={index} key={index} targetX={rawX} targetY={rawY} />
      ))}
    </span>
  );
}
```

Replace `CursorFollower` with `CursorTrail` in `components/landing-page.tsx`, then delete `components/cursor-follower.tsx`.

- [ ] **Step 4: Make ticker and reveal respect the recorded motion envelope**

In `DisciplineTicker`, call `useReducedMotion()` and use:

```tsx
animate={reducedMotion ? { x: 0 } : { x: [0, -220] }}
transition={
  reducedMotion
    ? { duration: 0 }
    : { duration: 18, ease: "linear", repeat: Number.POSITIVE_INFINITY }
}
```

In `Reveal`, call `useReducedMotion()` and configure:

```tsx
initial={reducedMotion ? false : { opacity: 0, y: 12 }}
whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
viewport={{ amount: 0.2, once: true }}
transition={{ duration: 0.48, delay, ease: [0.22, 1, 0.36, 1] }}
```

- [ ] **Step 5: Rename cursor CSS and add device/motion guards**

Use:

```css
.cursor-trail {
  position: fixed;
  z-index: 90;
  inset: 0;
  pointer-events: none;
}

.cursor-trail__segment {
  position: absolute;
  top: 0;
  left: 0;
  width: 10px;
  height: 10px;
  background: var(--accent);
  pointer-events: none;
  will-change: transform;
}

@media (hover: none), (pointer: coarse) {
  .cursor-trail { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .cursor-trail { display: none; }
  .discipline-list,
  .reveal { transform: none !important; }
}
```

Remove `.cursor-follower` and `.cursor-follower__segment` rules.

- [ ] **Step 6: Run unit and menu interaction tests**

Run: `pnpm test tests/landing-page.test.tsx tests/menu-overlay.test.tsx`

Expected: PASS; 18 trail segments exist in the accessibility-hidden wrapper, and menu behavior remains intact.

- [ ] **Step 7: Commit motion fidelity**

```powershell
git add -- tests/landing-page.test.tsx components/cursor-trail.tsx components/cursor-follower.tsx components/landing-page.tsx components/discipline-ticker.tsx components/reveal.tsx app/globals.css
git commit -m "feat: match recorded landing page motion"
```

### Task 6: Complete responsive reflow and menu destination coverage

**Files:**
- Modify: `app/globals.css`
- Modify: `tests/menu-overlay.test.tsx`
- Modify: `e2e/landing-page.spec.ts`

**Interfaces:**
- Consumes: `.section-canvas`, feature/standard project cards, About columns, CTA/footer components, `navigation`, `resumeHref`
- Produces: stacked tablet/mobile layouts without overflow and verified landing-page-only menu behavior

- [ ] **Step 1: Extend the menu test to cover every destination**

Add inside the open-menu test:

```tsx
for (const [name, href] of [
  ["Home", "#home"],
  ["Projects", "#projects"],
  ["About", "#about"],
  ["Contact", "#contact"],
] as const) {
  expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
}

expect(screen.getByRole("link", { name: /view resume/i })).toHaveAttribute(
  "href",
  expect.stringContaining("drive.google.com"),
);
```

- [ ] **Step 2: Add a mobile reflow assertion to Playwright**

Replace the obsolete About-before-Projects check with:

```ts
const projectsTop = await page.locator("#projects").evaluate(
  (node) => node.getBoundingClientRect().top + window.scrollY,
);
const aboutTop = await page.locator("#about").evaluate(
  (node) => node.getBoundingClientRect().top + window.scrollY,
);
expect(projectsTop).toBeLessThan(aboutTop);
await expect(page.locator("#projects article")).toHaveCount(3);

const featureDisplay = await page.locator(".project-card--feature").evaluate(
  (node) => getComputedStyle(node).gridTemplateColumns,
);
expect(featureDisplay.split(" ")).toHaveLength(1);
```

- [ ] **Step 3: Run the menu and mobile tests to expose remaining CSS failures**

Run: `pnpm test tests/menu-overlay.test.tsx && pnpm exec playwright test e2e/landing-page.spec.ts --grep "mobile layout"`

Expected: the menu test passes; the mobile Playwright test initially fails until the new sections and feature card stack.

- [ ] **Step 4: Implement the responsive section layout**

At `max-width: 809px`, use:

```css
.section-canvas {
  width: auto;
  margin: 0 var(--page-gutter);
}

.project-card--feature {
  display: flex;
  min-height: 0;
  flex-direction: column;
}

.project-card--feature .project-card__media {
  min-height: 320px;
}

.project-card--feature .project-card__content,
.project-card--standard .project-card__content {
  min-height: 132px;
  padding: 24px;
}

.projects-grid {
  grid-template-columns: 1fr;
  gap: 26px;
}

.project-card--standard {
  min-height: 0;
}

.project-card--standard .project-card__media {
  min-height: 320px;
}

.about-section__grid {
  grid-template-columns: 1fr;
}

.about-section__portrait-stack {
  width: 250px;
  height: 315px;
  margin: 44px auto 72px;
}

.cta-prelude__actions {
  flex-wrap: wrap;
}

.site-footer__grid {
  display: block;
  min-height: 700px;
}

.site-footer__aside {
  width: 170px;
  margin: 72px 0 0 auto;
}

.site-footer__mark {
  right: auto;
  bottom: -68px;
  left: 0;
  font-size: 250px;
}
```

At `810px–1199px`, keep two secondary project columns only while each remains at least 320px wide; otherwise use the same single-column rule. Confirm fixed header controls do not overlap the headline at 810px and 1199px.

- [ ] **Step 5: Re-run focused responsive coverage**

Run: `pnpm test tests/menu-overlay.test.tsx && pnpm exec playwright test e2e/landing-page.spec.ts --grep "mobile layout"`

Expected: PASS with document `scrollWidth === clientWidth`, Projects before About, three cards, and one-column feature layout.

- [ ] **Step 6: Commit responsive behavior**

```powershell
git add -- app/globals.css tests/menu-overlay.test.tsx e2e/landing-page.spec.ts
git commit -m "fix: preserve fidelity across responsive layouts"
```

### Task 7: Calibrate recorded scroll states and complete verification

**Files:**
- Modify: `e2e/landing-page.spec.ts`
- Modify: `app/globals.css` only for measured visual corrections
- Update: `e2e/landing-page.spec.ts-snapshots/recording-desktop-hero-win32.png`
- Update: `e2e/landing-page.spec.ts-snapshots/recording-desktop-projects-win32.png`
- Update: `e2e/landing-page.spec.ts-snapshots/recording-desktop-about-win32.png`
- Update: `e2e/landing-page.spec.ts-snapshots/recording-desktop-footer-win32.png`
- Update: affected mobile and menu snapshots

**Interfaces:**
- Consumes: completed page sections and full-resolution video keyframes at hero, projects, About/CTA, and footer positions
- Produces: reviewed visual baselines and a fully passing production verification suite

- [ ] **Step 1: Add deterministic screenshots for the four recorded desktop states**

Create a helper and tests in `e2e/landing-page.spec.ts`:

```ts
async function stabilizeForScreenshot(page: import("@playwright/test").Page) {
  await page.addStyleTag({
    content: [
      ".discipline-list{transform:none!important}",
      ".reveal{opacity:1!important;transform:none!important}",
      ".cursor-trail{display:none!important}",
      "*{scroll-behavior:auto!important}",
    ].join(""),
  });
}

test("recording desktop scroll states", async ({ page }) => {
  await page.setViewportSize({ width: 2542, height: 1261 });
  await page.goto("/");
  await stabilizeForScreenshot(page);

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page).toHaveScreenshot("recording-desktop-hero.png", { animations: "disabled" });

  await page.locator("#projects").scrollIntoViewIfNeeded();
  await expect(page.locator("#projects")).toHaveScreenshot("recording-desktop-projects.png", { animations: "disabled" });

  await page.locator("#about").scrollIntoViewIfNeeded();
  await expect(page.locator("#about")).toHaveScreenshot("recording-desktop-about.png", { animations: "disabled" });

  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(page.locator("#contact")).toHaveScreenshot("recording-desktop-footer.png", { animations: "disabled" });
});
```

- [ ] **Step 2: Add reduced-motion and no-inner-route assertions**

Add:

```ts
test("reduced motion disables continuous landing-page motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".cursor-trail")).toHaveCSS("display", "none");
  await expect(page.locator(".discipline-list")).toHaveCSS("transform", "none");
});

test("landing controls do not expose internal routes", async ({ page }) => {
  await page.goto("/");
  const internal = await page.locator('a[href^="/"]').all();
  expect(internal).toHaveLength(0);
  await expect(page.locator("#projects article")).toHaveCount(3);
});
```

- [ ] **Step 3: Generate the new snapshot candidates**

Run: `pnpm test:e2e --update-snapshots`

Expected: Playwright writes the four `recording-desktop-*.png` baselines and refreshes snapshots affected by the section-order and layout changes.

- [ ] **Step 4: Compare every desktop candidate to the extracted recording keyframes**

Inspect these pairs at full resolution:

- Hero candidate against `key_0.png` and `key_8_75.png`
- Projects candidate against `key_11_5.png`
- About candidate against `key_14_75.png`
- Footer candidate against `key_17_5.png`
- Cursor behavior in a live page against the trail arc in `key_22_5.png`

Measure and adjust only the responsible CSS anchors: canvas edge, section top padding, heading baselines, card heights, split ratio, About column ratio, portrait-stack size, CTA spacing, footer mark position, and cursor spring values.

- [ ] **Step 5: Re-run screenshots without updating baselines**

Run: `pnpm test:e2e`

Expected: all Playwright assertions and screenshots pass against the reviewed baselines.

- [ ] **Step 6: Run complete verification**

Run: `pnpm test && pnpm lint && pnpm typecheck && pnpm test:e2e && pnpm build`

Expected: all commands exit 0; all unit and Playwright tests pass; lint and TypeScript report no errors; Next.js builds the landing route and framework not-found route only.

- [ ] **Step 7: Inspect staged scope and commit the calibrated rebuild**

Run: `git status --short`

Expected: only Task 7 test, CSS, and snapshot changes are staged or unstaged; `next-env.d.ts` remains outside the commit unless Next.js required and intentionally changed it.

```powershell
git add -- e2e/landing-page.spec.ts e2e/landing-page.spec.ts-snapshots app/globals.css
git commit -m "fix: calibrate landing page to reference recording"
```

## Final Acceptance Checklist

- [ ] The hero matches the centered four-column reference and scrolls in normal flow.
- [ ] Header brand, menu, and availability remain fixed during the full page scroll.
- [ ] The project section shows the full-width `Desk Mate` split card followed by two equal secondary cards.
- [ ] About, CTA prelude, and footer match the recording’s order and composition.
- [ ] Every media surface is a neutral placeholder.
- [ ] Cursor trail uses 18 small blue squares and is absent for reduced-motion and touch/coarse-pointer users.
- [ ] Menu, footer, and CTA destinations are same-page anchors, external résumé, social, or email links only.
- [ ] No inner route or `Side Quests` item is present.
- [ ] Desktop, tablet, and mobile layouts have no horizontal document overflow.
- [ ] Unit tests, lint, typecheck, Playwright, and production build all pass.
