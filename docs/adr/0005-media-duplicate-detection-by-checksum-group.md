# 0005. Media duplicate detection by checksum group, not a pointer field

**Status:** accepted
**Date:** 2026-08-22

## Context

Media already computed a content checksum on upload and flagged re-uploads via a `possibleDuplicateOf` relationship (single, read-only) pointing the new doc at whatever existing doc shared its checksum. That design assumed duplicates come in pairs.

They don't. A bulk upload can contain 3, 4, or more copies of the same file — either because several already exist in the library, or because the editor's own batch contains repeats of each other (confirmed: Payload's bulk-upload drawer submits creates sequentially, so within-batch duplicates are already visible to a checksum lookup — this decision is about what happens once more than one match exists, not about detection timing).

A single `hasMany: false` relationship cannot represent a group of N duplicates — it can only point at one. Two further problems follow directly from that:

- **Arbitrary anchor.** With no explicit sort, which of several existing matches a new upload points at is whatever order the query happens to return.
- **Dangling reference on delete.** The relationship's `ON DELETE SET NULL` means deleting the one doc everyone points at silently un-flags every other member of the group — a group of 5 becomes 4 completely unflagged docs the moment the "anchor" is removed, with nothing re-running to notice.

Both problems are instances of the same mistake: storing derived data (which doc is "the" duplicate target) as if it were an independent fact, when the actual fact — two docs share a checksum — is already captured by the existing `checksum` column and never goes stale on its own.

## Decision

Drop `possibleDuplicateOf` entirely. Replace it with:

- **`checksum`** (unchanged, already indexed) is the sole source of truth for group membership. Two docs are duplicates of each other iff they share a checksum — this needs no additional field to express and cannot drift, since it's not derived from anything else.
- **`hasDuplicate: boolean`**, a cache field whose only job is to be queryable via `where` (Payload's REST/Local API can't do a live "count matching checksum > 1" filter). Recomputed for _every_ member of a checksum group — not just the newly written doc — whenever a create, a file-replace-on-update, or a delete touches that group. A group shrinking to 1 remaining member flips that survivor back to `false`; a group growing from 1 to 2 flips the original (previously unflagged) member to `true` as well as the new one. The rule is "recompute the whole group from the source of truth on every mutation," not "increment/decrement a counter" — counters drift, recomputing from `checksum` cannot.
- **`duplicateDismissed: boolean`**, editable, default `false`. The one genuinely new fact introduced here: an editor's judgment that a specific flagged doc isn't actually a problem. Per-doc, not per-group — dismissing 3 of 4 members in a group is 3 separate decisions, not one. A later upload joining an already-dismissed group starts fresh (`hasDuplicate: true`, `duplicateDismissed: false`) rather than inheriting the group's prior dismissal, since dismissal is a verdict on that doc's existence, not a standing exemption for the checksum.
- The "which other docs share this checksum" detail shown to an editor reviewing a flagged doc is **not persisted anywhere.** It's a live, on-demand query run by a custom admin field component when the edit view is open — never a Payload schema-level `virtual` field, since a virtual field's compute logic runs as part of the collection's normal read pipeline and would otherwise fire on every read of that doc anywhere in the app (public page rendering, block population), not just the one admin view that needs it.

## Consequences

**Makes easy.** Groups of any size are handled uniformly — there's no special case for "more than 2." Nothing can dangle: deleting any doc in any group triggers a full recompute of whoever's left, so there's no stale pointer to notice missing. Filtering the admin list view and counting the dashboard widget both stay a single indexed boolean query, unaffected by group size.

**Makes hard / costs.** Every mutation to a checksum group now does N writes (one per remaining/affected sibling) instead of one. The variable that matters here is **duplicate-group size, not total collection size** — `checksum` and `hasDuplicate` are both indexed, so a lookup or filter costs the same whether the library holds 200 or 3,000 docs. What would actually strain this design is a _single checksum group_ commonly running into dozens+ members, which is independent of overall library size. At this site's expected media volume (low thousands of docs, sourced from school events/photo batches) realistic duplicate groups — an editor re-running the same upload, or a batch with a handful of accidental repeats — top out far below that. If a checksum group ever routinely grows to dozens of members, a dedicated group-tracking collection (one row per checksum, carrying a maintained member count) would do less work per mutation, at the cost of a second collection and a join. Revisit if that specific pattern emerges — this decision does not hold "forever," and does not depend on total library size staying small.

The "list of sibling duplicates" is recomputed on every edit-view load rather than cached anywhere — always correct, at the cost of one extra query per admin view of a flagged doc. Not a concern at this volume.

## Alternatives considered

- **Keep `possibleDuplicateOf`, just make it editable.** Rejected — doesn't fix the core problem (one pointer can't represent a group), only fixes the read-only-can't-dismiss complaint that motivated the original edit. Would need to be revisited again the first time a 3-way group appeared.
- **`possibleDuplicateOf` as `hasMany: true`** (array of every sibling, stored on every member). Rejected — more redundant than the chosen design, not less: an N-member group stores the full N-1-length sibling list on _every_ member (N × (N−1) total stored references) instead of one boolean per member. Same staleness-on-delete problem as the single-relationship version, just spread across more rows.
- **Dedicated `media-duplicate-groups` collection**, one row per checksum with a `memberCount` and a join back to members. Rejected for now, not permanently — genuinely the more scalable design (see Consequences), but a second collection is a seam this feature doesn't need to introduce at current media volume. Recorded here so it isn't rediscovered from scratch if this ever needs revisiting.

