---
color:
  cream: '#fffcf5'
  ink: '#1a1a1a'
  charcoal: '#44403c'
  muted: '#8a8681'
  black: '#000000'
  white: '#ffffff'
  red: '#cc0000'
  blue: '#0000eb'
  redTint: 'color-mix(in srgb, #cc0000 12%, #fffcf5)'
  blueTint: 'color-mix(in srgb, #0000eb 12%, #fffcf5)'
type:
  display: 'Shantell Sans'
  body: 'system-ui, -apple-system, "Segoe UI", "Helvetica Neue", sans-serif'
  minViewport: 320
  maxViewport: 1440
  minSize: 18
  maxSize: 21
  minRatio: 1.2
  maxRatio: 1.25
  steps: [-2, -1, 0, 1, 2, 3, 4, 5]
shape:
  radiusS: '12px'
  radiusM: '18px'
  radiusL: '24px'
  borderWidth: '0.2em'
  shadowOffset: '5px'
  focusOffset: '3px'
motion:
  durationFast: '150ms'
  durationBase: '300ms'
  durationSweep: '600ms'
---

# Design

**Purpose:** the values above plus the invariants below are the source of truth for every visual decision. `src/styles/tokens/` implements the values as CSS custom properties; this file is where they're decided and why.

**Read this when:** styling anything, reviewing a PR that touches colour/type/space/shape, or wondering whether a value belongs here or in a component.

---

## Character

Rounded neo-brutalism. Loud colour-blocking and hard offset shadows — brutalism's raw honesty — softened by generous corner radii and a warm, hand-crafted palette instead of stark white/black. Reads as kindergarten craft-table, not corporate, not harsh. Every v3 motif is dropped; nothing carries over by inertia.

---

## Invariants

1. **No pure white or pure black as a text/background pair.** Background is warm cream (`color.cream`). Heading text is near-black (`color.ink`); body text is a visibly softer charcoal (`color.charcoal`) — the difference in darkness _is_ the heading/body emphasis signal, not a separate font-weight rule.
2. **Border and shadow stay pure black.** These are structural lines, not a text/background contrast pair, so the "no pure black" rule above does not apply to them. This is deliberate, not an inconsistency.
3. **Red and blue are identity accents, not surface colours.** Full-saturation `color.red` / `color.blue` are reserved for small interactive or identity elements: buttons, badges, links, the highlighter band, the wordmark. Any large fill — section background, decorative shape, card tint — uses the corresponding tint (`color.redTint` / `color.blueTint`), never the raw accent. Large-area full saturation reads as aggressive, not playful, once stacked against the brutalist border/shadow/texture already carrying the "loud" signal.
4. **Contrast is checked on the pair actually rendered, not the token in isolation.** Every pair must clear 4.5:1 for body-sized text. Verified: ink-on-cream 16.98:1, charcoal-on-cream 10.02:1, white-on-red 5.89:1, white-on-blue 9.55:1, red-on-cream 5.74:1, blue-on-cream 9.31:1. Add a line here when a new pair enters production use.
5. **No soft shadows, ever.** Only the hard offset shadow (`shape.shadowOffset`, zero blur, pure black) exists in this system. A `box-shadow` with any blur radius is a review finding — this is the opposite of a quiet/editorial system's rule, and the difference is deliberate, not an oversight to "fix" later.
6. **No fixed-width media queries.** Layout responds through the primitives in `src/styles/compositions/` (container-relative flex-basis math), not `@media (min-width: …)` breakpoints. A media query for layout positioning is the v3 anti-pattern this system exists to delete.
7. **Every animation is gated on `prefers-reduced-motion`.** Highlighter-band sweep, button hover-lift/press, accordion expand — all must have a reduced-motion fallback that changes state instantly with no transition.
8. **No raw hex, rgb, or px value in a component.** If no token fits, the token set is incomplete — add one to `src/styles/tokens/` and document it here, rather than hand-writing a value. Enforced by ESLint for `.ts`/`.tsx` and Stylelint for `.css`/`.module.css`.
9. **Corners are always rounded.** No component ships a sharp 0-radius corner — that reads as classic brutalism, not this system's rounded variant. Buttons trend pill-like (`shape.radiusL`); cards and inputs use `shape.radiusM`; small elements (badges, chips) use `shape.radiusS`.
10. **Focus is a solid black outline, never a soft ring.** `outline: shape.borderWidth solid color.black`, offset by `shape.focusOffset` — same structural-black language as border/shadow (invariant 2), not a browser-default blue glow or a blurred box-shadow ring. Applies on `:focus-visible` only; shown or hidden instantly, no transition, regardless of `prefers-reduced-motion`.

