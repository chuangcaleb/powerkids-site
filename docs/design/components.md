# Components

**Purpose:** rules for shared UI — what counts as shared, how variants work.
**Read this when:** about to create a new shared component, or unsure whether something belongs in `src/components/`.

**The inventory lives in code:** `src/components/`, one directory per component. Read that directory for what exists; this doc does not restate it.

---

## Rules

- One directory per component, CSS Module co-located.
- Variants: props backed by CSS Module classes. No utility-class strings, no variant libraries.
- Server component unless it needs state or event handlers.
- Component appears once, on one page — not shared UI. Keep it beside the block that uses it.
- Anything that renders content takes it as props. Components never fetch, never contain copy.
- CMS-only admin-panel components go under `src/payload/admin/`, not `src/components/`.

## Deliberate omissions

Don't reintroduce these — each was removed during the Phase 2 design revision with no replacement pattern:

- **`cva` or any variant library.** Variants are CSS Module classes.
- **`SuperHead`.** Headings stand alone.
- **v3's heart-motif rule.** The divider is a plain rule.

`Pill` was on this list too, but came back in Phase 4 as a real shape-language component — see `DESIGN.md` invariant 9. Distinct from `Button`: pill is always fully round and always shadowed; button is only slightly rounded. `Button` reads `--font-display`; `Pill` reads `--font-body`.

Rest of the inventory derives from the v3 audit — see [../reference/v3-design-audit.md](../reference/v3-design-audit.md) for what each looked like and which were worth keeping.

## Kitchen sink

`/dev/kitchen-sink` renders tokens, primitives, and component variants on one page. Keep it current — it's how visual regressions get caught before a reviewer sees them. It `notFound()`s in production and stays out of the sitemap.

It covers the presentational components. Layout shells (header, footer, admin bar) and CMS plumbing (`cms-link`, `media`, `rich-text`) aren't on it — they only make sense against real content, so verify those on a real page instead.
