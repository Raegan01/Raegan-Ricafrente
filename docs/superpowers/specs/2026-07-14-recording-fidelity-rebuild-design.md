# Recording-Fidelity Landing Page Rebuild

## Objective

Update the existing Next.js/React landing page so its layout, motion, scrolling, and interactions reproduce the supplied desktop recording of `ananyamehrotra.framer.website` as closely as practical while keeping all project, video, and portrait media as neutral placeholders.

The deliverable remains a single landing page. It must not add project-detail pages, an About page, or any other inner route.

## Reference and Fidelity Baseline

The primary visual reference is the supplied 2560 × 1440 desktop recording, `Desktop 2026.07.14 - 02.51.07.01.mp4`. Full-resolution frames sampled at the hero, projects, About, CTA, footer, and cursor-trail states form the comparison baseline.

The implementation will reproduce portfolio content only. Browser chrome, screen-recorder controls and notifications, and the `Made in Framer` platform badge are recording artifacts and will not be included.

## Page Architecture

The page uses a centered editorial canvas approximately 1320px wide at the reference desktop viewport. Its major sections appear in this order:

1. Fixed brand, menu control, and availability label
2. Hero with a faint four-column guide, oversized monospaced headline, supporting copy, role label, copyright mark, and horizontal category ticker
3. Projects heading with eyebrow, title, supporting statement, and `See them all` CTA
4. Three-project asymmetric showcase
5. Two-column About section
6. Centered CTA prelude
7. Contact footer with social controls, sitemap, email CTA, and oversized brand mark

The hero grid guides are limited to the hero rather than continuing through every section.

## Header and Navigation

The brand remains fixed at the top-left edge of the editorial canvas. The menu control remains fixed at the top-right, and the availability label stays fixed near the right side as shown in the recording. Page content scrolls beneath these controls.

The menu retains the existing overlay interaction. Its navigation items target anchors on the landing page only. No menu item creates or links to an internal detail route.

Keyboard focus, Escape-to-close behavior, and focus visibility remain supported. Menu state must not prevent the page from returning to normal scrolling after it closes.

## Hero

The hero preserves the recently corrected centered desktop composition. The headline, copyright symbol, supporting copy, `[ Graphic Designer ]` label, and ticker align to the four-column guide visible in the recording.

The hero belongs to normal document flow and scrolls away with the page. It will not use section snapping or a pinned full-screen scene. The ticker runs continuously and masks overflow at its edges.

## Projects

The section heading contains:

- `[ Project ]`
- `Projects`
- `What looks effortless here is the result of deliberate overthinking.`
- A dark `See them all` pill aligned to the right

The showcase contains exactly three projects:

1. `Desk Mate` is a full-width split feature. A neutral media placeholder occupies approximately 40 percent of the card and a muted green information panel occupies approximately 60 percent. The text and circular arrow control sit inside the information panel.
2. `Ragas & Rhythms` occupies the left half of the next row.
3. `Bound & Beyond` occupies the right half of the next row.

`adidas x D.O.N.` is removed from the recorded landing-page composition. `See them all` and the project arrow controls may provide hover and focus feedback, but they do not navigate to inner pages.

All media surfaces use neutral placeholders with the recorded dimensions, aspect ratios, clipping, and panel relationships. Placeholder styling must be quiet enough to preserve the layout hierarchy without inventing artwork.

## About and CTA Prelude

The About section is separated by a horizontal rule and uses a two-column layout.

The left column contains `[ About ]`, `Why Choose Me`, and a layered, slightly rotated portrait-placeholder composition. The right column contains `Hi, I'm Ananya Mehrotra`, the large monospaced role `Communication Designer`, descriptive copy, and a dark `Learn More` pill. `Learn More` has visual interaction feedback but does not open an inner page.

Below About, the centered CTA prelude contains:

