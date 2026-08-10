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

**Colour.** Three brand accents (`--accent-red`, `--accent-blue`, `--accent-amber`, full saturation) plus a light-tint variant of each (`--accent-red-fill`, etc.) for large fills — raw accents are for small interactive/identity elements only, tints are for backgrounds and shapes. Tints are hand-authored hex, not `color-mix()` output — a computed tint drifted below the contrast floor once actually measured, so every tint is now a value someone looked at and checked. Neutrals are warm, not pure white/black: `--bg-surface` (cream), `--text-strong` (near-black, headings), `--text-body` (softer charcoal, deliberately lighter than headings — that gap _is_ the heading/body emphasis signal), `--text-muted` (one grey step, muted text/disabled only), `--border-strong` / `--shadow-colour` (pure black — structural lines are exempt from the no-pure-black rule). `--bg-sun` and `--bg-contact` are single-use whole-section grounds (hero, contact/footer band) — named for their role directly, no separate base-palette twin, since neither has a second use to decouple from. Components use the aliases, never the raw palette values in `colour.css` directly.

Verified pairs (contrast ratio, 4.5:1 floor): ink-on-cream 18.05:1, charcoal-on-cream 9.45:1, white-on-red 5.38:1, white-on-blue 8.82:1, white-on-contact 8.75:1, red-on-cream 4.93:1, blue-on-cream 8.61:1, amber-on-cream 5.02:1, ink/charcoal on each tint 7.9–16.2:1, ink/black-on-sun 11.99/13.64:1, footer text-on-black 12.27/21.0:1. Add a line when a new pair enters production use. **Never use opacity to soften text colour** — it composites against whatever's behind it, so its effective contrast isn't reviewable from the token alone; a past "55% opacity accent text" pass measured at 1.85–2.80:1, roughly half the floor, for exactly this reason.

**Type.** Fluid scale via Utopia, two regimes: steps `-2` to `2` (caption through h5/h4) compound from a tight ratio; steps `3`–`5` (h3/h2/h1) are explicit hand-picked pairs, since compounding one ratio that far inverts at one end. Two families: `--font-display` is `--font-bricolage-grotesque` (partial variable — `wdth` pinned to 90 at build time, `opsz`/`wght` left variable, italic dropped, no Marker Felt/Comic Sans ever); `--font-body` is `--font-archivo` (`next/font/google`, weights 400–700, no axis worth pinning). `font-optical-sizing: auto` is set globally so Bricolage's `opsz` tracks each element's rendered size automatically — a no-op on Archivo. `Button` reads `--font-display` (see `docs/design/components.md`); a coloured pill/badge reads `--font-body` at a smaller step — neither needs a third face.

**Space.** Fluid scale, `3xs` through `4xl`, shared by padding, gaps, and flow spacing. Primitives consume these through own custom properties.

**Shape.** `--radius-s/m/l` and `--radius-pill` separate roles by radius, not by shadow: buttons stay only slightly rounded (`--radius-l`), pills are always fully round (`--radius-pill`) **and** always carry a shadow — shadow is not an exclusive affordance signal for interactivity here. `--shadow-hard` (zero blur, pure black, `--shadow-offset: 9px`) is the signature; `--shadow-hard-pill` is the same at a lighter `--pill-shadow-offset: 3px`. `--border-width: 6px` structural border, `--pill-border-width: 3px` for pills, `--stroke-width: 3px` for the footer's outline wordmark. No soft/blurred shadow variant exists in the language — `box-shadow` itself is Stylelint-gated to token values only, so one can't be hand-rolled.

**Motion.** `--duration-fast/base/sweep` for the button hover-lift/press, accordion, and (pending replacement) `Mark`'s highlighter sweep; `--ease-playful` (springy overshoot, buttons) and `--ease-standard` (plain deceleration, sweep/accordion) are `motion.css`'s own addition, not yet named in `DESIGN.md` — first thing to eyeball on the kitchen sink. Every consumer gates on `prefers-reduced-motion`, no exceptions.

**Doodle.** `--doodle-opacity/size-min/size-max/travel` are the pure-presentation knobs for a decorative background-mark layer, not yet built. Density stays a component prop, not a token, since it has a layout cost (drives how many marks get generated) rather than just a paint cost.

---

## Related

- Values and invariants: `DESIGN.md` _(Phase 2)_
- What v3 used, and what to fix: [../reference/v3-design-audit.md](../reference/v3-design-audit.md)
- Layout: [layout-primitives.md](layout-primitives.md)
