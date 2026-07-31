# Phase 9 — Media Hygiene

**Deferred.** No owner request yet. Only worth doing once library has enough history for cruft to accumulate — right after launch nothing to clean up.

**Goal:** find media docs nothing references, so owner can review and delete with confidence, not guesswork.

---

## Pre

- [ ] Owner explicitly requests it
- [ ] Phase 3's duplicate-detection hook shipped — reduces net-new cruft, doesn't touch what's already unreferenced
- [ ] Enough real usage history to make this worth running (post-launch, not right after seed)

## Work

**`scripts/find-unused-media.ts`**, run manually (`payload run`), read-only, report-only — never auto-deletes. R2 has no object versioning; wrong delete unrecoverable, so this stays human-in-the-loop tool.

Referenced-media detection is the hard part: media IDs live in plain `upload`/`relationship` fields (`schools.photo`, `people.portrait`, `events.gallery`, `programs.image`), inside every block variant on `pages.layout` (JSON), and inside `richText` bodies as embedded lexical upload nodes. No single query covers all — script must:

1. Fetch every doc across every collection that can hold a media reference, at `depth: 0` (raw IDs only — populating wasted work here).
2. Walk each doc's fields recursive (arrays, blocks, groups, lexical JSON), collect any value looking like media ID or matching known media-referencing field path.
3. Diff collected ID set against every `media` doc's ID.
4. Report unreferenced docs: filename, upload date, file size, admin URL — sorted so owner can eyeball before deciding.

**Output as CSV or admin-viewable report**, not silent console log — someone has to act on it.

**No automatic deletion, ever.** Phase produces list. Human deletes, one at a time or reviewed batch, in `/admin` where delete confirmation and any remaining relationship errors surface normally.

## Post

- [ ] Script runs against Neon branch (never production direct), produces accurate unreferenced-media report
- [ ] Report includes enough detail (filename, size, upload date) to decide without opening each doc
- [ ] False positives checked: run after seeding, confirm zero reported — every seeded media doc referenced by something
- [ ] Documented as `pnpm` script with usage notes in `docs/ops/`
- [ ] `pnpm verify` green

## Verify

```bash
# against a scratch Neon branch
payload run scripts/find-unused-media.ts
```

- Delete one page's only reference to a media doc, re-run, confirm doc now appears in report
- Re-reference it, re-run, confirm drops back out

## Traps

- **Lexical embeds easy to miss.** `richText` field with inline image node stores media ID inside its JSON tree, not as top-level relationship field — naive "check known relationship fields only" scan false-positives images actually in use.
- **Depth 0, not populated.** Populating every doc at real depth "just to check" is same N+1/fan-out problem as Phase 4's depth traps, multiplied across whole content set.
- **False positive costs real photo.** When in doubt, script under-reports (misses candidate) rather than over-reports (flags something in use). Bias walk toward matching too broad, not too narrow.
- **Run against branch, review, then decide** — same rule as every other bulk media operation in this project (see Phase 6's trap on irreplaceable photos).
