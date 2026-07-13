# Video-Comparison Fidelity Correction

## Objective

Correct the existing Next.js landing page against the newly supplied target recording, `Desktop 2026.07.14 - 04.17.53.03.mp4`, using `Desktop 2026.07.14 - 04.18.28.04.mp4` as evidence of the current implementation. The target recording supersedes earlier project-section layout interpretations where they conflict.

The page remains a single landing page with neutral media placeholders and no inner routes. Existing About, CTA, and footer sections remain below Projects.

## Comparison Findings

Both recordings are 2560 × 1440, approximately 120fps desktop captures. Synchronized one-second contact sheets, quarter-second samples of the active scroll interval, and full-resolution hero/project frames establish these differences:

- The target Projects section contains four equal visual cards in a 2×2 grid; the current build contains three asymmetric cards.
- `adidas x D.O.N.` appears first in the target but is absent from the current build.
- The target Projects canvas is approximately 1100px wide inside the wider 1320px hero canvas.
- Target cards use a width-to-height ratio near 1.2:1, tight 8–10px gaps, overlaid white metadata, and a subtle lower gradient.
- The target has no split green information panel, separate white card captions, or circular project arrows.
- The operating-system pointer is hidden in the target; only the blue custom square cursor is visible.
- The target ticker begins with the visible sequence `Spatial / Exhibition Design`, `Layout`, `Branding`, `3D`, `Publication` and loops without a visible jump.
- The target uses a pinned hero transition. The hero remains stationary while the opaque Projects layer advances upward and progressively covers it. The current hero moves away immediately in normal document flow.

Browser chrome, recording notifications and controls, and the `Made in Framer` badge are capture artifacts and remain excluded.

## Layout Correction

The hero retains its centered 1320px editorial canvas, five vertical guide lines, existing headline placement, supporting copy, role label, copyright mark, fixed brand, fixed menu, and fixed availability label. Only measured vertical offsets exposed by screenshot comparison may be tuned.

Projects uses a separate centered canvas approximately 1100px wide. Its heading includes `[ Project ]`, `Projects`, the existing italic supporting statement, and the dark `See them all` pill aligned to the project canvas's right edge.

The project order is:

1. `adidas x D.O.N.`
2. `Desk Mate`
3. `Ragas & Rhythms`
4. `Bound & Beyond`

All four cards have equal dimensions. Desktop and sufficiently wide tablet layouts use two columns; mobile uses one column. Each card keeps a neutral placeholder surface, matching rounded corners, and a lower dark gradient. Title, discipline, and context sit over the lower-left of the card in white. Project cards remain non-navigational, and no arrow control is rendered.

## Sticky Hero Scrolling

The hero is restored as a sticky element inside an extended scroll stage:

- The stage is taller than one viewport by a calibrated overlap distance.
- The hero stays `position: sticky` at `top: 0` and occupies one viewport height.
- The headline, guides, support text, role, copyright, and ticker remain anchored when scrolling begins.
- The Projects section has an opaque white background and higher stacking order, so it slides over and clips the pinned hero as it rises.
- After Projects covers the hero, Projects and all later sections use ordinary native document scrolling.
- Header brand, menu, and availability stay above both layers.
- There is no scroll snapping, transformed scroll container, forced scroll speed, scale effect, or opacity-driven scene transition.

The extended stage distance will be calibrated against the quarter-second target frames, with an initial implementation near 100px beyond `100svh`. Desktop and tablet receive the pinned transition. Mobile and short/coarse-pointer layouts use normal hero flow to avoid unstable sticky behavior.

## Cursor and Ticker

On fine-pointer devices, the operating-system cursor is hidden over the page and interactive controls. The existing blue square trail remains non-interactive. When stationary, its segments converge into one visible square; when moving, delayed segments form the recorded trail. Touch, coarse-pointer, and reduced-motion behavior remains unchanged.

The ticker renders enough repeated discipline content for a seamless loop. Its initial offset exposes the target sequence at page load, and its travel distance matches the width of one complete discipline set so the restart is visually continuous. Reduced-motion users receive a stationary readable list.

## Preserved Sections and Behavior

About, CTA prelude, footer, menu overlay, résumé link, social links, email links, and landing-page anchors remain structurally and behaviorally unchanged. Their existing responsive and accessibility behavior must not regress.

## Component Scope

The correction is limited to:

- `data/site-content.ts`
- `components/project-card.tsx`
- `components/projects-section.tsx`
- `components/discipline-ticker.tsx`
- `components/cursor-trail.tsx` only if cursor motion tuning is required
- `components/hero.tsx` only if the sticky-stage structure requires a semantic hook
- `app/globals.css`
- Relevant unit and Playwright tests and snapshots

No unrelated component refactor or new dependency is included.

## Accessibility and Failure Behavior

Placeholders and cursor segments remain hidden from assistive technology. Project cards are semantic articles but not links or disabled faux controls. Fixed navigation retains keyboard support and visible focus states. Hiding the native pointer is restricted to fine-pointer devices where the custom cursor is active; the native pointer remains available when the custom cursor is disabled.

Reduced-motion preferences stop continuous ticker and spring motion without changing content availability. If sticky positioning is unsupported, the document remains readable in normal flow.

## Verification

Completion requires:

1. A regression proving the hero headline remains stationary while the Projects boundary moves upward during the overlap interval
2. Desktop geometry assertions for the 1320px hero canvas and approximately 1100px Projects canvas
3. Four-card order, equal-dimension, two-column, aspect-ratio, overlay, and no-inner-link assertions
4. Fine-pointer native-cursor hiding and custom-trail presence checks
5. Seamless ticker start-sequence and reduced-motion checks
6. Screenshot comparisons at initial hero, overlap transition, Projects heading, and complete 2×2 grid states
7. Responsive verification for two-column wide layouts and one-column mobile layouts without horizontal overflow
8. Regression checks confirming About, CTA, footer, menu, résumé, and email behavior remain present
9. Clean unit tests, lint, typecheck, Playwright suite, and production build

## Out of Scope

- Original project images or videos
- Inner project pages
- Changes to About, CTA, footer, résumé, email, or menu behavior
- Framer branding or recording/browser overlays
- Scroll snapping or a video-backed page imitation
