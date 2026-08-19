# Phase 5 — Content Migration

**Goal:** `pnpm seed` populates a fresh database with placeholder/dummy content, enough for local dev and `/admin` walkthroughs. No real v3 copy migration — owner fills production CMS by hand.

Fully agentic.

---

## Pre

- [ ] Phase 4 done — content actually renders, so seeded data is visible rather than theoretical

## Work

**`scripts/seed.ts`**, run by `pnpm seed`, using Payload local API (`payload run`, which resolves `@payload-config` and `@/` aliases — plain `node` does not). Consolidates the phase-4 throwaway scripts (`scripts/seed-kitchen-sink-page.ts`, `scripts/seed-dummy-pages.ts`) into the one real script.

Populates: globals first (`site-settings`, `navigation`, `seo-defaults`), then `media`, then `schools` / `programs` / `events` / `people`, then `pages` composed of blocks — all placeholder content, not transcribed v3 copy. `docs/reference/content-inventory.md` is **not** a source for this script; it stays as a standalone reference for real copy/route-map lookups, unrelated to seeding.

**Media**: dummy uploads (existing sampled files in `_reference/media/` are fine as stand-ins). Every upload needs real `alt` — schema enforces it, so a lazy seed fails loudly.

**Idempotent.** Find-by-unique-field (slug) then update, not blind `create` — re-run updates existing docs, doesn't duplicate. Local API runs as admin by default (no `overrideAccess` needed for trusted script), but pages need `draft: false` so seeded content actually publishes, not stuck as unpublished draft. Set `context: { disableRevalidate: true }` on seed writes so Phase 4's revalidation hook skips firing per-document during bulk run.

**Production seeding — open decision, not this phase.** Whether `pnpm seed`'s dummy data ever runs against the actual production database (pre-launch, before real visitors) or production stays seed-free and owner populates every doc by hand from an empty CMS is undecided. Ask the owner again once migration mechanics are solid and launch timing is closer — do not run seed against production without that explicit go-ahead.

## Post

- [ ] `pnpm seed` on an empty database produces a rendering site with placeholder content on every route
- [ ] Every seeded image has meaningful alt text
- [ ] Globals populated — nav, socials, phones, hours, addresses (dummy values, correct shape)
- [ ] Script re-runnable without duplicating records
- [ ] `pnpm verify` green

## Verify

```bash
# against a scratch Neon branch, never production
pnpm migrate && pnpm seed && pnpm dev
```

- Re-run `pnpm seed`; confirm counts unchanged
- Walk `/admin` — every collection/global has at least one populated doc, editor can see the shape of real usage

## Traps

- **N+1 lookups on re-run.** Idempotency-check queries (find-by-slug before create) inside a loop over dozens of docs = one query per item — fine for a one-shot seed script, don't carry the pattern into request-path code.
- **Media filenames are content-hashed.** Re-running the seed with identical files produces identical names — that is intended. Payload still enforces unique filenames per document, so identical content across two documents becomes `-1`.
- **Never seed production without explicit sign-off.** Default assumption is a scratch Neon branch. See "Production seeding" above — that decision is still open.
