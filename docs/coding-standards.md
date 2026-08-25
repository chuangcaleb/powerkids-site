# Code Conventions

**Purpose:** how code in `src/` is written here, where the choice isn't the framework default.
**Read when:** writing or reviewing any code in `src/`.

---

## Structure

- **kebab-case filenames**, always — including block renderers (`component.tsx`, not `Component.tsx`). Named exports preferred.
- **Server components by default.** `"use client"` only when the component genuinely needs interactivity; say why in a comment.

## Styling

- **No CSS framework.** Layout composes from primitives in `src/styles/compositions/`; component styles are scoped CSS Modules. Layout wants a media query — check the primitives first ([design/layout-primitives.md](design/layout-primitives.md)).
- **Override a layout primitive's custom property inline, with `primitiveVars()`** (`src/lib/primitive-vars.ts`), not from a CSS Module class:

  ```tsx
  style={primitiveVars({ '--cluster-gap': 'var(--space-s)' })}
  ```

  A typo'd or non-existent var name is a type error, not a silently-ignored property — no need to name a specific primitive's union, the helper checks against every primitive's vars at once, so one call can freely mix vars from more than one primitive on the same node (`--cluster-gap` with `--wrapper-max-width`, say). `primitive-vars.test.ts` asserts each primitive's var array matches its `compositions/*.css` file — update both together, or the suite fails on drift ([0007](adr/0007-primitive-override-convention.md)).
  Only reach for a Module CSS selector instead when the override needs something `style` genuinely cannot express — a media/container query, a pseudo-class (`:hover`), or a structural/combinator selector (`:nth-child`, `> li + li`) targeting something other than the element itself. A plain, unconditional override belongs inline even if the element already has a Module class for other reasons.
  `flow` is the one primitive with an exception to "inline": use its `.flow-[size]` utility classes (`.flow-3xs`…`.flow-2xl`) for spacing, not `primitiveVars()` — see [design/layout-primitives.md](design/layout-primitives.md) for why.
  `primitiveVars()` is scoped to layout-primitive vars only — a component's own custom property (`--sticker-rotate`, `--polaroid-tilt`, ...) still just takes a plain `style` object.

- **No magic values.** Colours, spacing, type sizes, radii come from tokens. A raw hex or px value in a component is a review finding — and Stylelint/ESLint block most of them mechanically ([design/tokens.md](design/tokens.md)).

## Reuse before writing

- **Prefer the framework's own primitive.** Before writing a helper, check whether Payload or Next already ships it — Payload especially hides useful things (`slugField()`, `imageSizes`, `formatOptions`, access-control helpers). The built-in handles edge cases you haven't hit yet. If you do hand-write one, note in a comment what you checked and why it didn't fit, so the next person re-evaluates on upgrade instead of assuming oversight.
- **Blocks are a closed set.** Editors pick from `src/payload/blocks/`. Adding one is a deliberate change with owner sign-off, not a convenience — see [workflows/adding-a-block.md](workflows/adding-a-block.md).

## Comments

Comments here carry _why_, not _what_ — that part is not in dispute. What needs a rule is **where the why lives when more than one place could hold it.** Decide by asking what invalidates the text:

- **Dies with the code it sits on** → inline, in full. Module contracts (packer ordering, lane derivation, PRNG seeding) stay in the module. A doc restating them would violate the "docs don't restate code" rule.
- **Two files must agree on a value** (a JS constant hand-mirrored in CSS) → full explanation at the **owner**, a one-line pointer at every mirror, and a test that fails on drift. Never two copies of the argument.
- **Already written in a doc** → the doc wins; inline shrinks to a pointer naming the section. Env validation, `push: false`, CDN cache strategy are all `docs/ops/*` policy, not file-local facts.
- **Same argument in two source files** → pick one owner, usually the file where the behaviour is actually implemented, and point from the other.

Two copies of a rationale is the failure mode, not a long comment. Length is fine; divergence is not.
