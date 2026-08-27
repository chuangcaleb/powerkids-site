# 0009. Headless UI library for complex interactive components

**Status:** accepted
**Date:** 2026-08-27

## Context

Every interactive component in the repo (including the accordion) has been hand-rolled: manual open/close state, roving focus, ARIA wiring, CSS-driven animation. [0003-vanilla-css-with-primitives.md](0003-vanilla-css-with-primitives.md) rejected `shadcn/ui` for the same reason — a generated-component-file package coupled to Tailwind, pulling in a whole system to justify two brand components and an accordion.

That rejection was about `shadcn/ui` specifically: bundled, Tailwind-coupled, generated files inviting ad-hoc styling. It does not extend to bare headless primitives (`@radix-ui/react-*`) used one at a time, unstyled, with our own CSS Modules — the concern that motivated 0003 doesn't apply there.

## Decision

For components where the _interaction model_ is complex enough that getting it wrong is an accessibility bug (disclosure widgets, dialogs/sheets — correct roving focus, ARIA state, focus trapping), reach for an unstyled headless-UI primitive (e.g. Radix) instead of hand-rolling the state machine. Keep visual styling and animation in our own CSS Modules, same as every other component.

Simple components (buttons, cards, static layout) stay hand-rolled — the line is interaction-model complexity, not visual complexity.

Rule of thumb for which side of the line a component is on: check whether Radix ships a primitive for it. Radix's own catalogue only covers components with a real interaction model — state, focus management, ARIA wiring worth not reinventing (accordion, dialog, popover, tabs, tooltip). It deliberately has no `Button` — a `<button>` needs none of that. That gap is itself the signal: if Radix doesn't bother, hand-roll it; if Radix has a primitive, that's evidence the interaction model is complex enough to be worth pulling in.

## Consequences

First external UI dependency in the repo. Expect future complex interactive components (sheets, menus) to reach for an external library rather than reintroducing a hand-rolled state machine. Radix is not necessarily the most appropriate library, but it is preferred. Vanilla CSS, primitives, and no CSS/component framework otherwise remain unchanged — this narrows, not reverses, 0003.
