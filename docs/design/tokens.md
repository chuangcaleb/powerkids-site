# Design Tokens

**Purpose:** what each token _means_ — pick the right one, not the closest-looking one.
**Read this when:** styling anything. `DESIGN.md` holds the values; this holds the intent.

---

## Division of labour

| Where                | Holds                                                                      |
| -------------------- | -------------------------------------------------------------------------- |
| `DESIGN.md`          | The values, and the invariants that constrain them                         |
| `src/styles/tokens/` | Those values as CSS custom properties — the implementation source of truth |
| This page            | What each token is _for_, and which to reach for when                      |

Never duplicate values here. If a number appears both here and in `DESIGN.md`, one is already wrong.

---

## Rule

A raw hex, colour function, or px value in a component is a review finding. If no token fits, token set is incomplete — add one and document it, rather than working around it.

Enforced mechanically, not just by eye: ESLint (`no-restricted-syntax`) blocks raw hex/colour-function literals in `.ts`/`.tsx`; Stylelint (`.stylelintrc.json`, `scale-unlimited/declaration-strict-value` + `color-no-hex` + `unit-disallowed-list`) blocks raw hex, colour functions, and `px` units in `.css`/`.module.css`. `src/styles/tokens/**` itself is exempt from Stylelint — that's the one place raw values are the source of truth for everything else.

---

## Groups

**Colour.** Two brand accents (`--accent-red`, `--accent-blue`, full saturation) plus a light-tint variant of each (`--accent-red-fill`, `--accent-blue-fill`) for large fills — raw accents are for small interactive/identity elements only, tints are for backgrounds and shapes. Neutrals are warm, not pure white/black: `--bg-surface` (cream), `--text-strong` (near-black, headings), `--text-body` (softer charcoal, deliberately lighter than headings — that gap _is_ the heading/body emphasis signal), `--text-muted` (one grey step, muted text/disabled only), `--border-strong` / `--shadow-colour` (pure black — structural lines are exempt from the no-pure-black rule). Components use the aliases, never the raw palette values in `colour.css` directly. Contrast constraints are invariants in `DESIGN.md`.

**Type.** Fluid scale via Utopia, steps `-2` through `5`. Two families: `--font-display` (Shantell Sans, trimmed variable — weight axis only, no Bounce, no Marker Felt/Comic Sans ever) for headings and the wordmark; `--font-body` (system stack, Roboto excluded) for everything else. No Pill or SuperHead component exists — there's no coloured-eyebrow-label pattern to carry a third face.

**Space.** Fluid scale, `3xs` through `4xl`, shared by padding, gaps, and flow spacing. Primitives consume these through own custom properties.

**Shape.** `--radius-s/m/l` trend large and pill-leaning (rounded neo-brutalism, not sharp-cornered classic brutalism), plus the one signature hard offset shadow (`--shadow-hard`, zero blur, pure black) and thick border (`--border-width`). No soft/blurred shadow variant exists in the language — `box-shadow` itself is Stylelint-gated to token values only, so one can't be hand-rolled.

**Motion.** `--duration-fast/base/sweep` for the button hover-lift/press, accordion, and link/nav highlighter-band sweep; `--ease-playful` (springy overshoot, buttons) and `--ease-standard` (plain deceleration, sweep/accordion) are `motion.css`'s own addition, not yet named in `DESIGN.md` — first thing to eyeball on the kitchen sink. Every consumer gates on `prefers-reduced-motion`, no exceptions.

---

## Related

- Values and invariants: `DESIGN.md` _(Phase 2)_
- What v3 used, and what to fix: [../reference/v3-design-audit.md](../reference/v3-design-audit.md)
- Layout: [layout-primitives.md](layout-primitives.md)
