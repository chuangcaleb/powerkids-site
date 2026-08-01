# Agent Guide

Router for automated contributors. Read fully; read linked docs only when task touch them.

**Project:** `powerkids.edu.my` — website for PowerKids Kindergarten, Klang Valley, Malaysia. Branch (`v4`) from-scratch rebuild on Next.js + Payload CMS, replace v3 Astro site.

**Current phase:** 1 done, moving to 2 — design system. App shell, admin panel, database, media storage exist, merged to `v4`. Content model, blocks, rendering not built yet. Sections marked _(Phase N)_ describe target state, not yet true.

**Starting a phase?** Read `docs/phases/README.md` for status, then **only your own phase file**. Self-contained; reading all wastes context.

---

## Non-negotiables

1. **Never copy v3 code.** Old implementation lives on `v3` branch and `v3-final` tag. Read for content/design intent (`git show v3-final:<path>`); reimplement from scratch. Same for `archive/v4-payload-template`, abandoned starter-template attempt.
2. **Content is data, never markup.** Navigation, social links, contact details, opening hours, school addresses, programs, events — CMS records. Typing phone number into component: stop.
3. **Docs ship with code that changes them.** Block change without `docs/architecture/blocks.md` update: incomplete, rejected in review.
4. **Repo tool-neutral.** Write for any coding agent. Never name AI vendors, products, models in tracked files, commit messages, PR titles/bodies. No co-author or "generated with" trailers. Per-tool config files gitignored — keep that way.
5. **Never read `.env`.** Secrets owner's responsibility. Write/update `.env.example` with key names + comments only.
6. **Never push to `main`.** Work feature branch off `v4`, open PR, owner merges.

---

## Working agreement

- **Plan gate per phase, PR per feature — "feature" sized by judgment, not fixed unit count.** Propose plan, get approval before starting phase. State branch/PR split and review checkpoint locations in plan. Default: one branch per large coherent unit; group small units together (especially frontend work you're confident in) rather than branching per sub-step (tokens, then primitives, then styles, ...). Some phases need several branches, some just one — per-phase call, not fixed rule. Cut branches at stated granularity, else git ceremony (ancestor-check, fast-forward, push) repeats with no review benefit.
- **Conventional commits**: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`. Branch names descriptive: `feat/hero-block`, `fix/footer-nav-order`.
- **One commit per task, not one commit per branch.** A branch/PR can span many blocks or files; each distinct unit of work (one block, one bug fix, one doc correction) gets its own commit. A single commit mixing unrelated changes — e.g. "add 11 block renderers" plus "fix an unrelated Phase 3 slug bug" plus "docs update" — is too large to review or `git bisect`. Split as you go; don't batch and squash at the end.
- **Verify before every commit** — see `docs/workflows/verify-loop.md`. _(Phase 1)_ Mid-edit, run targeted lint/typecheck on touched files, not full `pnpm verify` — save that for pre-push checkpoints.
- **Small, obvious changes**: execute directly. Architectural: propose first.
- **Review checkpoint = natural checkpoint, not every commit.** Stop, ask review at end of logical work chunk, or wherever you'd otherwise pause to ask "continue?" — not after each commit.
- **Library claims feature central to plan → prove empirically first.** One cheap test (curl API, inspect built output, read served file) beats full implementation cycle discovered wrong after fact.
- **Unusual git op (refspec push, force flag, history rewrite) → flag to user before attempting**, not after permission denial.
- **Shared branch, concurrent worktrees possible → `git worktree list` once before op**, not re-discovered per retry.

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
| Phase status, plans, pre/post requirements             | `docs/phases/README.md`               |

---

## Implementation conventions

- **Server components default.** Add `"use client"` only when component genuinely needs interactivity, say why in comment.
- **No CSS framework.** Compose layout from primitives in `src/styles/compositions/`; scope component styles with CSS Modules. Layout needs media query — check primitive first.
- **No magic values.** Colours, spacing, type sizes, radii come from tokens. Raw hex/px value in component = review finding.
- **Prefer framework's own primitive over hand-written one.** Before writing helper, check whether Payload or Next already provides it — Payload especially ships things easy to miss (`slugField()`, `imageSizes`, `formatOptions`, access-control helpers). Built-in handles edge cases you haven't thought of yet, one less thing to maintain. If you do write own, say in comment what you checked and why it didn't fit, so next person can re-evaluate on upgrade instead of assuming oversight.
- **kebab-case filenames.** Named exports preferred.
- **Every uploaded image needs `alt`.** Enforced at schema level; don't work around it.
- **Blocks closed set.** Editors choose from catalogue in `docs/architecture/blocks.md`. Adding one: deliberate change with documented workflow, not convenience.

---

## Domain vocabulary

Use these words precisely; they're CMS's terms too.

- **School** — one of physical branches (Sri Petaling, Puchong Utama, Parklane OUG). Not "location", not "centre", not "branch".
- **Program** — daily offering with fixed hours (Morning School, After School Program, Evening Daycare). Not "class", not "course".
- **Event** — recurring school activity type (Graduation, Sports Day, Field Trips, Community Service). Not dated calendar entry.
- **Block** — one entry in page's `layout` array; unit editor adds and reorders.
- **Page** — editor-composed route, built from blocks.
