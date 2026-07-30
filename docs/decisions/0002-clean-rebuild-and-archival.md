# 0002. Clean rebuild with archived history

**Status:** accepted
**Date:** 2026-07-30

## Context

The v4 rebuild must produce a site that looks substantially like v3 — same content, same character — while sharing none of its implementation. Two forces pull against each other: the new code should owe nothing to the old structure, but the old site is the only complete record of the content and design.

There was also an abandoned attempt: a `v4` branch from June 2025 containing the stock Payload starter template (Next 15.3, MongoDB, Tailwind, shadcn, unused posts and search scaffolding). It conflicts with every decision in [0001](0001-nextjs-payload-vercel.md), and its Next version cannot run a current Payload at all.

The risk being managed is specific. When old code is available in the working tree, "reference it" becomes "adapt it" becomes "copy it" — especially for an agent optimising for a working result. Structure, not discipline, has to prevent that.

## Decision

Old code stays in Git history and out of the working tree. Content is extracted once, into a document.

1. `main` is tagged `v3-final`; the `v3` branch holds the Astro implementation.
2. The abandoned attempt is preserved as `archive/v4-payload-template`; the `v4` branch name is reused for the real rebuild.
3. `v4` branches from `main` with all source deleted — history is continuous, the tree is empty.
4. v3 content is extracted **once** into `docs/reference/content-inventory.md`, and its design values into `docs/reference/v3-design-audit.md`. These, not the old branch, are the source of truth for migration.
5. Binary assets are copied into a gitignored `_reference/` directory. Brand assets — logo, heart, blob, favicons — are reused directly; they are brand identity, not implementation.

## Consequences

**Makes easy.** Nothing to copy, because nothing is there. Content is available as prose rather than as JSX, so using it means re-implementing it. The extraction happens once instead of every time a contributor re-reads the old source, which matters when contributors are agents with no memory between sessions. The audit surfaced defects that would otherwise have been faithfully reproduced: a failing colour contrast ratio, a font with a licensing problem, a body font that was never loaded, duplicate anchor ids, broken `tel:` links, and copy claiming four schools where three exist.

**Makes hard.** The inventory can drift from the live site if v3 changes during the rebuild. It is dated and its provenance recorded; if v3 gets edited, re-extract. Reviewers must also check the inventory for accuracy, because a transcription error propagates silently into seeded content.

**Costs.** One upfront extraction pass. It paid for itself immediately in the defect list.

## Alternatives considered

**Keep old source in `_archived/`, excluded from lint and build.** The pattern used on a sibling project, and it works there. Rejected here: it puts the old implementation one keystroke away in the working tree, which is exactly the temptation to remove. That project had a single human author; this one is agent-driven.

**Fresh repository.** Cleanest possible break. Rejected: loses issue history, stars, and the continuity of the URL, and makes the old code harder to reach rather than merely inconvenient.

**Force-reset the abandoned `v4`.** Simplest naming. Rejected: unreachable commits get garbage-collected, and there was no reason to destroy the branch when renaming costs nothing.

**Build on the abandoned template.** Rejected outright: it is the unmodified starter on the wrong database, the wrong styling approach, and a Next version incompatible with current Payload. Scaffolding fresh is faster than unpicking it.