- `Every design starts with a thought worth exploring`
- `Let’s talk and create something unforgettable.`
- An outlined `View Resume` control with a blue status dot
- A dark `Say Hello!` control

`View Resume` remains present but inactive until a résumé file or external URL is supplied. It must communicate its unavailable state accessibly rather than producing a broken navigation. `Say Hello!` retains the site's email action.

## Footer

The footer begins with a horizontal divider. Its left side reads `Let’s create something` and `awesome together.`, followed by social icon controls. Its right side contains a dark `Contact Me` pill and a landing-page sitemap. A large light-gray brand mark anchors the lower composition.

The email address and the `Contact Me`/`Say Hello!` controls use the existing `mailto:` target. Footer sitemap entries scroll to landing-page anchors. Items that would require inner pages are omitted rather than linked to empty routes.

## Scrolling and Motion

Scrolling is native, continuous, and smooth. There is no forced section snapping and no video-backed imitation of the page.

The blue cursor treatment is an approximately 18-segment trail of small square marks. Delayed spring motion creates the curved path visible in the recording. The trail follows the pointer across the landing page, remains non-interactive, and never blocks clicks or text selection.

Entrance effects are intentionally restrained: short opacity transitions and small vertical offsets only where they support the recorded behavior. The implementation avoids large translations or staged effects that are not evident in the recording. Project cards and pill controls receive subtle hover and focus feedback.

When the user requests reduced motion, continuous ticker and spring effects are disabled or simplified, and content remains immediately available. The custom cursor trail is disabled on coarse-pointer and touch devices.

## Component Boundaries

The page is divided into focused React components:

- `Header`
- `MenuOverlay`
- `Hero`
- `ProjectSection`
- `ProjectCard`
- `About`
- `CtaPrelude`
- `Footer`
- `CursorTrail`

Small typed data collections hold project metadata and landing-page navigation. Components receive the content they render through clear props rather than duplicating labels or links. Motion code is isolated from content data, and placeholder presentation is shared across project and portrait media where appropriate.

No broad refactor outside the landing-page fidelity work is included.

## Responsive Behavior

The reference desktop composition is calibrated first against the 2560 × 1440 recording. For narrower screens:

- The editorial canvas contracts with proportional side margins.
- Hero typography scales fluidly while preserving hierarchy and line breaks where space permits.
- The split feature card and About columns stack in a deliberate reading order.
- The two secondary project cards become a single column when their recorded proportions no longer fit.
- Fixed controls preserve safe viewport-edge spacing and never overlap primary content.
- Placeholder aspect ratios remain stable.
- The ticker clips cleanly without creating horizontal page overflow.

Responsive adaptations preserve the visual system rather than attempting to force the desktop frame onto a narrow viewport.

## Accessibility and Failure Behavior

Interactive elements use semantic buttons or links, visible focus states, and accessible names. Email links remain functional without JavaScript. Inactive controls do not point to nonexistent resources. Menu and motion behavior degrade safely if client-side animation is unavailable.

Decorative grid lines, placeholder surfaces, and cursor segments are hidden from assistive technology. Color contrast and reduced-motion behavior are checked during verification.

## Verification

Completion requires all of the following:

1. Screenshot comparisons at the hero, projects, About, CTA, and footer positions against the sampled full-resolution recording frames
2. Desktop verification at the recording viewport and responsive checks at representative tablet and mobile widths
3. Interaction checks for menu open/close, landing-page anchors, email links, cursor trail, hover/focus states, and reduced-motion behavior
4. Confirmation that project and informational controls do not open inner routes
5. Unit tests for content/interaction behavior where practical
6. Playwright coverage for the full landing-page flow
7. Clean lint, typecheck, automated test, and production build results

## Out of Scope

- Original project imagery or video assets
- Project-detail pages
- Separate About, résumé, or contact pages
- A functional résumé download before a file or URL is supplied
- Framer platform branding
- Browser or recording overlays
- New CMS or backend services
