# Phase 4 — Rendering

**Goal:** public site renders CMS content. Layouts, catch-all route, one renderer per block.

Fully agentic per block. Doc recommends one PR per 2–3 blocks ("phase 4" is not reviewable as one unit) — owner opted for a single PR instead, styling left boilerplate, visual/breakpoint QA deferred.

---

## Pre

- [x] Phase 3 done — schema stable, `payload-types.ts` generated, editor can compose a page in `/admin`
- [x] Phase 2 done — tokens, primitives, components exist. Blocks are assembled from these, never from raw CSS
- [x] Seed or hand-create one page containing every block, to render against — `scripts/seed-kitchen-sink-page.ts` (Local API, throwaway, not the Phase 5 seed script)
- [x] Read `docs/architecture/blocks.md` for the per-block field contracts

## Work

**Root layout** reads `site-settings` + `navigation` globals. Header, footer, contact details all from CMS — a phone number in JSX is a defect.

**`src/app/(site)/[[...slug]]/page.tsx`** — resolve `pages` by slug, `generateMetadata` from `seo` falling back to `seo-defaults`, `generateStaticParams`, `notFound()` on miss.

**`RenderBlocks`** dispatcher — maps block `blockType` to server component. Unknown type renders nothing, never throws.

**Page query tuned, not default-depth.** Server components call Local API direct, runs as admin by default — never forward resolved slug into query without public `_status: 'published'` filter (draft preview route only exception, via Next.js draft mode). Pick `depth` deliberate: blocks referencing `media`/`programs`/`events` typically need `depth: 1` to populate one level; raise further and it fans out extra queries per relationship. Use `select` on list-style queries (schools, programs, events collection routes) to skip unneeded fields.

**Revalidation.** `pages` (and any global feeding layout) needs `afterChange` hook calling `revalidatePath`, guarded by `context.disableRevalidate` for seed writes, diffing `doc._status` vs `previousDoc._status` so unpublish also revalidates. Skip this, publishing in `/admin` won't update live route till next deploy. `pages` already has this — see `src/payload/collections/pages/hooks/revalidate-page.ts`; globals feeding layout (`site-settings`, `navigation`) still need their own.

**One renderer per block**, `src/payload/blocks/<name>/Component.tsx`. Server components. Layout from primitives, styling from co-located CSS Module reading tokens.

**Images** — `next/image`, R2 host already allow-listed in `next.config.ts` from `R2_PUBLIC_URL`. Correct `sizes` per context; the three generated variants are 400 / 800 / 1600 wide.

**Collection routes** — one per program, one per event, driven by their collections.

**Live preview + draft preview** wired to the same routes.

## Post

- [ ] Every block renders correctly at 320 / 768 / 1440 px — **not yet checked**; styling was deliberately left boilerplate this pass, visual/breakpoint pass deferred
- [ ] Every block survives minimal content (no image, no heading) and extreme content (20 gallery items, 90-char heading) — **not yet checked**
- [x] No client JS except `faq` and `video`; any `"use client"` carries a comment saying why — `Accordion` (faq) and `VideoEmbed`/`VideoTabs` (video) only
- [x] Header, footer, contact read from globals — zero hard-coded content
- [x] Draft preview works — verified via the `/preview` route directly (secret-gated, enables Next draft mode, redirects); **not yet clicked through from the `/admin` panel UI itself**
- [ ] Lighthouse accessibility 100 — **not yet run**
- [x] `docs/architecture/blocks.md` per-block notes filled in
- [x] `pnpm verify` green (both against a real dev DB and CI's fake-env build)

## Verify

```bash
pnpm verify
pnpm dev
```

- Every route at three widths, no horizontal scroll
- Keyboard-only pass: nav drawer, accordion, every link and CTA reachable and visibly focused
- Screen-reader pass over nav and one content page
- Publish a change in `/admin`, confirm it appears on the front end
- Add Playwright smoke + axe-core here — deferred from Phase 1 deliberately, since specs written against a placeholder page get rewritten

## Traps

- **Server components by default.** Content rendering ships no JavaScript. Reaching for `"use client"` to fix a layout problem means the wrong primitive was chosen.
- **Gallery length is unknown.** v3 galleries were paginated Cloudinary fetches of unknown size; only 2–3 images per gallery get seeded. A layout that assumes a fixed count breaks the day an editor uploads 40.
- **Depth explosion.** Page with several block types each referencing `media` and a relationship (`programs`, `events`, `schools`) compounds fast at `depth: 2+`. Default `depth: 1`, raise per-field only where render actually needs populated nested doc.
- **Alt text exists — use it.** `media.alt` is `NOT NULL`. Never render an empty `alt` for a content image.
- **v3 shipped brochure scans with no alt text.** Those pages carry information only in images. Either write real alt text or transcribe the content — see the inventory's open questions.
- **Anchors must survive.** `#register`, `#contact` appear on every page; `/about#our-schools` is linked from nav. v3 used `#our-schools` twice on one page — give Principals its own id.
