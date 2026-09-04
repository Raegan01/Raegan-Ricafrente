# Ananya Portfolio Landing Page Design

## Objective

Build a new Next.js landing page that recreates the visual language, responsive composition, and interaction behavior of the public Raegan Ricafrente Framer homepage. The implementation must be a single-page application with no inner pages. Image and video assets will initially be represented by labeled neutral placeholders that preserve the original geometry and cropping behavior.

## Scope

### Included

- One public route at `/`.
- Fixed identity header with logo and menu trigger.
- Full-screen animated menu overlay.
- Sticky editorial hero with availability label, descriptive copy, discipline tags, and scroll behavior.
- About section with a portrait/illustration placeholder and biography copy.
- Selected-projects section containing four project entries and media placeholders.
- Homepage-style contact call to action, résumé link, email link, social links, sitemap-style anchors, and footer identity mark.
- Same-page navigation for Home, Projects, About, and Contact.
- Desktop and mobile compositions based on the inspected 1280×720 and 390×844 reference viewports.
- Accessible static fallbacks and reduced-motion behavior.
- Automated component, interaction, visual, build, lint, and type checks.

### Excluded

- Projects index route.
- Individual project case-study routes.
- Side Quests route and menu item.
- About route.
- Contact route and contact form.
- CMS, backend, database, authentication, analytics, and runtime APIs.
- Original image and video assets during the first implementation phase.

## Technical Approach

Use the Next.js App Router with React and TypeScript. Styling will be hand-authored with global CSS and component-scoped class names to retain precise control over measurements, breakpoints, layering, typography, and animation states. Motion will handle menu transitions, scroll-linked reveals, and hover transitions. Lucide will provide small interface and social icons where the original artwork is not required.

No generic component library will be installed. Component-library defaults would add unnecessary styling constraints and make pixel calibration harder.

## Proposed Dependencies

### Runtime

- `next`
- `react`
- `react-dom`
- `motion`
- `lucide-react`

### Development and verification

- `typescript`
- `eslint`
- `eslint-config-next`
- `vitest`
- `@vitejs/plugin-react`
- `jsdom`
- `@testing-library/react`
- `@testing-library/jest-dom`
- `@testing-library/user-event`
- `@playwright/test`

Dependencies will use versions compatible with the current stable Next.js release selected at scaffold time. Package versions will be locked in the generated lockfile.

## Information Architecture

The single route contains these ordered regions:

1. Global header.
2. Hero (`#home`).
3. About (`#about`).
4. Selected Projects (`#projects`).
5. Contact call to action and footer (`#contact`).

Desktop presentation may visually place Projects before About to match the reference homepage. Mobile presentation will intentionally place About before Projects, matching the inspected mobile composition. DOM order will remain meaningful for accessibility, with CSS layout and responsive component composition used carefully to avoid confusing keyboard or screen-reader order.

## Component Boundaries

### `LandingPage`

Composes all sections and owns no interaction state beyond page-level layout.

### `Header`

Renders the reconstructed identity mark, “Raegan Ricafrente” wordmark, and menu trigger. It remains fixed over the page and exposes a semantic button to open the menu.

### `MenuOverlay`

Owns open/closed presentation, focus containment, Escape-key dismissal, body scroll locking, and focus return to the trigger. It contains Home, Projects, About, and Contact anchors plus résumé, email, and social links. Selecting an anchor closes the menu and moves focus to the destination section.

### `Hero`

Renders the oversized headline, copyright mark, supporting copy, availability indicator, graphic-designer label, and discipline ticker. Desktop uses a sticky full-viewport composition. Mobile uses the inspected compact headline and horizontal tag track.

### `DisciplineTicker`

Renders the repeated discipline labels used for the continuous horizontal effect. Its static fallback is a horizontally scrollable list. The animation pauses when reduced motion is requested.

### `AboutSection`

Renders the section label, portrait placeholder, introduction, biography, and Learn More button. The button scrolls to the section’s full biography rather than navigating to an inner route.

### `ProjectsSection`

Renders four project entries: adidas x D.O.N., Desk Mate, Ragas & Rhythms, and Bound & Beyond. Desktop uses the inspected two-column card grid with overlaid project metadata. Mobile uses alternating titles and cropped placeholder frames. Project cards are presentation-only and do not link to excluded routes.

### `MediaPlaceholder`

Accepts a label, aspect ratio, media type, accessible description, and optional future source metadata. It produces a neutral-gray frame with an unobtrusive label while preserving the eventual media box’s exact dimensions, radius, and object-fit behavior.

### `ContactSection`

Renders the homepage-style résumé and email CTA, the large closing statement, social links, same-page sitemap anchors, copyright, and oversized footer identity mark. The email action uses the visible Ananya email address as its `mailto:` target.

### `CursorFollower`

Renders the small electric-blue pointer accent on fine-pointer devices. It is hidden for touch, coarse-pointer, keyboard-only, and reduced-motion contexts and never replaces the native cursor.

