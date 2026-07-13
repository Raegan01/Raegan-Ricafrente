# Desktop Hero Grid Correction Design

## Goal

Make the desktop hero match the supplied reference image while preserving the existing mobile landing-page behavior and single-page scope.

## Source of truth

The first user-supplied screenshot is the desktop visual source of truth. Its 2542-pixel-wide capture uses a centered editorial canvas approximately 1320 CSS pixels wide. Five faint vertical rules divide that canvas into four equal 330-pixel columns.

## Layout

- Introduce a centered desktop canvas with a maximum width of 1320 pixels and responsive side margins.
- Anchor the header brand, menu, availability label, headline, copyright, supporting copy, role label, and ticker to the canvas rather than the viewport edges.
- Draw five subtle vertical rules across the hero to expose the four-column editorial grid.
- Keep the headline on the exact three-line phrase structure shown in the reference: `Design is my`, `favorite way to`, `overthink`.
- Position the supporting copy at the second grid line, the role label at the first grid line, and the ticker from the second grid line.
- Keep the hero at the viewport height on desktop and preserve the existing sticky transition into the rest of the landing page.

## Cursor behavior

Replace the single blue cursor square with a fourteen-segment trail. The newest segment follows the pointer and older segments ease toward prior positions. Hide the effect on touch-sized viewports and when reduced motion is requested.

## Responsive behavior

- Apply the centered four-column canvas at desktop widths of 1200 pixels and above.
- Retain the current tablet and mobile layout rules below 1200 pixels.
- Prevent horizontal document overflow at all viewport widths.

## Verification

- Add Playwright geometry assertions at 2542 by 1261 for canvas position, grid width, headline line breaks, and key content anchors.
- Capture a fresh desktop screenshot with animations disabled and compare it to the supplied reference.
- Re-run the existing mobile screenshots to ensure the correction does not disturb mobile ordering or sizing.
- Run unit tests, lint, typecheck, Playwright tests, and a production build.
