# Phase 5 — Content Migration

**Goal:** `pnpm seed` populates a fresh database with the real site content.

Fully agentic. Owner proof-reads the result in `/admin`, not the script.

---

## Pre

- [ ] Phase 4 done — content actually renders, so seeded data is visible rather than theoretical
- [ ] **Owner has answered the open content questions** in `docs/reference/content-inventory.md`. Seeding wrong copy then correcting it in the panel wastes the whole exercise.
- [ ] **Owner decides gallery migration.** v3 galleries live in Cloudinary at unknown counts. Options: export via Cloudinary console, script the Admin API, or treat launch as a clean start and re-upload what is worth keeping. Needs Cloudinary account access.

## Work

**`scripts/seed.ts`**, run by `pnpm seed`, using Payload local API (`payload run`, which resolves `@payload-config` and `@/` aliases — plain `node` does not).

Populates: globals first (`site-settings`, `navigation`, `seo-defaults`), then `media`, then `schools` / `programs` / `events` / `people`, then `pages` composed of blocks.

**Source of truth is `docs/reference/content-inventory.md`**, not the `v3` branch. Copy is transcribed there verbatim, with defects flagged. Do not re-scrape old source.

**Media**: upload the sampled files from `_reference/media/` (gitignored). Every upload needs real `alt` — schema enforces it, so a lazy seed fails loudly. Galleries get 2–3 representative images only; real counts are noted in the inventory so an admin knows what remains to re-upload.

**Idempotent.** Safe to re-run against a fresh Neon branch. This doubles as onboarding for any future developer.

## Post

- [ ] `pnpm seed` on an empty database produces a site resembling the current one
- [ ] Every page from the v3 route map exists
- [ ] Every seeded image has meaningful alt text
- [ ] Globals populated — nav, socials, phones, hours, addresses
- [ ] Script re-runnable without duplicating records
- [ ] Owner has read every page in `/admin` for stale copy
- [ ] `pnpm verify` green

## Verify

```bash
# against a scratch Neon branch, never the primary
pnpm migrate && pnpm seed && pnpm dev
```

- Diff rendered output against `https://powerkids.edu.my` side by side, page by page
- Re-run `pnpm seed`; confirm counts unchanged
- Spot-check phone links actually dial: v3 had `tel:+0102212483`, missing the country code

## Traps

- **Content has known defects.** The inventory flags them: "four locations" where three exist, a 2025-specific hero alt text, static year counts in principal bios that silently go stale, typos, a `http://` foundation link. Seeding them verbatim reproduces them. Owner decides fix-or-preserve per item.
- **Media filenames are content-hashed.** Re-running the seed with identical files produces identical names — that is intended. Payload still enforces unique filenames per document, so identical content across two documents becomes `-1`.
- **Never seed production from a script run locally.** Seed a Neon branch, review, then decide. Production content is what school staff will have edited by then.
- **Principal bios and quotes are personal statements.** Transcribe exactly; do not paraphrase or "improve" someone's words about their own career.
