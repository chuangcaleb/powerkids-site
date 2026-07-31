# Components

**Purpose:** shared UI inventory — what exist, what variants, what not build twice.
**Read this when:** need button, card, heading, or about create new shared component.

> **Status: partially implemented.** Built so far: `Button`, `Card`, `Heading`, `Mark`, `Divider`, `Image`. Still to come: `Accordion`, `NavBar`, `NavDrawer`, `VideoEmbed`. None rendered on a kitchen sink yet — that route ships in a later Phase 2 PR.

---

## Planned inventory

| Component    | Variants                                            | Status  |
| ------------ | --------------------------------------------------- | ------- |
| `Button`     | `red`, `blue`, `outline`, `ghost`, `link` × sizes   | built   |
| `Card`       | default, tab-header                                 | built   |
| `Heading`    | levels, with display face                           | built   |
| `Mark`       | animated highlight sweep, reduced-motion safe       | built   |
| `Divider`    | rule variant, no motif (v3's heart rule dropped)    | built   |
| `Image`      | Next `<Image>` wrapper, R2 handling, bordered frame | built   |
| `Accordion`  | client component                                    | planned |
| `NavBar`     | desktop header nav — this phase                     | planned |
| `NavDrawer`  | mobile nav drawer — deferred to a later phase       | planned |
| `VideoEmbed` | lazy-loaded, click-to-play                          | planned |

`Pill`, `SuperHead`, and `cva` as a variant mechanism are deliberately not in this list — removed outright during the Phase 2 design revision, no replacement pattern. Headings stand alone; variants are CSS Module classes, never a variant library.

Rest of the inventory derived from v3 audit — see [../reference/v3-design-audit.md](../reference/v3-design-audit.md) for what each looked like, which worth keeping.

---

## Rules

- One directory per component, CSS Module co-located.
- Variants: props backed by CSS Module classes. No utility-class strings, no variant libraries.
- Server component unless need state or event handlers.
- Component appear once, one page — not shared UI. Keep beside block that use it.
- Anything render content take it as props. Components never fetch, never contain copy.

## Kitchen sink

`/dev/kitchen-sink` renders every token, primitive, component variant on one page. Keep current — how visual regressions get caught before reviewer see them. Excluded from production builds, from sitemap.
