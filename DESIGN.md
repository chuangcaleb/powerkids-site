---
color:
  cream: '#fffcf7'
  ink: '#171310'
  charcoal: '#4c433a'
  muted: '#8a8681'
  black: '#000000'
  white: '#ffffff'
  sun: '#ffc929'
  contact: '#2435c6'
  red: '#cc2828'
  blue: '#1f30cf'
  amber: '#a15d0c'
  redTint: '#ffe6e4'
  blueTint: '#e4e7ff'
  amberTint: '#fdeeda'
type:
  display: 'Bricolage Grotesque'
  body: 'Archivo'
  width: 90
  minViewport: 320
  maxViewport: 1440
  caption:
    minSize: 17
    maxSize: 20
    minRatio: 1.2
    maxRatio: 1.25
    steps: [-2, -1, 0, 1, 2]
  display:
    steps:
      3: { minSize: 28, maxSize: 48 }
      4: { minSize: 34, maxSize: 62 }
      5: { minSize: 40, maxSize: 90 }
shape:
  radiusS: '0.75rem'
  radiusM: '1.125rem'
  radiusL: '1.4375rem'
  radiusPill: '999px'
  borderWidth: '0.375rem'
  pillBorderWidth: '0.1875rem'
  strokeWidth: '0.1875rem'
  shadowOffset: '0.5625rem'
  pillShadowOffset: '0.1875rem'
  focusOffset: '0.1875rem'
motion:
  durationFast: '150ms'
  durationBase: '300ms'
  durationSweep: '600ms'
doodle:
  opacity: 0.07
  sizeMin: '20px'
  sizeMax: '100px'
  travel: '170px'
---

# Design

**Purpose:** the values above plus the invariants below are the source of truth for every visual decision. `src/styles/tokens/` implements the values as CSS custom properties; this file is where they're decided and why.

**Read this when:** styling anything, reviewing a PR that touches colour/type/space/shape, or wondering whether a value belongs here or in a component.

---

## Character

Warm, hand-crafted brutalism — loud colour-blocking and a hard offset shadow, softened by a narrow, rounded grotesque display face and pastel accent tints instead of stark white/black. Reads as kindergarten craft-table, not corporate, not harsh.

---

## Invariants

1. **No pure white or pure black as a text/background pair.** Background is warm cream (`color.cream`). Heading text is near-black (`color.ink`); body text is a visibly softer charcoal (`color.charcoal`) — the difference in darkness _is_ the heading/body emphasis signal, not a separate font-weight rule.
2. **Border and shadow stay pure black.** These are structural lines, not a text/background contrast pair, so the "no pure black" rule above does not apply to them. This is deliberate, not an inconsistency.
3. **Red, blue, and amber are identity accents, not surface colours.** Full-saturation values are for small interactive/identity elements only; any large fill uses the matching tint (`color.redTint` / `color.blueTint` / `color.amberTint`), never the raw accent.
4. **Contrast is checked on the pair actually rendered, not the token in isolation.** Every pair must clear 4.5:1 for body-sized text — opacity counts, since it composites against whatever's behind it; never use opacity to soften text colour. Verified pairs and workings: `docs/design/tokens.md`. Add a line there when a new pair enters production use.
5. **No soft shadows, ever.** Only the hard offset shadow (`shape.shadowOffset`, zero blur, pure black) exists in this system. A `box-shadow` with any blur radius is a review finding — this is the opposite of a quiet/editorial system's rule, and the difference is deliberate, not an oversight to "fix" later.
6. **No fixed-width media queries.** Layout responds through the primitives in `src/styles/compositions/` (container-relative flex-basis math), not `@media (min-width: …)` breakpoints. A media query for layout positioning is the v3 anti-pattern this system exists to delete.
7. **Every animation is gated on `prefers-reduced-motion`.** Button hover-lift/press, accordion expand — all must have a reduced-motion fallback that changes state instantly with no transition.
8. **No raw hex, rgb, or px value in a component.** If no token fits, the token set is incomplete — add one to `src/styles/tokens/` and document it here, rather than hand-writing a value. Enforced by ESLint for `.ts`/`.tsx` and Stylelint for `.css`/`.module.css`.
9. **Corners are always rounded.** No component ships a sharp 0-radius corner. Buttons are only slightly rounded (`shape.radiusL`); pills are always fully round (`shape.radiusPill`) **and** always carry a shadow — radius, not shadow, tells a pill and a button apart. Cards and inputs use `shape.radiusM`; small elements (badges, chips) use `shape.radiusS`.
10. **Focus is a solid black outline, never a soft ring.** `outline: shape.borderWidth solid color.black`, offset by `shape.focusOffset` — same structural-black language as border/shadow (invariant 2), not a browser-default blue glow or a blurred box-shadow ring. Applies on `:focus-visible` only; shown or hidden instantly, no transition, regardless of `prefers-reduced-motion`.

---

## Colour

Three brand accents, each with a tint for large fills, over a warm cream/ink/charcoal neutral base plus one muted grey step and two saturated surface colours (`sun`, `contact`) used whole-section, not as text/fill pairs. What each token is _for_: `docs/design/tokens.md`.

