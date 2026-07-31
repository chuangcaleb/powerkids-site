# Phase 2 — Design System

**Goal:** tokens, layout primitives, and component layer, all rendered on one kitchen-sink page.

Owner tweaks most here. Highest-drift phase — agents invent colours and one-off spacing. `DESIGN.md` invariants exist to make that a reviewable violation, not a matter of taste.

---

## Pre

- [ ] Phase 1 landed on `v4` — app boots, `/admin` works. See [phase-1-foundation.md](phase-1-foundation.md).
- [ ] **Owner decides body font.** Display font settled: **Shantell Sans** (SIL OFL, variable, has Bounce axis). Body font open — v3 declared PT Sans but never loaded it, so nobody has seen the intended pairing.
- [ ] **Owner confirms accent red.** v3 `#e60000` fails WCAG AA at body size (4.0:1 on white; needs 4.5:1). Roughly `#cc0000` reaches 5.3:1 and keeps character. Decision changes every token derived from it.
- [ ] Read `docs/reference/v3-design-audit.md` — full audit of what v3 used, contrast maths, motifs worth keeping.

## Work

**`DESIGN.md`** — frontmatter of token values + prose invariants. Same shape as `chuangcaleb.com`'s. Invariants are the reviewable rules: which colours may touch body text, no soft shadows, motion gated.

**`src/styles/tokens/`** — token values as CSS custom properties. Fluid type + space via Utopia (v3 used min 16px / 1.25 ratio, max 19px / 1.37 at 1280px — reasonable start). Semantic aliases over raw palette; components use aliases only.

**`src/styles/compositions/`** — port 7 primitives: `flow` `cluster` `grid-auto` `wrapper` `sidebar` `switcher` `repel`. Source to adapt: `/Users/chuangcaleb/Documents/dev/web/chuangcaleb.com/src/styles/compositions/`. Copy mechanics, **not** aesthetics — that project is quiet/editorial/soft-shadow, PowerKids is loud/marker/hard-offset-shadow. Catalogue doc: `docs/design/layout-primitives.md`.

**`src/styles/global/`** — reset, base typography, font loading.

**Component layer** — CSS Modules, one directory each. Inventory in `docs/design/components.md`: Button, Card, Pill, SuperHead, Heading, Mark, Divider, Image, Accordion, NavBar/NavDrawer, VideoEmbed.

**Motifs to preserve** (brand equity, not decoration): heart rule divider, `<mark>` highlight sweep, hard offset shadow + thick border, `Power` red / `Kids` blue wordmark split, register blob.

**`/dev/kitchen-sink`** — every token, primitive, component variant on one page. Excluded from production build and sitemap.

## Post

- [ ] `DESIGN.md` written — values + invariants, no undocumented magic numbers
- [ ] `docs/design/tokens.md`, `components.md`, `layout-primitives.md` match what shipped
- [ ] All 7 primitives ported, each tunable by custom properties
- [ ] Component inventory built, variants rendered on kitchen sink
- [ ] Fonts loaded and licensed — Shantell Sans, no Marker Felt or Comic Sans MS anywhere including fallbacks
- [ ] Every animation gated on `prefers-reduced-motion`
- [ ] Contrast: chosen accents pass AA at their intended sizes
- [ ] `pnpm verify` green

## Verify

```bash
pnpm verify
pnpm dev   # then open /dev/kitchen-sink
```

- Kitchen sink at 320 / 768 / 1440 px — no horizontal scroll at any width
- Toggle OS reduced-motion, reload — no sweep animation
- Contrast-check every text/background pair actually used, not just tokens in isolation
- Keyboard through accordion and nav drawer

## Traps

- **No CSS framework.** Raw hex or px in a component is a lint error, not a style opinion — ESLint enforces it. If no token fits, add one and document it.
- **Don't copy the reference project's shadows.** It forbids hard shadows; PowerKids depends on them. The two systems disagree deliberately.
- **v3's layout is the anti-pattern.** Per-index positioning arrays, `xl:row-start-1 xl:col-start-1`, breakpoint-specific overrides everywhere. Primitives exist to delete that vocabulary — don't recreate it in CSS Modules.
- **Most of v3's palette was unused shadcn boilerplate.** Only `--border: black`, two accents, and white background were real decisions. Don't port the rest.
- **Safari pinned-tab colour `#e20000` ≠ accent red `#e60000`.** Unify.
