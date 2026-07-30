# Components

**Purpose:** the shared UI inventory — what exists, what variants it has, and what not to build twice.
**Read this when:** you need a button, card, or heading, or you are about to create a new shared component.

> **Status: not yet implemented.** Phase 2 builds these and renders them all on a kitchen-sink route.

---

## Planned inventory

| Component | Variants |
| --- | --- |
| `Button` | `red`, `blue`, `outline`, `ghost`, `link` × sizes |
| `Card` | default, tab-header |
| `Pill` | `default`, `muted`, `red`, `blue` × three sizes |
| `SuperHead` | coloured lead-in above a heading |
| `Heading` | levels, with the display face |
| `Mark` | the animated highlight sweep, reduced-motion safe |
| `Divider` | the heart rule |
| `Image` | Next `<Image>` wrapper with R2 handling and the bordered frame |
| `Accordion` | client component |
| `NavBar` / `NavDrawer` | header nav, mobile drawer |
| `VideoEmbed` | lazy-loaded, click-to-play |

Derived from the v3 audit — see [../reference/v3-design-audit.md](../reference/v3-design-audit.md) for what each looked like and which are worth keeping.

---

## Rules

- One directory per component, CSS Module co-located.
- Variants are props backed by CSS Module classes. No utility-class strings, no variant libraries.
- Server component unless it needs state or event handlers.
- A component that appears once, on one page, is not shared UI — keep it beside the block that uses it.
- Anything that renders content takes it as props. Components never fetch, and never contain copy.

## Kitchen sink

`/dev/kitchen-sink` renders every token, primitive, and component variant on one page. Keep it current — it is how visual regressions get caught before a reviewer sees them. Excluded from production builds and from the sitemap.
