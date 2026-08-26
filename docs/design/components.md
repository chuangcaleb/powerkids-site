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

## Kitchen sink

`/dev/kitchen-sink` renders tokens, primitives, and component variants on one page. Keep it current — it's how visual regressions get caught before a reviewer sees them. It `notFound()`s in production and stays out of the sitemap.

It covers the presentational components. Layout shells (header, footer, admin bar) and CMS plumbing (`cms-link`, `media`, `rich-text`) aren't on it — they only make sense against real content, so verify those on a real page instead.
