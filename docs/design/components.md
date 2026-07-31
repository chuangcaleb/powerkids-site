# Components

**Purpose:** shared UI inventory — what exist, what variants, what not build twice.
**Read this when:** need button, card, heading, or about create new shared component.

> **Status: not yet implemented.** Phase 2 build these, render all on kitchen-sink route.

---

## Planned inventory

| Component              | Variants                                            |
| ---------------------- | --------------------------------------------------- |
| `Button`               | `red`, `blue`, `outline`, `ghost`, `link` × sizes   |
| `Card`                 | default, tab-header                                 |
| `Pill`                 | `default`, `muted`, `red`, `blue` × three sizes     |
| `SuperHead`            | coloured lead-in above heading                      |
| `Heading`              | levels, with display face                           |
| `Mark`                 | animated highlight sweep, reduced-motion safe       |
| `Divider`              | heart rule                                          |
| `Image`                | Next `<Image>` wrapper, R2 handling, bordered frame |
| `Accordion`            | client component                                    |
| `NavBar` / `NavDrawer` | header nav, mobile drawer                           |
| `VideoEmbed`           | lazy-loaded, click-to-play                          |

Derived from v3 audit — see [../reference/v3-design-audit.md](../reference/v3-design-audit.md) for what each looked like, which worth keeping.

---

## Rules

- One directory per component, CSS Module co-located.
- Variants: props backed by CSS Module classes. No utility-class strings, no variant libraries.
- Server component unless need state or event handlers.
- Component appear once, one page — not shared UI. Keep beside block that use it.
- Anything render content take it as props. Components never fetch, never contain copy.

## Kitchen sink

`/dev/kitchen-sink` renders every token, primitive, component variant on one page. Keep current — how visual regressions get caught before reviewer see them. Excluded from production builds, from sitemap.
