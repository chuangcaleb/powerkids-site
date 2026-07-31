# Phase 4 — Rendering

**Goal:** public site renders CMS content. Layouts, catch-all route, one renderer per block.

Fully agentic per block. One PR per 2–3 blocks — "phase 4" is not reviewable.

---

## Pre

- [ ] Phase 3 done — schema stable, `payload-types.ts` generated, editor can compose a page in `/admin`
- [ ] Phase 2 done — tokens, primitives, components exist. Blocks are assembled from these, never from raw CSS
- [ ] Seed or hand-create one page containing every block, to render against
- [ ] Read `docs/architecture/blocks.md` for the per-block field contracts

## Work

**Root layout** reads `site-settings` + `navigation` globals. Header, footer, contact details all from CMS — a phone number in JSX is a defect.

**`src/app/(site)/[[...slug]]/page.tsx`** — resolve `pages` by slug, `generateMetadata` from `seo` falling back to `seo-defaults`, `generateStaticParams`, `notFound()` on miss.

**`RenderBlocks`** dispatcher — maps block `blockType` to server component. Unknown type renders nothing, never throws.

**One renderer per block**, `src/blocks/<name>/Component.tsx`. Server components. Layout from primitives, styling from co-located CSS Module reading tokens.

**Images** — `next/image`, R2 host already allow-listed in `next.config.ts` from `R2_PUBLIC_URL`. Correct `sizes` per context; the three generated variants are 400 / 800 / 1600 wide.

**Collection routes** — one per program, one per event, driven by their collections.

**Live preview + draft preview** wired to the same routes.

## Post

- [ ] Every block renders correctly at 320 / 768 / 1440 px
- [ ] Every block survives minimal content (no image, no heading) and extreme content (20 gallery items, 90-char heading)
- [ ] No client JS except `faq` and `video`; any `"use client"` carries a comment saying why
- [ ] Header, footer, contact read from globals — zero hard-coded content
- [ ] Draft preview works from the admin panel
- [ ] Lighthouse accessibility 100
- [ ] `docs/architecture/blocks.md` per-block notes filled in
- [ ] `pnpm verify` green

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
- **Alt text exists — use it.** `media.alt` is `NOT NULL`. Never render an empty `alt` for a content image.
- **v3 shipped brochure scans with no alt text.** Those pages carry information only in images. Either write real alt text or transcribe the content — see the inventory's open questions.
- **Anchors must survive.** `#register`, `#contact` appear on every page; `/about#our-schools` is linked from nav. v3 used `#our-schools` twice on one page — give Principals its own id.
