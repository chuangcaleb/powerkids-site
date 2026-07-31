# Agent Guide

Router for automated contributors. Read fully; read linked docs only when task touch them.

**Project:** `powerkids.edu.my` — website for PowerKids Kindergarten, Klang Valley, Malaysia. Branch (`v4`) from-scratch rebuild on Next.js + Payload CMS, replace v3 Astro site.

**Current phase:** 0 — archive and documentation. No app code exists yet. Sections marked _(Phase N)_ describe target state, not yet true.

---

## Non-negotiables

1. **Never copy v3 code.** Old implementation lives on `v3` branch and `v3-final` tag. Read for content/design intent (`git show v3-final:<path>`); reimplement from scratch. Same applies to `archive/v4-payload-template`, abandoned starter-template attempt.
2. **Content is data, never markup.** Navigation, social links, contact details, opening hours, school addresses, programs, events — CMS records. Typing phone number into component: stop.
3. **Docs ship with code that changes them.** Change adding block without updating `docs/architecture/blocks.md` incomplete, rejected in review.
4. **Repo tool-neutral.** Write for any coding agent. Never name AI vendors, products, models in tracked files, commit messages, PR titles/bodies. No co-author or "generated with" trailers. Per-tool config files gitignored — keep that way.
5. **Never read `.env`.** Secrets owner's responsibility. Write/update `.env.example` with key names + comments only.
6. **Never push to `main`.** Work feature branch off `v4`, open PR, owner merges.

---

## Working agreement

- **Plan gate per phase, PR per feature.** Propose plan, get approval before starting phase. Within phase, one PR per coherent unit — "add hero + prose blocks", not "phase 4".
- **Conventional commits**: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`. Branch names descriptive: `feat/hero-block`, `fix/footer-nav-order`.
- **Verify before every commit** — see `docs/workflows/verify-loop.md`. _(Phase 1)_
- **Small, obvious changes**: execute directly. Architectural: propose first.

---

## Where things are

| Need                                                   | Read                                  |
| ------------------------------------------------------ | ------------------------------------- |
| Visual identity, tokens, invariants                    | `DESIGN.md`                           |
| Layout primitives (`flow`, `cluster`, `wrapper`, …)    | `docs/design/layout-primitives.md`    |
| What token means what                                  | `docs/design/tokens.md`               |
| Component inventory                                    | `docs/design/components.md`           |
| System shape, rendering strategy, directory map        | `docs/architecture/overview.md`       |
| Collections, globals, field definitions                | `docs/architecture/content-model.md`  |
| Block catalogue and per-block editor rules             | `docs/architecture/blocks.md`         |
| Payload API — fields, hooks, access, queries, adapters | `docs/payload/README.md`              |
| Commands to run before committing                      | `docs/workflows/verify-loop.md`       |
| How to add a block, end to end                         | `docs/workflows/adding-a-block.md`    |
| How to add a page                                      | `docs/workflows/adding-a-page.md`     |
| Env vars and service bindings                          | `docs/ops/environments.md`            |
| Deploy and rollback                                    | `docs/ops/deploy.md`                  |
| Database migrations                                    | `docs/ops/migrations.md`              |
| Why past decision made                                 | `docs/decisions/`                     |
| v3 content, verbatim                                   | `docs/reference/content-inventory.md` |
| v3 design values, audited                              | `docs/reference/v3-design-audit.md`   |

---

## Stack

| Layer            | Choice                                                    |
| ---------------- | --------------------------------------------------------- |
| Framework        | Next.js (App Router), `>=16.2.2`                          |
| CMS              | Payload `>=3.73`, mounted same app                        |
| Database         | Neon Postgres via `@payloadcms/db-postgres`               |
| Media            | Cloudflare R2 via `@payloadcms/storage-s3`                |
| Image processing | `sharp`, Node runtime                                     |
| Hosting          | Vercel                                                    |
| Styling          | Vanilla CSS — tokens, composition primitives, CSS Modules |
| Language         | TypeScript, `strict`                                      |
| Packages         | pnpm                                                      |

Next.js floor hard requirement, not preference: Payload doesn't support Next `15.5`–`16.1.x`.

---

## Implementation conventions

- **Server components default.** Add `"use client"` only when component genuinely need interactivity, say why in comment.
- **No CSS framework.** Compose layout from primitives in `src/styles/compositions/`; scope component styles with CSS Modules. Layout need media query — check primitive first.
- **No magic values.** Colours, spacing, type sizes, radii come from tokens. Raw hex/px value in component = review finding.
- **kebab-case filenames.** Named exports preferred.
- **Every uploaded image needs `alt`.** Enforced at schema level; don't work around it.
- **Blocks closed set.** Editors choose from catalogue in `docs/architecture/blocks.md`. Adding one deliberate change with documented workflow, not convenience.

---

## Domain vocabulary

Use these words precisely; they CMS's terms too.

- **School** — one of physical branches (Sri Petaling, Puchong Utama, Parklane OUG). Not "location", not "centre", not "branch".
- **Program** — daily offering with fixed hours (Morning School, After School Program, Evening Daycare). Not "class", not "course".
- **Event** — recurring school activity type (Graduation, Sports Day, Field Trips, Community Service). Not dated calendar entry.
- **Block** — one entry in page's `layout` array; unit editor adds and reorders.
- **Page** — editor-composed route, built from blocks.
