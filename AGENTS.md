# Agent Guide

Router for automated contributors. Read this file fully; read the linked docs only when your task touches them.

**Project:** `powerkids.edu.my` — website for PowerKids Kindergarten, Klang Valley, Malaysia. This branch (`v4`) is a from-scratch rebuild on Next.js + Payload CMS, replacing the v3 Astro site.

**Current phase:** 0 — archive and documentation. No application code exists yet. Sections below marked *(Phase N)* describe the target state and are not yet true.

---

## Non-negotiables

1. **Never copy v3 code.** The old implementation lives on the `v3` branch and the `v3-final` tag. Read it for content and design intent (`git show v3-final:<path>`); reimplement from scratch. The same applies to `archive/v4-payload-template`, an abandoned starter-template attempt.
2. **Content is data, never markup.** Navigation, social links, contact details, opening hours, school addresses, programs, and events are CMS records. If you find yourself typing a phone number into a component, stop.
3. **Docs ship with the code that changes them.** A change that adds a block without updating `docs/architecture/blocks.md` is incomplete and will be rejected in review.
4. **This repository is tool-neutral.** Write for any coding agent. Do not name AI vendors, products, or models anywhere in tracked files, commit messages, PR titles, or PR bodies. Do not add co-author or "generated with" trailers. Per-tool config files are gitignored — keep them that way.
5. **Never read `.env`.** Secrets are the owner's responsibility. You may write and update `.env.example` with key names and comments only.
6. **Never push to `main`.** Work on a feature branch off `v4`, open a pull request, let the owner merge.

---

## Working agreement

- **Plan gate per phase, PR per feature.** Propose a plan and get approval before starting a phase. Within a phase, open one PR per coherent unit — "add hero + prose blocks", not "phase 4".
- **Conventional commits**: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`. Branch names are descriptive: `feat/hero-block`, `fix/footer-nav-order`.
- **Verify before every commit** — see `docs/workflows/verify-loop.md`. *(Phase 1)*
- **Small, obvious changes**: execute directly. Anything architectural: propose first.

---

## Where things are

| Need | Read |
| --- | --- |
| Visual identity, tokens, invariants | `DESIGN.md` |
| Layout primitives (`flow`, `cluster`, `wrapper`, …) | `docs/design/layout-primitives.md` |
| What token means what | `docs/design/tokens.md` |
| Component inventory | `docs/design/components.md` |
| System shape, rendering strategy, directory map | `docs/architecture/overview.md` |
| Collections, globals, field definitions | `docs/architecture/content-model.md` |
| Block catalogue and per-block editor rules | `docs/architecture/blocks.md` |
| Commands to run before committing | `docs/workflows/verify-loop.md` |
| How to add a block, end to end | `docs/workflows/adding-a-block.md` |
| How to add a page | `docs/workflows/adding-a-page.md` |
| Env vars and service bindings | `docs/ops/environments.md` |
| Deploy and rollback | `docs/ops/deploy.md` |
| Database migrations | `docs/ops/migrations.md` |
| Why a past decision was made | `docs/decisions/` |
| v3 content, verbatim | `docs/reference/content-inventory.md` |
| v3 design values, audited | `docs/reference/v3-design-audit.md` |

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js (App Router), `>=16.2.2` |
| CMS | Payload `>=3.73`, mounted in the same app |
| Database | Neon Postgres via `@payloadcms/db-postgres` |
| Media | Cloudflare R2 via `@payloadcms/storage-s3` |
| Image processing | `sharp`, Node runtime |
| Hosting | Vercel |
| Styling | Vanilla CSS — tokens, composition primitives, CSS Modules |
| Language | TypeScript, `strict` |
| Packages | pnpm |

The Next.js floor is a hard requirement, not a preference: Payload does not support Next `15.5`–`16.1.x`.

---

## Implementation conventions

- **Server components by default.** Add `"use client"` only when a component genuinely needs interactivity, and say why in a comment.
- **No CSS framework.** Compose layout from the primitives in `src/styles/compositions/`; scope component styles with CSS Modules. If a layout needs a media query, first check whether a primitive already solves it.
- **No magic values.** Colours, spacing, type sizes, and radii come from tokens. A raw hex or px value in a component is a review finding.
- **kebab-case filenames.** Named exports preferred.
- **Every uploaded image needs `alt`.** Enforced at the schema level; do not work around it.
- **Blocks are a closed set.** Editors choose from the catalogue in `docs/architecture/blocks.md`. Adding one is a deliberate change with a documented workflow, not a convenience.

---

## Domain vocabulary

Use these words precisely; they are the CMS's terms too.

- **School** — one of the physical branches (Sri Petaling, Puchong Utama, Parklane OUG). Not "location", not "centre", not "branch".
- **Program** — a daily offering with fixed hours (Morning School, After School Program, Evening Daycare). Not "class", not "course".
- **Event** — a recurring school activity type (Graduation, Sports Day, Field Trips, Community Service). Not a dated calendar entry.
- **Block** — one entry in a page's `layout` array; the unit an editor adds and reorders.
- **Page** — an editor-composed route, built from blocks.