---

## Colour

Two brand accents, each with a tint for large fills, over a warm cream/ink/charcoal neutral base plus one muted grey step.

| Token               | Value                                                           | Use                                                                   |
| ------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------- |
| `--color-cream`     | `#fffcf5`                                                       | Page background. The system's "white."                                |
| `--color-ink`       | `#1a1a1a`                                                       | Heading text, high-emphasis content. The system's "black" for text.   |
| `--color-charcoal`  | `#44403c`                                                       | Body text — deliberately lighter than heading text.                   |
| `--color-muted`     | `#8a8681`                                                       | Muted text, subtle dividers, disabled states only.                    |
| `--color-black`     | `#000000`                                                       | Border, shadow. Structural only — never text or a fill.               |
| `--color-white`     | `#ffffff`                                                       | Text on full-saturation accent fills (buttons, badges).               |
| `--color-red`       | `#cc0000`                                                       | "Power" identity accent — buttons, badges, links, wordmark half.      |
| `--color-blue`      | `#0000eb`                                                       | "Kids" identity accent — same use set as red.                         |
| `--color-red-tint`  | `color-mix(in srgb, var(--color-red) 12%, var(--color-cream))`  | Large fills only: section backgrounds, decorative shapes, card tints. |
| `--color-blue-tint` | `color-mix(in srgb, var(--color-blue) 12%, var(--color-cream))` | Same, blue half.                                                      |

v3 carried a full shadcn neutral ramp (`--muted-foreground`, `--ring`, `--destructive`, etc.) that was mostly unused boilerplate — none of it is reintroduced here. One muted step covers every "quiet" need this system actually has.

## Type

Two families: Shantell Sans for display (headings, wordmark), system stack for body.

- Shantell Sans self-hosted as a trimmed variable font — weight axis only, "Bounce" axis dropped, Latin subset. Never Marker Felt, never Comic Sans MS, including as a fallback.
- Body uses the platform's own default sans, Roboto excluded, so Android falls to a narrower system alternative: `system-ui, -apple-system, "Segoe UI", "Helvetica Neue", sans-serif`.
- Fluid scale via Utopia: 320px viewport → 18px base at 1.2 ratio, up to 1440px viewport → 21px base at 1.25 ratio. Steps `-2` through `5`. Ratios stay close together deliberately — a wider gap (e.g. 1.333) inverts the scale at step `-2` (max ends up smaller than min), since it compounds over more steps than the max side's larger multiplier can outrun. These are entry values — first thing to tune once real content renders on the kitchen sink, not a measured final.

## Space

Fluid scale (Utopia-generated, same mechanism as type: 320px → 1440px viewport), consumed by the layout primitives through their own custom properties (`--flow-space`, `--cluster-gap`, `--grid-item-min`, etc.) — components never set spacing directly.

Tiers are multiples of the step-0 base (18px min / 21px max): `3xs` .25x, `2xs` .5x, `xs` .75x, `s` 1x, `m` 1.5x, `l` 2x, `xl` 3x, `2xl` 4x, `3xl` 6x, `4xl` 8x.

## Shape

- Radius: `--radius-s: 12px` (badges, chips), `--radius-m: 18px` (cards, inputs), `--radius-l: 24px` (buttons, pill-leaning elements)
- Border: `--border-width: 0.2em`, always `--color-black`
- Shadow: `--shadow-offset: 5px`, always `--color-black`, zero blur — the one hard offset shadow, no variants
- Focus: `--focus-offset: 3px`, outline `--border-width` thick, always `--color-black` — a solid offset outline on `:focus-visible`, no glow, no blur

## Motion

- `--duration-fast: 150ms` — button hover-lift
- `--duration-base: 300ms` — accordion expand, general transitions
- `--duration-sweep: 600ms` — highlighter-band slide-in
- All wrapped in `@media (prefers-reduced-motion: no-preference)`; the no-motion path is the default, not an override.

---

## Related

- What each token is _for_: `docs/design/tokens.md`
- Layout primitives: `docs/design/layout-primitives.md`
- Component inventory: `docs/design/components.md`
- What v3 used and why it changed: `docs/reference/v3-design-audit.md`
