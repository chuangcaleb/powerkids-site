# Code Conventions

**Purpose:** how code in `src/` is written here, where the choice isn't the framework default.
**Read when:** writing or reviewing any code in `src/`.

---

## Structure

- **kebab-case filenames**, always — including block renderers (`component.tsx`, not `Component.tsx`). Named exports preferred.
- **Server components by default.** `"use client"` only when the component genuinely needs interactivity; say why in a comment.

## Styling

- **No CSS framework.** Layout composes from primitives in `src/styles/compositions/`; component styles are scoped CSS Modules. Layout wants a media query — check the primitives first ([design/layout-primitives.md](design/layout-primitives.md)).
- **Override a layout primitive's custom property with `primitiveVars()`, not a CSS Module class** — see [design/layout-primitives.md#overriding](design/layout-primitives.md#overriding) for the convention, its two exceptions, and why ([ADR 0007](adr/0007-primitive-override-convention.md)).
- **No magic values.** Colours, spacing, type sizes, radii come from tokens. A raw hex or px value in a component is a review finding — and Stylelint/ESLint block most of them mechanically ([design/tokens.md](design/tokens.md)).

## Reuse before writing

- **Prefer the framework's own primitive.** Before writing a helper, check whether Payload or Next already ships it — Payload especially hides useful things (`slugField()`, `imageSizes`, `formatOptions`, access-control helpers). The built-in handles edge cases you haven't hit yet. If you do hand-write one, note in a comment what you checked and why it didn't fit, so the next person re-evaluates on upgrade instead of assuming oversight.
- **Blocks are a closed set.** Editors pick from `src/payload/blocks/`. Adding one is a deliberate change with owner sign-off, not a convenience — see [workflows/adding-a-block.md](workflows/adding-a-block.md).

## TypeScript

- **Avoid `as` assertions.** Narrow with a runtime check (`typeof`, `in`, a type guard) instead.

## Comments

Comments here carry _why_, not _what_ — that part is not in dispute. What needs a rule is **where the why lives when more than one place could hold it.** Decide by asking what invalidates the text:

- **Dies with the code it sits on** → inline, in full. Module contracts (packer ordering, lane derivation, PRNG seeding) stay in the module. A doc restating them would violate the "docs don't restate code" rule.
- **Two files must agree on a value** (a JS constant hand-mirrored in CSS) → full explanation at the **owner**, a one-line pointer at every mirror, and a test that fails on drift. Never two copies of the argument.
- **Already written in a doc** → the doc wins; inline shrinks to a pointer naming the section. Env validation, `push: false`, CDN cache strategy are all `docs/workflows/*` policy, not file-local facts.
- **Same argument in two source files** → pick one owner, usually the file where the behaviour is actually implemented, and point from the other.

Two copies of a rationale is the failure mode, not a long comment. Length is fine; divergence is not.
