# Phase 3 — Content Model

**Goal:** every collection, global, and block **schema**. No renderers.

Cheap to change now, expensive once content exists — every later change is a migration against real editor data. Spend real review time here.

---

## Pre

- [x] Phase 2 done — tokens and primitives exist, so block fields can be specified against real layout vocabulary
- [x] Read `docs/architecture/content-model.md` (draft schema) and `docs/architecture/blocks.md` (catalogue)
- [x] Read `docs/reference/content-inventory.md` — every field here exists to hold specific v3 content; check the source before inventing fields
- [x] **Owner answers open content questions** in that inventory's "Open questions". Three schools, Our Team dropped (nav link only, no `people` collection), Graduation videos editor-managed (repeatable field on `events`), FunGates canonical casing, `evening-daycare` slug — all 13 answered

## Work

**Collections:** `pages`, `media` (exists), `schools`, `programs`, `events`, `people`, `users` (exists).

**Globals:** `site-settings` (brand, tagline, founding year, email, phones, hours, socials), `navigation` (header + footer trees, column headings as fields), `seo-defaults`.

Founding year stored, not hard-coded — "{n} years & counting" stays computed.

**Blocks**, closed set of 12: `hero` `prose` `media-text` `card-grid` `steps` `stats` `gallery` `cta-banner` `schools` `faq` `contact` `video`. One directory each: `src/blocks/<name>/config.ts`.

**Use Payload's `slugField()`**, not a hand-written slug. It gives unique index, generation from title, manual-override checkbox, and stops regenerating after publish so a title edit cannot silently break a live URL. Marked `@experimental` in 3.86 — re-read on upgrade.

**Access:** public reads published only; `editor` writes content; `admin` also manages users.

**Drafts + versions** on `pages`.

**Admin panel legibility:** group fields, write `label` and `description` for every field and block in plain language. A kindergarten administrator picks blocks from this panel — "card-grid" means nothing to them without a description.

**Ordering:** explicit `order` field on anything rendered as a list. Never rely on creation order.

## Post

- [ ] All collections, globals, blocks defined — schema only, no components
- [ ] Access control implemented and tested from an unauthenticated client
- [ ] Drafts + version history on `pages`
- [ ] `pnpm generate:types` run, `payload-types.ts` committed
- [ ] Migration created, applied, committed
- [ ] `docs/architecture/content-model.md` and `blocks.md` updated to match shipped schema
- [ ] `pnpm verify` green

## Verify

```bash
pnpm migrate:create <name> && pnpm migrate && pnpm generate:types && pnpm verify
```

In `/admin`, as a non-developer would:

- Create a draft page, add **every** block type, drag-reorder them, publish
- Confirm version history records it, and restoring an earlier version works
- Confirm an `editor` cannot reach user management
- Confirm public REST read returns published only

Front end renders nothing yet. That is correct.

## Traps

- **Migration import is patched automatically** by `pnpm migrate:create`. If you call the Payload CLI directly, run `scripts/fix-migration-imports.mjs` yourself.
- **Test migrations against a Neon branch with data**, not an empty database. Empty databases migrate cleanly no matter how wrong the migration is.
- **Renames drop and re-add.** Read generated SQL before committing. To rename a field with content: add new, backfill, deploy, migrate data, drop old — two deploys, no loss.
- **Don't over-block.** Twelve blocks is already near the limit an editor will read. Two blocks differing only by alignment are one block with an alignment field.
- **Schema is not layout.** A block's fields describe content; how it looks is Phase 4's problem.
