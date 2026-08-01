# Phase 2 — Design System

**Goal:** tokens, layout primitives, and component layer, all rendered on one kitchen-sink page.

Owner tweaks most here. Highest-drift phase — agents invent colours and one-off spacing. `DESIGN.md` invariants exist to make that a reviewable violation, not a matter of taste.

---

## Pre

- [x] Phase 1 landed on `v4` — app boots, `/admin` works. See [phase-1-foundation.md](phase-1-foundation.md).
- [x] **Owner decided body font.** System stack (`system-ui, -apple-system, "Segoe UI", "Helvetica Neue", sans-serif`), Roboto excluded — not a webfont, no licensing question. Display face: **Shantell Sans**, self-hosted, `wght`/`BNCE`/`INFM`/`SPAC` axes kept variable (italic dropped) — see `src/fonts/shantell-sans/NOTES.md`.
- [x] **Owner confirmed accent red.** `#cc0000` (5.3:1 on the warm-cream background, not white — see `DESIGN.md`).
- [x] Read `docs/reference/v3-design-audit.md` — full audit of what v3 used, contrast maths, motifs worth keeping.

## Work

**`DESIGN.md`** — frontmatter of token values + prose invariants. Same shape as `chuangcaleb.com`'s. Invariants are the reviewable rules: which colours may touch body text, no soft shadows, motion gated.

**`src/styles/tokens/`** — token values as CSS custom properties. Fluid type + space via Utopia — shipped with fresh values (320–1440px viewport, 18px/1.2 ratio min → 21px/1.25 ratio max), not v3's numbers; see `DESIGN.md`'s Type section for why the ratios stay close together. Semantic aliases over raw palette; components use aliases only.

**`src/styles/compositions/`** — port 7 primitives: `flow` `cluster` `grid-auto` `wrapper` `sidebar` `switcher` `repel`. Source to adapt: `/Users/chuangcaleb/Documents/dev/web/chuangcaleb.com/src/styles/compositions/`. Copy mechanics, **not** aesthetics — that project is quiet/editorial/soft-shadow, PowerKids is loud/marker/hard-offset-shadow. Catalogue doc: `docs/design/layout-primitives.md`.

**`src/styles/global/`** — reset, base typography, font loading.

**Component layer** — CSS Modules, one directory each. Inventory in `docs/design/components.md`: Button, Card, Heading, Mark, Divider, Image, Accordion, NavBar, VideoEmbed. `NavDrawer` deferred to a later phase. `Pill`, `SuperHead`, and `cva` as a variant mechanism were dropped during the Phase 2 design revision — no replacement pattern.

**Motifs:** none of v3's carry over — no heart rule, no register blob, no rotated logo. The revised direction (rounded neo-brutalism) keeps only the hard offset shadow + thick border and the `<mark>` sweep mechanic, the latter generalised into an interactive highlighter-band state for link/nav hover as well. See `DESIGN.md`'s "Character" section.

**`/dev/kitchen-sink`** — every token, primitive, component variant on one page. 404s at request time in production rather than being excluded at build time — see the route file's own comment for why that's the simpler equivalent here.

## Post

- [x] `DESIGN.md` written — values + invariants, no undocumented magic numbers
- [x] `docs/design/tokens.md`, `components.md`, `layout-primitives.md` match what shipped
- [x] All 7 primitives ported, each tunable by custom properties
- [x] Component inventory built, variants rendered on kitchen sink (`NavDrawer` deferred, not part of this inventory)
- [x] Fonts loaded and licensed — Shantell Sans, no Marker Felt or Comic Sans MS anywhere including fallbacks
- [x] Every animation gated on `prefers-reduced-motion`
- [x] Contrast: chosen accents pass AA at their intended sizes — ratios recorded in `DESIGN.md` invariant 4
- [x] `pnpm verify` green

## Verify

```bash
pnpm verify
pnpm dev   # then open /dev/kitchen-sink
```

- Kitchen sink at 320 / 768 / 1440 px — no horizontal scroll at any width. Verified.
- Toggle OS reduced-motion, reload — no sweep animation
- Contrast-check every text/background pair actually used, not just tokens in isolation. Verified, see `DESIGN.md` invariant 4.
- Keyboard through accordion (arrow/home/end between triggers, verified) and NavBar (standard anchor tab order). Nav drawer deferred with `NavDrawer`.

## Traps

- **No CSS framework.** Raw hex or px in a component is a lint error, not a style opinion — ESLint enforces it. If no token fits, add one and document it.
- **Don't copy the reference project's shadows.** It forbids hard shadows; PowerKids depends on them. The two systems disagree deliberately.
- **v3's layout is the anti-pattern.** Per-index positioning arrays, `xl:row-start-1 xl:col-start-1`, breakpoint-specific overrides everywhere. Primitives exist to delete that vocabulary — don't recreate it in CSS Modules.
- **Most of v3's palette was unused shadcn boilerplate.** Only `--border: black`, two accents, and white background were real decisions. Don't port the rest.
- **Safari pinned-tab colour `#e20000` ≠ accent red `#e60000`.** Unify.
