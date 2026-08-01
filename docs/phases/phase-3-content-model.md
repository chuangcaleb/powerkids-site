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

**Blocks**, closed set of 11: `prose` `media-text` `card-grid` `steps` `stats` `gallery` `cta-banner` `schools` `faq` `contact` `video`. One directory each: `src/payload/blocks/<name>/config.ts`. `hero` is not one of these — every page has exactly one, as its own always-present field (`src/payload/collections/pages/hero.ts`), independent of `layout`. See `docs/architecture/blocks.md`.

**Use built-in `slugField()` helper**, imported from `payload`, not hand-written `text` field. Returns wired field set — auto-generate from another field (`useAsSlug`, default `'title'`), unique + indexed, admin lock/unlock + regenerate. Marked **experimental** upstream, may change or vanish, use at own risk — re-check `docs/fields/slug.mdx` in Payload repo on upgrade.

**Every block needs `interfaceName`** on `Block` config (e.g. `HeroBlock`) — skip it, `generate:types` emits anonymous inline type per usage site instead of one named type.

**Access default-deny** — no `access` function means denied, not "falls back to public." Set `create`/`read`/`update`/`delete` explicit on every collection, even admin-only ones. Public `read` on content collections must filter `{ _status: { equals: 'published' } }` — skip that, drafts leak through REST/GraphQL even though admin UI hides them.

**Drafts + versions** on `pages`, via `versions: { drafts: true }`. Auto-injects managed `_status` field (`draft` / `published` / `changed`) — don't hand-roll status field alongside it; use `_status` direct in access functions and `defaultColumns`.

**Media duplicate detection, non-blocking.** Today re-uploaded identical file just gets `-1` suffix from storage adapter — silent, editors keep re-uploading same photo instead reuse existing doc. Add `beforeOperation` hook on `media` (`operation === 'create'`) that hashes incoming `req.file` buffer, stores in `checksum` field (`text`, `index: true`, hidden from admin form), queries `media` for existing doc same checksum.

- **Match found:** let upload proceed — never throw out of hook. Set `possibleDuplicateOf` (`relationship` to `media`, `admin.readOnly: true`) on new doc pointing at match. Admin list view (`defaultColumns`) surfaces flag without opening doc; description tells editor reuse linked photo instead of new upload if genuinely same file.
- **No match:** normal create, `checksum` stored for future comparisons.
- **Bulk upload** (10 photos, one dupe): each file own `create` call — hook flags only the one dupe, other nine save clean. Never batch-validate across upload set; one bad file must not block rest.
- **Seed script re-runs (Phase 5) hit this too** — re-uploads same files by design. Phase 5's idempotency fix (find-by-identifier before create) should make re-runs skip upload entirely rather than rely on hook flagging after the fact.

Nudge, not constraint — never block or auto-delete on checksum match. Editor re-uploading cropped or re-exported version of same photo is different file, won't match anyway.

**Admin panel legibility:** group fields, write `label` and `description` for every field and block in plain language. A kindergarten administrator picks blocks from this panel — "card-grid" means nothing to them without a description.

**Ordering:** explicit `order` field on anything rendered as a list. Never rely on creation order.

## Post

- [x] All collections, globals, blocks defined — schema only, no components
- [ ] `media` duplicate-detection hook in place: checksum stored, `possibleDuplicateOf` flagged on match, bulk upload of a mixed clean/duplicate batch never blocks or fails
- [ ] Access control implemented; **not yet tested from an unauthenticated client** — that's a manual `/admin` + REST check, owner's to run
- [x] Drafts + version history on `pages`
- [x] `pnpm generate:types` run, `payload-types.ts` committed
- [x] Migration created, applied, committed
- [x] `docs/architecture/content-model.md` and `blocks.md` updated to match shipped schema
- [x] `pnpm verify` green

## Verify

```bash
pnpm migrate:create <name> && pnpm migrate && pnpm generate:types && pnpm verify
```

In `/admin`, as a non-developer would:

- Create a draft page, add **every** block type, drag-reorder them, publish
- Confirm version history records it, and restoring an earlier version works
- Confirm an `editor` cannot reach user management
- Confirm public REST read returns published only
- Upload the same image twice: second doc saves (not blocked), flagged with `possibleDuplicateOf`, visible in list view
- Bulk-upload a batch of 10 where one duplicates an existing doc: all 10 save, only the one duplicate is flagged

Front end renders nothing yet. That is correct.

## Traps

- **Field-level access boolean-only**, no `Where`. Denied field silently omitted from responses, not error — sensitive field (e.g. future `people.email`) needs own `access.read`, collection `read: true` doesn't hide it.
- **Migration import is patched automatically** by `pnpm migrate:create`. If you call the Payload CLI directly, run `scripts/fix-migration-imports.mjs` yourself.
- **Test migrations against a Neon branch with data**, not an empty database. Empty databases migrate cleanly no matter how wrong the migration is.
- **Renames drop and re-add.** Read generated SQL before committing. To rename a field with content: add new, backfill, deploy, migrate data, drop old — two deploys, no loss.
- **Don't over-block.** Eleven blocks is already near the limit an editor will read. Two blocks differing only by alignment are one block with an alignment field.
- **Schema is not layout.** A block's fields describe content; how it looks is Phase 4's problem.
- **`req.file` shape varies by upload path.** Multipart form upload (admin UI) and Local API `create` with base64/buffer `file` option both populate `req.file`, but seed script calling `payload.create` with file path needs read+pass buffer itself — checksum hook must not assume one shape without testing both paths.
