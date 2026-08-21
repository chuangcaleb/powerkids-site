# 0004. Single-page MVP, no v3 URL preservation

**Status:** accepted
**Date:** 2026-08-21

## Context

Phase 6 originally assumed v3/v4 URL parity: every v3 route redirects or resolves, tracked via `docs/reference/content-inventory.md`'s route map. Owner has since decided v4 MVP ships with only one main page route, populated by hand rather than migrated from v3 copy. Phase 5 (automated seed/migration) was permanently skipped for the same reason — owner authors all content directly in the CMS, no v3 transcription.

A single-route MVP makes v3's multi-page structure moot. Preserving every old URL (301s, anchor mapping for `#our-schools`/`#our-team`, the `/programs/daycare` slug mismatch) would mean building routing machinery for pages that don't exist yet in v4.

## Decision

v4 MVP does not preserve v3 URLs. Old links may 404. No redirect map, no route-parity checklist. `docs/reference/content-inventory.md` is deleted — its copy-transcription half is dead (hand-authored now), its route-map half is dead (no parity to check against).

## Consequences

**Makes easy.** Phase 6 drops an entire work item (redirects) and its Post checklist bullet. `pages` collection and catch-all route (`src/app/(site)/[[...slug]]`) already support this — no code change required, decision is scope-only.

**Costs.** SEO/backlink equity from v3 URLs is accepted loss. If more routes get added later (multi-page site), this decision does not automatically reverse — someone has to explicitly decide redirects matter again, at that point, for those specific new URLs.
