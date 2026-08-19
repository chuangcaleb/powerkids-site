# Layout Primitives

**Purpose:** composable layout classes replace per-component grid/flex code.
**Read this when:** writing any layout. Reach for a primitive before a media query.

**Values live in code.** Each file in `src/styles/compositions/` is source of truth for its own custom properties and defaults. This page says which primitive to pick and how to use them; open the CSS file for the knobs.

CUBE-CSS-style compositions, adapted from Every Layout. Each solves a single arrangement problem, tuned through custom properties. Prefer implicit responsive behaviour over breakpoints. None carry colour, shadow, or border of their own — that's the component layer's job, not the layout layer's.

---

## Which one

| Primitive    | Solves                                                  | Reach for it when                                              |
| ------------ | ------------------------------------------------------- | -------------------------------------------------------------- |
| `.flow`      | Vertical rhythm between stacked children                | Any vertical sequence — articles, card bodies, block internals |
| `.cluster`   | Consistent spacing, wraps as needed, items vary in size | Tag groups, nav links, button rows                             |
| `.grid-auto` | Auto-fill grid, items share a minimum width             | Card grids, gallery thumbnails, school lists, stat rows        |
| `.wrapper`   | Centred container, max width + gutters                  | One per page section, to constrain content                     |
| `.region`    | Standard vertical padding for a page section            | Any section root, instead of ad hoc `padding-block`            |
| `.sidebar`   | Sidebar + main, collapses to stack                      | Fixed-width side beside flexible main                          |
| `.switcher`  | **Two** items side by side, stack when narrow           | Image-and-text pairs, heading-and-byline                       |
| `.repel`     | Items pushed to opposite edges, stack when no room      | Nav bars, card footers, left-thing-and-right-thing             |

`.flow` also has `.flow-[size]` utilities (`3xs` through `2xl`) for one-off spacing changes without setting a custom property.

`.wrapper` replaces v3's `Section` component's `contentWidth` prop. Its max width is an entry value, not yet measured against real content.

---

## Do

- Tune with custom properties set on the element or its parent. Defaults cover most cases.
- Nest freely — `.grid-auto` inside `.wrapper` inside `.flow` is the expected shape.
- Use `.flow` instead of `margin-bottom` on components.
- Use `.region` for a section's own top/bottom padding instead of relying on page-level margin between siblings.
- Reach for a primitive first. None fit? Say why in a comment before writing bespoke layout.

## Don't

- Don't add `margin-bottom` to `.flow` children — the sibling selector handles spacing.
- Don't use `.sidebar` without its `:has(> .sidebar)` parent; the collapse mechanic depends on it.
- Don't put more than two direct children in `.switcher`.
- Don't set fixed heights on `.grid-auto` items; use `--grid-align-items`.
- Don't apply `.wrapper` to `<body>` — wrap sections, not the document.
- Don't reintroduce breakpoint-specific positioning. v3's per-index class arrays are exactly what these replace.

---

## Origin

Adapted from primitives in [chuangcaleb.com](https://chuangcaleb.com)'s design system, which derive from [Every Layout](https://every-layout.dev). Layout mechanics carry over; visual language does **not** — PowerKids is loud and playful where that system is quiet and editorial. See [../reference/v3-design-audit.md](../reference/v3-design-audit.md) for the points where the two systems deliberately disagree (shadows, most of all).
