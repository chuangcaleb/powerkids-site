# Layout Primitives

**Purpose:** the composable layout classes that replace per-component grid and flex code.
**Read this when:** writing any layout. Reach for a primitive before writing a media query.

> **Status: not yet implemented.** Phase 2 adds `src/styles/compositions/`. Each CSS file becomes the source of truth for its custom properties and defaults; this page stays the catalogue.

These are CUBE-CSS-style compositions, adapted from Every Layout. Each one solves a single arrangement problem and tunes through custom properties. Prefer implicit responsive behaviour over breakpoints.

---

## The set

### `.flow`
Vertical rhythm between stacked children. The default spacing mechanism for any vertical sequence — articles, card bodies, form fields, block internals. Tune with `--flow-space`, or the `flow-[size]` utilities.

### `.cluster`
Distributes items with consistent spacing regardless of their size, wrapping as needed. Tag groups, nav links, button rows, the Field Trips destination chips.

### `.grid-auto`
Auto-fill grid where items share a minimum width. Card grids, gallery thumbnails, school lists, stat rows. Tune with `--grid-item-min`, `--grid-align-items`.

### `.wrapper`
Centred container with a max width and gutters. One per page section to constrain content. Replaces v3's `Section` component's `contentWidth` prop.

### `.sidebar`
A sidebar plus main content that collapses to a stack. Requires the `:has(> .sidebar)` parent — the collapse mechanic depends on it.

### `.switcher`
**Two** items side by side that stack when the container gets too narrow. Image-and-text pairs, heading-and-byline, any two-element responsive row.

### `.repel`
Pushes items to opposite edges where there is room, stacks when there isn't. Nav bars, card footers, anything with a left thing and a right thing.

---

## Do

- Tune with custom properties (`--flow-space`, `--cluster-gap`, `--grid-item-min`) set on the element or its parent. Defaults cover most cases.
- Nest freely — `.grid-auto` inside `.wrapper` inside `.flow` is the expected shape.
- Use `.flow` instead of `margin-bottom` on components.
- Reach for a primitive first. If none fits, say why in a comment before writing bespoke layout.

## Don't

- Don't add `margin-bottom` to `.flow` children — the sibling selector handles spacing.
- Don't use `.sidebar` without its `:has(> .sidebar)` parent.
- Don't put more than two direct children in `.switcher`.
- Don't set fixed heights on `.grid-auto` items; use `--grid-align-items`.
- Don't apply `.wrapper` to `<body>` — wrap sections, not the document.
- Don't reintroduce breakpoint-specific positioning. v3's per-index class arrays are exactly what these replace.

---

## Origin

Adapted from the primitives in [chuangcaleb.com](https://chuangcaleb.com)'s design system, which in turn derive from [Every Layout](https://every-layout.dev). The layout mechanics carry over; the visual language does **not** — PowerKids is loud and playful where that system is quiet and editorial. See [../reference/v3-design-audit.md](../reference/v3-design-audit.md) for the specific points where the two systems deliberately disagree (shadows, most of all).
