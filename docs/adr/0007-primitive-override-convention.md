# 0007. Layout primitive override convention

**Status:** accepted
**Date:** 2026-08-25

## Context

Every layout primitive in `src/styles/compositions/` exposes its tunable knobs as CSS custom properties with fallback defaults (`gap: var(--cluster-gap-y) var(--cluster-gap-x)`). Overriding one at a call site had drifted into two competing patterns with no stated rule between them:

- inline `style={{ '--cluster-gap': '...' } as CSSProperties}` on the element
- the same property set from the call site's own CSS Module class (`.nav { --cluster-gap: var(--space-s); }`), applied via `cx('cluster', styles.nav)`

Neither was wrong in isolation, but nothing said which to reach for, so the two were mixed arbitrarily across `nav-bar`, `footer-nav`, `footer-contact`, and `framed-rows`. A new contributor (human or agent) had no way to tell, from the convention alone, which pattern a new override should use — and the module-CSS sites made it look like either was fine everywhere, which isn't true: media queries, pseudo-classes (`:hover`), and structural/combinator selectors (`:nth-child`, `> li + li`) can only be expressed in CSS, never through the `style` prop.

## Decision

**Default: inline, via a typed helper.** `primitiveVars()` (`src/lib/primitive-vars.ts`) wraps the `style` prop:

```tsx
<nav className="cluster" style={primitiveVars({ '--cluster-gap': 'var(--space-s)' })}>
```

Its parameter type is checked against `PrimitiveVar`, the union of every layout primitive's own custom property names — not a per-primitive union chosen per call. A typo'd or non-existent var name is a type error regardless of which primitive it belongs to, and because the check spans all primitives at once, one call can mix vars from several of them on the same node (e.g. `--cluster-gap` with `--wrapper-max-width`) without any extra annotation. Each primitive's var array (`clusterVars`, `switcherVars`, ...) is checked against its `compositions/*.css` file by `src/lib/primitive-vars.test.ts` — a typo or a var renamed on one side and not the other fails the suite, per the "two files must agree on a value" rule in [coding-standards.md](../coding-standards.md).

**Exception 1: CSS Module selector, only when the override needs a capability `style` cannot express** — a media/container query, a pseudo-class, or a structural/combinator selector targeting something other than the element itself (e.g. `.row:nth-child(2n of .row) .switcher { flex-direction: row-reverse; }` in `framed-rows.module.css`). A plain, unconditional override belongs inline.

**Exception 2: `flow`'s `.flow-[size]` utility classes.** `--flow-space` is the one primitive var where every real-world override is a bare token off the spacing scale — a single, closed, single-axis enum used dozens of times per page — so the existing `.flow-3xs`…`.flow-2xl` classes stay as the way to set it, not `primitiveVars()`. Every other primitive's overrides are typically computed values, fallback chains, or several vars set together, where the typed helper earns its keep; `flow` doesn't have that shape.

Uniform overrides previously sitting in Module files with no structural/state reason (across `nav-bar`, `framed-rows`, `footer-nav`, `footer-contact`, `accordion`, `card`, `render-hero`, and the kitchen-sink dev page) moved to `primitiveVars()` at their call sites as part of this change, so exception 1 stays genuinely rare rather than a second normal path.

## Consequences

**Makes easy.** One place to look for "does this instance override the default" — the JSX, not a Module-file hop. `grep -- '--cluster-gap'` finds every real override. A typo'd var name is a type error, not a silently-ignored custom property. Overriding several primitives' vars on one node needs no extra ceremony.

**Makes hard.** Adding a new primitive knob means remembering to add it to the matching array in `primitive-vars.ts`, or the drift test fails — a small tax, caught immediately by `pnpm test`, not a surprise later.

**Costs.** Two exception rules (structural CSS, `flow`'s utility classes) each require judgement rather than a mechanical check. Reviewers need to know both to catch a Module-file override that should have been inline, or an inline `--flow-space` that should have been a `.flow-*` class.

## Alternatives considered

**Module CSS class as the default, inline as the exception.** Rejected: buries the override a file away from the call site, and the sites already doing this (before this ADR) looked identical to the sanctioned structural exception, so a reader couldn't tell which was load-bearing.

**Fixed-step utility classes per primitive** (extending `flow`'s `.flow-3xs`…`.flow-2xl` pattern to `cluster`, `switcher`, etc.). Rejected for every primitive except `flow` itself: multiplies each primitive's CSS file with pre-baked values, which is what `layout-primitives.md` already says stays in code files as knobs, not as an enumerated set of steps. `flow` is kept as the deliberate exception (see Decision) because its override is uniquely a closed single-value enum; the other primitives' overrides aren't.

**Data attribute + attribute-selector CSS** (`data-gap="2xs"`, `[data-gap='2xs']{--cluster-gap:...}`). Rejected: still needs a CSS rule per value maintained somewhere, adds a second lookup surface (attribute name to CSS token) without removing the file-hop cost of the Module-class option it's replacing.

**Wrapper components** (`<Cluster gap="2xs">`) translating a typed prop into the underlying custom property. Rejected: turns primitives from "any element + a class" into a component API, which cuts against 0003's choice of composable CSS classes over a framework layer; revisit only if the primitives outgrow plain classes for other reasons.

**Loose `primitiveVars(vars: Record<string, string>)` signature** (no type checking at all). Rejected: the entire point is catching a typo'd or renamed var name at compile time; a loose signature gives up that guarantee for no savings, since the var arrays already have to exist for the drift test.

**Per-primitive generic, chosen per call** (`primitiveVars<ClusterVars>({...})`). Tried first, reverted: nothing forces the caller to actually supply the generic, so a typo'd key still type-checked fine — TypeScript just inferred the union from whatever keys were written, giving no real protection. It also meant overriding two primitives' vars on the same node needed an awkward manual union (`primitiveVars<ClusterVars | WrapperVars>({...})`) chosen by hand at every such call site. Checking against the single `PrimitiveVar` union spanning every primitive gives the same typo protection without relying on the caller remembering an annotation, and mixing primitives falls out for free.

**Helper named `cssVars()`.** Renamed to `primitiveVars()`: the original name implied it handled any CSS custom property, but it's deliberately scoped to layout-primitive vars only — component-owned vars (`--sticker-rotate`, `--polaroid-tilt`) still use a plain `style` object, and a name suggesting broader scope invited exactly that confusion.