| Token                 | Value     |
| --------------------- | --------- |
| `--colour-cream`      | `#fffcf7` |
| `--colour-ink`        | `#171310` |
| `--colour-charcoal`   | `#4c433a` |
| `--colour-muted`      | `#8a8681` |
| `--colour-black`      | `#000000` |
| `--colour-white`      | `#ffffff` |
| `--bg-sun`            | `#ffc929` |
| `--bg-contact`        | `#2435c6` |
| `--colour-red`        | `#cc2828` |
| `--colour-blue`       | `#1f30cf` |
| `--colour-amber`      | `#a15d0c` |
| `--colour-red-tint`   | `#ffe6e4` |
| `--colour-blue-tint`  | `#e4e7ff` |
| `--colour-amber-tint` | `#fdeeda` |

v3 carried a full shadcn neutral ramp (`--muted-foreground`, `--ring`, `--destructive`, etc.) that was mostly unused boilerplate — none of it is reintroduced here. One muted step covers every "quiet" need this system actually has.

## Type

Two families: Bricolage Grotesque for display (`--font-display`, headings + anything using the `.disp`/`.wm`-equivalent treatment), Archivo for body (`--font-body`, running copy and UI chrome — nav, pills, labels). `Button` is display-face text, not body — see `docs/design/components.md`.

- Bricolage Grotesque self-hosted as a partial variable font: `wdth` pinned to a fixed **90** (narrow) at build time, not a runtime knob; `opsz` and `wght` stay variable. Latin subset, no italic. Build command: `src/styles/fonts/bricolage-grotesque/NOTES.md`.
- Archivo loaded via `next/font/google` (self-hosted at build time, no runtime request) — no axis worth pinning, so no manual pipeline. Weights `400`–`700`.
- `font-optical-sizing: auto` set globally for Bricolage's `opsz` axis; harmless no-op on Archivo.
- Two regimes in the fluid scale, both via Utopia (320px → 1440px viewport): caption through h5/h4 (steps `-2` to `2`) compound from a tight ratio (17px/1.2 min → 20px/1.25 max); h3/h2/h1 (steps `3`–`5`) are explicit hand-picked pairs instead — `28px→48px`, `34px→62px`, `40px→90px` — since a single ratio compounded that far inverts at one end.
- Entry values — first thing to tune once real content renders on the kitchen sink, not a measured final.
- `--size-wordmark: clamp(3.5rem, 3rem + 8vw, 8rem)` — outside the h1–h5 scale on purpose, sized for the footer's outline wordmark only.

## Space

Fluid scale (Utopia-generated, same mechanism as type: 320px → 1440px viewport), consumed by the layout primitives through their own custom properties (`--flow-space`, `--cluster-gap`, `--grid-item-min`, etc.) — components never set spacing directly.

Tiers are multiples of the step-0 base (17px min / 20px max): `3xs` .25x, `2xs` .5x, `xs` .75x, `s` 1x, `m` 1.5x, `l` 2x, `xl` 3x, `2xl` 4x, `3xl` 6x, `4xl` 8x.

## Shape

- Radius, border, shadow, and focus offset are all `rem`-based, not `px` — they scale with the user's root font-size preference, same axis as type and space, rather than staying fixed while the text around them grows.
- Radius: `--radius-s: 0.75rem` (badges, chips), `--radius-m: 1.125rem` (cards, inputs), `--radius-l: 1.4375rem` (buttons — only slightly rounded), `--radius-pill: 999px` (pills — always fully round; not a real measurement, so it stays `px`)
- Border: `--border-width: 0.375rem`, always `--colour-black`. Pills use a lighter `--pill-border-width: 0.1875rem`. `--stroke-width: 0.1875rem` covers the footer's outline wordmark.
- Shadow: `--shadow-offset: 0.5625rem`, always `--colour-black`, zero blur — the one hard offset shadow, no soft variants. Pills carry a lighter `--pill-shadow-offset: 0.1875rem` shadow of their own (invariant 9).
- Focus: `--focus-offset: 0.1875rem`, outline `--border-width` thick, always `--colour-black` — a solid offset outline on `:focus-visible`, no glow, no blur

## Motion

- `--duration-fast: 150ms` — button hover-lift
- `--duration-base: 300ms` — accordion expand, general transitions
- `--duration-sweep: 600ms` — `Mark`'s double-underline draw-in
- All wrapped in `@media (prefers-reduced-motion: no-preference)`; the no-motion path is the default, not an override.

## Doodle layer

Decorative background marks, not yet built. `--doodle-opacity: 0.07`, `--doodle-size-min: 20px`, `--doodle-size-max: 100px`, `--doodle-travel: 170px` (parallax distance). Density is a component prop, not a token — it has a layout cost, not just a paint cost. Implementation traps: `docs/phases/phase-4-rendering.md`.

---

## Related

- What each token is _for_: `docs/design/tokens.md`
- Layout primitives: `docs/design/layout-primitives.md`
- Component inventory: `docs/design/components.md`
- What v3 used and why it changed: `docs/reference/v3-design-audit.md`
