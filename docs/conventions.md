# Code Conventions

**Purpose:** how code in `src/` is written here, where the choice isn't the framework default.
**Read when:** writing or reviewing any code in `src/`.

---

## Structure

- **kebab-case filenames**, always — including block renderers (`component.tsx`, not `Component.tsx`). Named exports preferred.
- **Server components by default.** `"use client"` only when the component genuinely needs interactivity; say why in a comment.

## Styling

- **No CSS framework.** Layout composes from primitives in `src/styles/compositions/`; component styles are scoped CSS Modules. Layout wants a media query — check the primitives first ([design/layout-primitives.md](design/layout-primitives.md)).
- **No magic values.** Colours, spacing, type sizes, radii come from tokens. A raw hex or px value in a component is a review finding — and Stylelint/ESLint block most of them mechanically ([design/tokens.md](design/tokens.md)).

## Reuse before writing

- **Prefer the framework's own primitive.** Before writing a helper, check whether Payload or Next already ships it — Payload especially hides useful things (`slugField()`, `imageSizes`, `formatOptions`, access-control helpers). The built-in handles edge cases you haven't hit yet. If you do hand-write one, note in a comment what you checked and why it didn't fit, so the next person re-evaluates on upgrade instead of assuming oversight.
- **Blocks are a closed set.** Editors pick from `src/payload/blocks/`. Adding one is a deliberate change with owner sign-off, not a convenience — see [workflows/adding-a-block.md](workflows/adding-a-block.md).

## Claims

- **A library feature central to the plan gets proved before it's built on.** One cheap test (curl the API, inspect built output, read the served file) beats discovering it wrong after a full implementation cycle.
