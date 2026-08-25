# Architecture Decision Records

**Purpose:** why things are the way they are, so settled questions stay settled.
**Read this when:** you are about to change something structural, or you disagree with an existing choice.

Write an ADR when a decision is **expensive or impossible to reverse**: framework, database, hosting, URL structure, the shape of the content model, anything with a data migration behind it. Do not write one for a choice you could undo in an afternoon.

## Format

Numbered, `NNNN-kebab-title.md`, with these headings:

```markdown
# NNNN. Title

**Status:** proposed | accepted | superseded by [NNNN](NNNN-....md)
**Date:** YYYY-MM-DD

## Context

What forced a decision. Constraints, requirements, what was already true.

## Decision

What was chosen, stated plainly.

## Consequences

What this makes easy, what it makes hard, and what it costs.

## Alternatives considered

Each option and the specific reason it lost.
```

Records are immutable. A decision that changes gets a **new** ADR that supersedes the old one; the old one stays, with its status updated. The trail of reversals is the useful part.

## Index

| #                                                           | Title                                       | Status   |
| ----------------------------------------------------------- | ------------------------------------------- | -------- |
| [0001](0001-nextjs-payload-vercel.md)                       | Next.js + Payload on Vercel, Neon, and R2   | accepted |
| [0002](0002-clean-rebuild-and-archival.md)                  | Clean rebuild with archived history         | accepted |
| [0003](0003-vanilla-css-with-primitives.md)                 | Vanilla CSS with layout primitives          | accepted |
| [0004](0004-single-page-mvp-no-redirects.md)                | Single-page MVP, no v3 URL preservation     | accepted |
| [0005](0005-media-duplicate-detection-by-checksum-group.md) | Media duplicate detection by checksum group | accepted |
| [0006](0006-no-e2e-suite.md)                                | No end-to-end test suite                    | accepted |
| [0007](0007-primitive-override-convention.md)               | Layout primitive override convention        | accepted |
| [0008](0008-primitive-var-naming.md)                        | Layout primitive var naming convention      | accepted |