## Addendum (2026-08-22): UI pass

- **Canonical hint, not a canonical field.** The sibling list in `ListDuplicateMedia` sorts by `createdAt` ascending and pins a "likely canonical" pill on whichever doc — self or sibling — is oldest. This is display-only, computed live from `createdAt` at render time, same non-persisted-derived-data stance as the sibling list itself. No new field; nothing to keep in sync.
- **Duplicate-status fields dropped their `group` wrapper.** `checksum`/`hasDuplicate`/`duplicateDismissed`'s conditional visibility now lives on each field's own `admin.condition` rather than one shared `group` around all three — a `group` field renders its own bordered fieldset in the admin UI, which read as a divider this set didn't need given it's already gated behind `hasDuplicate`. No schema/column effect either way; `group` is presentational only in Postgres.
- **No canonical/pill treatment in the folder (grid) browser.** Payload 3.88's `FolderFileCard` (`@payloadcms/ui`) takes no badge/overlay slot from collection config — confirmed against its props (`id`, `type`, `previewUrl`, `title`, `PopupActions`, …), none of which reach into a doc's own fields. Surfacing the duplicate pill there would mean patching `@payloadcms/ui` internals or a build-time swizzle, which isn't a maintenance cost this feature justifies. Revisit if a future Payload release adds a component-override point for folder cards.

## Addendum (2026-08-25): bulk-create fix + two accepted edge cases

- **Bug fixed: last doc in a bulk upload stayed unflagged.** `hasDuplicate` for the doc being written was set via a self-referential `payload.update` fired from that same doc's own `afterChange` (`recomputeDuplicateGroup`) — this didn't reliably persist. Fix: a new `beforeChange` hook (`flag-own-duplicate.ts`) sets `hasDuplicate` directly on the doc's own create/file-replace write. `recomputeDuplicateGroup` (`afterChange`) still owns every _other_ group member (e.g. flipping the original, previously-unflagged doc to `true` once a second upload joins it).
- **Race condition, accepted.** The new hook's find-then-write isn't atomic across concurrent requests — two truly parallel uploads of the same file could both see zero existing matches and both compute `false`. Not fixed: the admin panel is single-editor-at-a-time in practice, and a single admin's own bulk upload runs sequentially (per the Context section above), so this doesn't affect the case the fix targets. Otherwise, needs a DB unique constraint or transaction-level lock.
- **Dismissed-flag semantics, unchanged.** `hasDuplicate` is only ever automatically set to `true` at the moment a doc is created or file-replaced and detected as a duplicate. `recomputeDuplicateGroup` can still flip a previously-dismissed sibling's `hasDuplicate` back to `true` when a new upload joins its group — intended, not a regression: group membership (`checksum` match) is `hasDuplicate`'s sole input; `duplicateDismissed` is a separate per-doc verdict the flag itself doesn't consult.
