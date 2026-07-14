# Visible Sticky Project Cover Design

## Problem

The current desktop transition uses a sticky hero inside a stage that is only `100px` taller than the viewport. The Projects layer follows that stage in normal document flow. During the `100px` sticky interval, Projects remains below the viewport. When Projects finally becomes visible, the sticky interval has ended and the hero moves upward with it. The visible result therefore resembles ordinary scrolling rather than the target recording's opaque Projects layer covering a stationary hero.

The existing geometry evidence demonstrates the failure:

- At `scrollY = 80`, the hero title is stationary, but Projects is still below the viewport.
- At `scrollY = 180`, Projects is visible, but the hero title has moved upward by approximately `80px`.

## Approved Behavior

On an eligible desktop device, Projects must enter the viewport and move upward while the hero title remains stationary. The opaque Projects background covers the hero from bottom to top. The hero may release only after the cover interval completes.

Eligible desktop input remains:

- viewport width at least `810px`;
- viewport height at least `700px`;
- hover capability;
- fine pointer.

Mobile, short-height, touch, and coarse-pointer contexts retain normal document flow without the staged cover.

## Architecture

Use native CSS sticky positioning and document flow. Do not add a JavaScript scroll controller, scroll snapping, artificial wheel-speed handling, or a dependency.

Define one desktop transition variable:

```css
--hero-cover-distance: 100svh;
```

Within the eligible desktop media query:

```css
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
```

The stage's added height and the flow's equal negative margin cancel in the overall document layout. Projects begins at the viewport's lower boundary at `scrollY = 0`, while the hero has one viewport of sticky travel available. As the user scrolls through that distance, Projects rises over the pinned hero. Lower sections retain their existing downstream positions after the transition.

The exact distance is isolated in `--hero-cover-distance`. Start and ship with `100svh`; any visual calibration against the source recording may change only this variable, not the architecture.

## Layering

- `.hero-stage` remains the lower layer.
- `.landing-flow` remains `position: relative`, opaque, and above the hero.
- Fixed header controls and the active custom cursor remain above both layers.
- Projects must never become translucent during the cover.

## Responsive Fallback

Outside the eligible desktop media query:

- `.landing-flow` has `margin-top: 0`;
- `.hero` remains relative;
- existing mobile and short-height stage dimensions remain unchanged;
- coarse-pointer wide tablets retain normal flow.

Reduced-motion preference does not remove native sticky scrolling because the transition is directly controlled by the user's scroll and contains no continuous or autonomous animation.

## Regression Tests

Add a desktop Playwright regression that fails against the current implementation and proves all of the following:

1. At `scrollY = 0`, Projects begins at the viewport lower boundary.
2. After scrolling by `25%` of the viewport height, Projects is visibly inside the viewport.
3. Across that same interval, the hero title's viewport `y` position changes by less than `1px`.
4. Projects moves upward by approximately the requested scroll distance.
5. At `75%` of the viewport height, the hero title remains pinned while Projects covers most of the hero.
6. The unscrolled hero and visible-overlap screenshots are not byte-identical.

Retain or extend the existing wide-touch regression to prove:

- the hero is `position: relative`;
- `.landing-flow` has no negative top margin;
- the native cursor remains available;
- Projects follows normal flow.

## Visual Verification

Capture and inspect these states at the reference desktop viewport:

- `scrollY = 0` — clean hero;
- `scrollY = 25svh` — early visible cover with stationary title;
- `scrollY = 75svh` — substantial cover with stationary title;
- Projects section aligned to its deterministic absolute document position.

Compare the generated states with the target recording. Media remains neutral placeholders, so verification concerns layout, cover timing, clipping, typography, fixed controls, and scroll behavior rather than project imagery.

## Preserved Scope

- Four-project order and 1100px desktop grid.
- Mobile one-column grid.
- Target ticker order and seamless loop.
- About, CTA, footer, menu, résumé, social, and email behavior.
- Cursor activation and reduced-motion native fallback.
- One landing page with no inner routes.
- Existing local font and dependency choices.

## Completion Criteria

- The new regression is observed failing before the CSS change.
- The visible cover works at eligible desktop viewports.
- Normal flow remains correct on mobile, short-height, touch, and coarse-pointer contexts.
- Updated screenshots are visually inspected against the recording.
- Unit tests, Playwright tests, lint, typecheck, production build, and `git diff --check` all pass.
