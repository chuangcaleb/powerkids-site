# Design Tokens

**Purpose:** what each token _means_ — pick the right one, not the closest-looking one.
**Read this when:** styling anything. `DESIGN.md` holds the values; this holds the intent.

> **Status: not yet implemented.** Phase 2 authors `DESIGN.md` and `src/styles/tokens/`. This page is the shape it will take.

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

A raw hex, px, or rem value in a component is a review finding. If no token fits, token set is incomplete — add one and document it, rather than working around it.

---

## Groups

**Colour.** Two brand accents plus a neutral ramp. Semantic aliases (`--text-strong`, `--bg-surface`, `--border-strong`) sit over raw palette values; components use the aliases. From the audit: v3 red fails AA at body size. Contrast constraints belong in `DESIGN.md` as invariants, not folklore.

**Type.** Fluid scale via Utopia, steps `-2` through `5`. Two families: marker/display face for headings, wordmark, and pills; body sans for everything else. Font licensing is open Phase 2 question — see audit.

**Space.** Fluid scale, `3xs` through `4xl`, shared by padding, gaps, and flow spacing. Primitives consume these through own custom properties.

**Shape.** Radius scale, plus signature hard offset shadow and thick border. Soft blurred shadows out of the language.

**Motion.** Durations and easings for highlight sweep, hovers, and accordion. Every one gated on `prefers-reduced-motion`.

---

## Related

- Values and invariants: `DESIGN.md` _(Phase 2)_
- What v3 used, and what to fix: [../reference/v3-design-audit.md](../reference/v3-design-audit.md)
- Layout: [layout-primitives.md](layout-primitives.md)
