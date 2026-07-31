# Layout Primitives

**Purpose:** composable layout classes replace per-component grid/flex code.
**Read this when:** writing any layout. Reach for primitive before media query.

> **Status: not yet implemented.** Phase 2 adds `src/styles/compositions/`. Each CSS file source of truth for its custom properties + defaults; this page stays catalogue.

CUBE-CSS-style compositions, adapted from Every Layout. Each solves single arrangement problem, tunes through custom properties. Prefer implicit responsive behaviour over breakpoints.

---

## The set

### `.flow`

Vertical rhythm between stacked children. Default spacing mechanism for vertical sequence — articles, card bodies, form fields, block internals. Tune with `--flow-space`, or `flow-[size]` utilities.

### `.cluster`

Distributes items with consistent spacing regardless size, wraps as needed. Tag groups, nav links, button rows, Field Trips destination chips.

### `.grid-auto`

Auto-fill grid, items share minimum width. Card grids, gallery thumbnails, school lists, stat rows. Tune with `--grid-item-min`, `--grid-align-items`.

### `.wrapper`

Centred container, max width + gutters. One per page section to constrain content. Replaces v3's `Section` component's `contentWidth` prop.

### `.sidebar`

Sidebar + main content, collapses to stack. Requires `:has(> .sidebar)` parent — collapse mechanic depends on it.

### `.switcher`

**Two** items side by side, stack when container too narrow. Image-and-text pairs, heading-and-byline, any two-element responsive row.

### `.repel`

Pushes items to opposite edges where room, stacks when not. Nav bars, card footers, anything with left thing and right thing.

---

## Do

- Tune with custom properties (`--flow-space`, `--cluster-gap`, `--grid-item-min`) set on element or parent. Defaults cover most cases.
- Nest freely — `.grid-auto` inside `.wrapper` inside `.flow` expected shape.
- Use `.flow` instead of `margin-bottom` on components.
- Reach for primitive first. None fit? Say why in comment before bespoke layout.

## Don't

- Don't add `margin-bottom` to `.flow` children — sibling selector handles spacing.
- Don't use `.sidebar` without its `:has(> .sidebar)` parent.
- Don't put more than two direct children in `.switcher`.
- Don't set fixed heights on `.grid-auto` items; use `--grid-align-items`.
- Don't apply `.wrapper` to `<body>` — wrap sections, not document.
- Don't reintroduce breakpoint-specific positioning. v3's per-index class arrays exactly what these replace.

---

## Origin

Adapted from primitives in [chuangcaleb.com](https://chuangcaleb.com)'s design system, which derive from [Every Layout](https://every-layout.dev). Layout mechanics carry over; visual language does **not** — PowerKids loud + playful where that system quiet + editorial. See [../reference/v3-design-audit.md](../reference/v3-design-audit.md) for specific points where two systems deliberately disagree (shadows, most of all).