### Motion primitives

Small reusable reveal and repeated-label components provide scroll opacity, character reveal, and button-label transitions without duplicating business or layout logic.

## Visual System

### Typography

- IBM Plex Mono: oversized editorial headings and project titles.
- Inter: identity, navigation, and supporting interface text.
- Outfit: body copy and buttons.
- Space Grotesk or Plus Jakarta Sans only where required to match inspected secondary labels.

Fonts will be loaded through `next/font` when available, avoiding layout shift and external runtime font requests.

### Color

- Primary foreground: near-black `#14181a`.
- Primary background: white `#ffffff`.
- Menu background: the same near-black as the foreground.
- Muted text and reveal states: neutral grays sampled and tuned against the reference.
- Accent: one electric blue used for the pointer detail and small interactive indicators.
- Placeholders: neutral-gray surfaces with sufficient label contrast.

### Desktop geometry

- Reference viewport: 1280×720.
- Page content width follows the inspected 1265px rendered document.
- Primary horizontal gutters are approximately 50px.
- Fixed header height is approximately 93px.
- Hero headline is approximately 98px with IBM Plex Mono styling.
- Project cards use the inspected two-column proportions and rounded corners.
- Spacing remains intentionally generous and asymmetric.

### Mobile geometry

- Reference viewport: 390×844.
- Primary gutters are approximately 28px.
- Hero headline is approximately 29px.
- About precedes Projects visually.
- Project entries become alternating title-and-media compositions.
- Discipline tags and relevant tracks may scroll horizontally inside bounded containers.
- The document itself must not produce horizontal overflow.

## Behavior and Animation

- Fixed header remains visible while scrolling.
- Hero uses desktop sticky positioning and scroll-linked progression.
- Headings and body copy use restrained opacity and character reveals based on scroll progress.
- Discipline tags move continuously on desktop and remain manually scrollable on mobile.
- Menu enters as a full-screen dark overlay and leaves cleanly after anchor selection.
- Buttons reproduce the repeated-label hover transition without duplicating accessible names.
- Project placeholders retain the card hover and pointer-accent behavior without implying navigation.
- Smooth scrolling respects the fixed header offset.
- `prefers-reduced-motion: reduce` disables continuous movement and supplies complete static content states.

## Content and Data Flow

Navigation items, disciplines, projects, social links, and footer links are stored in typed local data. Components receive those values through props. There is no network data flow and no runtime API state.

Future media replacement will update the project data with a source, media type, focal position, and accessible description. The layout components will not need to change.

## Accessibility and Resilience

- Semantic landmarks: header, navigation, main, sections, and footer.
- One primary page heading, with a consistent heading hierarchy afterward.
- Visible keyboard focus styles.
- Menu focus containment, Escape dismissal, scroll locking, and focus restoration.
- Anchor targets receive programmatic focus after menu navigation.
- Decorative identity marks and cursor accents are hidden from assistive technology.
- Placeholder frames have accessible text describing their future media purpose.
- Essential content remains readable with Motion unavailable or JavaScript disabled.
- External links use safe target and relationship attributes where new tabs are appropriate.

## Testing Strategy

### Vitest and Testing Library

- Render all required sections and verify their anchor IDs.
- Verify the menu opens, closes, dismisses with Escape, and returns focus.
- Verify selecting a menu item closes the overlay and targets the correct section.
- Verify Side Quests and all inner-route links are absent.
- Verify four project placeholders and their labels are present.
- Verify contact CTA uses the visible Ananya email address.
- Verify project entries do not advertise unavailable routes.

### Playwright

- Capture reference screenshots at 1280×720 and 390×844.
- Verify desktop and mobile section compositions.
- Verify menu overlay appearance and keyboard interaction.
- Verify desktop sticky hero and same-page navigation.
- Verify the page has no unintended horizontal overflow at 390px.
- Verify all essential content is visible with reduced motion enabled.

### Build gates

- ESLint succeeds with zero errors.
- TypeScript checking succeeds.
- Unit and interaction tests succeed.
- Playwright checks succeed.
- `next build` succeeds.

## Acceptance Criteria

1. The project runs as a new Next.js application from the workspace root.
2. Only the `/` route is intentionally implemented.
3. The landing page reproduces the inspected homepage’s typography, layout proportions, responsive recomposition, menu, and motion behavior at the reference viewports.
4. Home, Projects, About, and Contact navigation stays on the same page.
5. Side Quests and all inner pages are absent.
6. Four labeled neutral media placeholders preserve the original project-media geometry.
7. The contact area retains the homepage-style CTA and correct Ananya email link without adding a form.
8. The page does not produce unintended mobile document overflow.
9. Keyboard navigation, reduced motion, and semantic structure remain functional.
10. All verification gates complete successfully before the implementation is presented as finished.

## Delivery Boundary

This phase ends with a locally verified landing-page codebase. GitHub publication and Vercel deployment are separate authorized delivery actions after the local implementation is approved and the required credentials or connected accounts are available.
