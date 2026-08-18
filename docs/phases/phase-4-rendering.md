# Phase 4 — Rendering

**Goal:** public site renders CMS content. Layouts, catch-all route, one renderer per block.

Fully agentic per block. Doc recommends one PR per 2–3 blocks ("phase 4" is not reviewable as one unit) — owner opted for a single PR instead, styling left boilerplate, visual/breakpoint QA deferred.

---

## Pre

- [x] Phase 3 done — schema stable, `payload-types.ts` generated, editor can compose a page in `/admin`
- [x] Phase 2 done — tokens, primitives, components exist. Blocks are assembled from these, never from raw CSS
- [x] Seed or hand-create one page containing every block, to render against — `scripts/seed-kitchen-sink-page.ts` and `scripts/seed-dummy-pages.ts` (Local API, throwaway, not the Phase 5 seed script)
- [x] Read `docs/architecture/blocks.md` for the rules every block follows; field contracts live in each block's `config.ts`

## Work

**Root layout** reads `site-settings` + `navigation` globals. Header, footer, contact details all from CMS — a phone number in JSX is a defect.

**`src/app/(site)/[[...slug]]/page.tsx`** — resolve `pages` by slug, `generateMetadata` from `seo` falling back to `seo-defaults`, `generateStaticParams`, `notFound()` on miss.

**`RenderBlocks`** dispatcher — maps block `blockType` to server component. Unknown type renders nothing, never throws.

**Page query tuned, not default-depth.** Server components call Local API direct, runs as admin by default — never forward resolved slug into query without public `_status: 'published'` filter (draft preview route only exception, via Next.js draft mode). Pick `depth` deliberate: blocks referencing `media`/`programs`/`events` typically need `depth: 1` to populate one level; raise further and it fans out extra queries per relationship. Use `select` on list-style queries (schools, programs, events collection routes) to skip unneeded fields.

**Revalidation.** `pages` (and any global feeding layout) needs `afterChange` hook calling `revalidatePath`, guarded by `context.disableRevalidate` for seed writes, diffing `doc._status` vs `previousDoc._status` so unpublish also revalidates. Skip this, publishing in `/admin` won't update live route till next deploy. Wired: `src/payload/collections/pages/hooks/revalidate-page.ts` for pages, `src/payload/globals/hooks/revalidate-layout.ts` for the globals feeding layout.

**One renderer per block**, `src/payload/blocks/<name>/component.tsx`. Server components. Layout from primitives, styling from co-located CSS Module reading tokens.

**Images** — `next/image`, R2 host already allow-listed in `next.config.ts` from `R2_PUBLIC_URL`. Correct `sizes` per context; the three generated variants are 400 / 800 / 1600 wide.

**Collection routes** — one per program, one per event, driven by their collections.

**Live preview + draft preview** wired to the same routes.

## Post

- [x] Every block renders correctly at 320 / 768 / 1440 px — checked on `/`, `/careers`, and `/dev/kitchen-sink` (which now demos every block); no page-level horizontal scroll at any width
- [x] Every block survives minimal content (no image, no heading) and extreme content (20 gallery items, 90-char heading) — `card-grid`, `gallery`, `content` edge cases added to `/dev/kitchen-sink`; found and fixed a real bug along the way — `SectionHeader` treated a cleared-but-present rich text heading as truthy, rendering an empty heading/landmark (see `lexicalHasText`, `src/lib/lexical-has-text.ts`)
- [x] No client JS except `faq` and `video`; any `"use client"` carries a comment saying why — `Accordion` (faq) and `VideoEmbed`/`VideoTabs` (video) only
- [x] Header, footer, contact read from globals — zero hard-coded content
- [x] Draft preview works — verified via the `/preview` route directly (secret-gated, enables Next draft mode, redirects); publish-from-`/admin` revalidation confirmed working (owner click-through)
- [x] Lighthouse accessibility 96/100 on `/` and `/careers` (up from 92); axe-core reports 0 violations on both. Fixed: missing accessible name on the header brand link, a nested `banner` landmark inside the footer, duplicate unlabeled `nav` landmarks, and a horizontally-scrollable Scrapbook reel with no keyboard access. Remaining Lighthouse flag is the footer's decorative, `aria-hidden` giant wordmark — exempt under WCAG's logotype clause (SC 1.4.3), also why axe-core doesn't flag it — kept as-is rather than diluting the brand colour
- [x] `docs/architecture/blocks.md` reflects the shipped rules
- [x] `pnpm verify` green (both against a real dev DB and CI's fake-env build)

## Verify

```bash
pnpm verify
pnpm dev
pnpm test:a11y
```

- [x] Every route at three widths, no horizontal scroll
- [x] Keyboard-only pass: accordion and every link/CTA reachable and visibly focused. No nav drawer exists or is needed — header nav is a small flat link set (`headerLinks`, capped at 7) that wraps in place at 320px without overflowing; the phase doc's own comment on `Navigation` already calls this "flat, no dropdowns"
- [x] Screen-reader pass over nav and one content page — accessibility tree checked on `/` and `/careers`; single `banner`/`main`/`contentinfo`, correct heading order, tel/mailto links resolve correctly (fixed a double `tel:tel:` prefix in seed data along the way)
- [x] Publish a change in `/admin`, confirm it appears on the front end — confirmed working
- [x] axe-core, not Playwright — `scripts/check-a11y.mjs` (`pnpm test:a11y`), puppeteer-driven, against a running `pnpm dev`. Not wired into `pnpm verify`: that runs against CI's fake-env build, which has no DB to render real pages against, so there'd be nothing meaningful to scan. Run it manually against a real dev DB instead

## Traps

- **Server components by default.** Content rendering ships no JavaScript. Reaching for `"use client"` to fix a layout problem means the wrong primitive was chosen.
- **Gallery length is unknown.** v3 galleries were paginated Cloudinary fetches of unknown size; only 2–3 images per gallery get seeded. A layout that assumes a fixed count breaks the day an editor uploads 40.
- **Depth explosion.** Page with several block types each referencing `media` and a relationship (`programs`, `events`, `schools`) compounds fast at `depth: 2+`. Default `depth: 1`, raise per-field only where render actually needs populated nested doc.
- **Alt text exists — use it.** `media.alt` is `NOT NULL`. Never render an empty `alt` for a content image.
- **v3 shipped brochure scans with no alt text.** Those pages carry information only in images. Either write real alt text or transcribe the content — see the inventory's open questions.
- **Anchors must survive.** `#register`, `#contact` appear on every page; `/about#our-schools` is linked from nav. v3 used `#our-schools` twice on one page — give Principals its own id.
- **Doodle layer — `src/components/doodle-layer/`, built.** Three landmines hit in prototyping, all closed: placement uses a seeded PRNG keyed on `zoneId` (`src/lib/seeded-random.ts`), never `Math.random()`, so server and client always agree — no hydration mismatch. Parallax is three depth-wrapper divs per zone (near/mid/far), never one transformed node per mark. Motion is pure CSS (`animation-timeline: view()`, feature-detected via `@supports`) — there's no scroll listener to gate under `prefers-reduced-motion`, since none exists; unsupported browsers (Firefox) just render static doodles, no JS fallback, since the layer is decorative. Node count is capped in the component (`MAX_MARKS`). Tokens: `DESIGN.md`'s Doodle layer section.
