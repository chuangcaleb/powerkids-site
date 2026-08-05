# Agent Guide

Router for automated contributors. Read fully; read linked docs only when task touch them.

**Project:** `powerkids.edu.my` — website for PowerKids Kindergarten, Klang Valley, Malaysia. Branch (`v4`) from-scratch rebuild on Next.js + Payload CMS, replace v3 Astro site.

**Current phase:** `docs/phases/README.md` owns this. It is the only place phase status is recorded — don't restate it here or anywhere else. Starting a phase? Read that index, then **only your own phase file**.

**What's true right now lives in code, not in docs.** These docs carry requirements, rules, and rationale. For what exists — which blocks, which fields, which components — read `src/`. Any doc that enumerates code contents has been deleted for drifting; don't add one back.

---

## Non-negotiables

1. **Never copy v3 code.** Old implementation lives on `v3` branch and `v3-final` tag. Read for content/design intent (`git show v3-final:<path>`); reimplement from scratch. Same for `archive/v4-payload-template`, abandoned starter-template attempt.
2. **Content is data, never markup.** Navigation, social links, contact details, opening hours, school addresses, programs, events — CMS records. Typing phone number into component: stop.
3. **Docs carry intent, never inventory.** Update a doc when a change breaks a stated rule or adds rationale the code can't express. Do **not** add field lists, block catalogues, component inventories, or directory maps — code is the source for those, and every such list this repo has held went stale.
4. **Repo tool-neutral.** Write for any coding agent. Never name AI vendors, products, models in tracked files, commit messages, PR titles/bodies. No co-author or "generated with" trailers. Per-tool config files gitignored — keep that way.
5. **Never read `.env`.** Secrets owner's responsibility. Write/update `.env.example` with key names + comments only.
6. **Never push to `main`.** Work feature branch off `v4`, open PR, owner merges.

---

## Working agreement

- **Plan gate per phase, PR per feature — "feature" sized by judgment, not fixed unit count.** Propose plan, get approval before starting phase. State branch/PR split and review checkpoint locations in plan. Default: one branch per large coherent unit; group small units together (especially frontend work you're confident in) rather than branching per sub-step (tokens, then primitives, then styles, ...). Some phases need several branches, some just one — per-phase call, not fixed rule. Cut branches at stated granularity, else git ceremony (ancestor-check, fast-forward, push) repeats with no review benefit.
- **Conventional commits**: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`. Branch names descriptive: `feat/hero-block`, `fix/footer-nav-order`.
- **One commit per task, not one commit per branch.** A branch/PR can span many blocks or files; each distinct unit of work (one block, one bug fix, one doc correction) gets its own commit. A single commit mixing unrelated changes — e.g. "add 11 block renderers" plus "fix an unrelated Phase 3 slug bug" plus "docs update" — is too large to review or `git bisect`. Split as you go; don't batch and squash at the end.
- **Verify before every commit** — see `docs/workflows/verify-loop.md`. Mid-edit, run targeted lint/typecheck on touched files, not full `pnpm verify` — save that for pre-push checkpoints.
- **Small, obvious changes**: execute directly. Architectural: propose first.
- **Review checkpoint = natural checkpoint, not every commit.** Stop, ask review at end of logical work chunk, or wherever you'd otherwise pause to ask "continue?" — not after each commit.
- **Library claims feature central to plan → prove empirically first.** One cheap test (curl API, inspect built output, read served file) beats full implementation cycle discovered wrong after fact.
- **Unusual git op (refspec push, force flag, history rewrite) → flag to user before attempting**, not after permission denial.
- **Shared branch, concurrent worktrees possible → `git worktree list` once before op**, not re-discovered per retry.

---

## Where things are

Load-on-demand. Open a doc **when** its trigger fires, not to browse.

| Read                                  | When                                                                    |
| ------------------------------------- | ----------------------------------------------------------------------- |
| `DESIGN.md`                           | Writing any CSS, or choosing a colour, shadow, or motion behaviour      |
| `docs/design/layout-primitives.md`    | Writing layout — before reaching for grid, flex, or a media query       |
| `docs/design/tokens.md`               | Unsure which token means what, or tempted to add a new one              |
| `docs/design/components.md`           | About to create a new shared component                                  |
| `docs/architecture/overview.md`       | Change crosses more than one directory, or you're new to the repo       |
| `docs/architecture/content-model.md`  | Adding or changing a collection/global field, or seeding data           |
| `docs/architecture/blocks.md`         | Adding, changing, or deciding against a block                           |
| `docs/payload.md`                     | Any task touching `src/payload/`                                        |
| `docs/workflows/verify-loop.md`       | Before committing                                                       |
| `docs/workflows/adding-a-block.md`    | A content need no existing block covers                                 |
| `docs/workflows/adding-a-page.md`     | Someone asks for a new page — usually the answer is "no code needed"    |
| `docs/ops/environments.md`            | Touching env vars, R2, Neon, or anything that differs per environment   |
| `docs/ops/migrations.md`              | Schema changed — always, no exceptions                                  |
| `docs/ops/deploy.md`                  | Deploying or rolling back                                               |
| `docs/decisions/`                     | About to redo or reverse a past architectural decision                  |
| `docs/reference/content-inventory.md` | Need real v3 copy, a route that must keep resolving, or an owner ruling |
| `docs/reference/v3-design-audit.md`   | Deciding whether a v3 visual element carries over                       |
| `docs/phases/README.md`               | Starting a phase, or need to know what phase the repo is in             |

---

## Implementation conventions

- **Server components default.** Add `"use client"` only when component genuinely needs interactivity, say why in comment.
- **No CSS framework.** Compose layout from primitives in `src/styles/compositions/`; scope component styles with CSS Modules. Layout needs media query — check primitive first.
- **No magic values.** Colours, spacing, type sizes, radii come from tokens. Raw hex/px value in component = review finding.
- **Prefer framework's own primitive over hand-written one.** Before writing helper, check whether Payload or Next already provides it — Payload especially ships things easy to miss (`slugField()`, `imageSizes`, `formatOptions`, access-control helpers). Built-in handles edge cases you haven't thought of yet, one less thing to maintain. If you do write own, say in comment what you checked and why it didn't fit, so next person can re-evaluate on upgrade instead of assuming oversight.
- **kebab-case filenames.** Named exports preferred.
- **Every uploaded image needs `alt`.** Enforced at schema level; don't work around it.
- **Blocks closed set.** Editors choose from the blocks in `src/payload/blocks/`. Adding one: deliberate change with owner sign-off, not convenience — see `docs/workflows/adding-a-block.md`.

---

## Gotchas

Repo-specific facts that defy the reasonable assumption. Each has already cost time.

- **`component.tsx`, not `Component.tsx`.** kebab-case everywhere, including block renderers. Docs said otherwise for months; the docs were wrong.
- **Home page slug is `index`, not `home`.** Revalidation, preview redirects, and sitemap logic all branch on it.
- **`push: false` unconditionally** in the Postgres adapter. Never gate it on `NODE_ENV` — a dev push against a shared database already destroyed data once. Schema changes go through migrations, always.
- **No end-to-end suite exists.** No Playwright, no axe-core, no specs. `pnpm test` is `vitest` over unit tests only. Don't write steps that reference a browser suite.
- **No per-tool package scripts.** `pnpm lint`/`typecheck`/`test`/`build`/`verify` exist; `pnpm eslint`/`stylelint` do not. Use `pnpm exec` for targeted runs.
- **Only `src/lib/env.ts` reads `process.env`.** Everything else imports from it.
- **`src/app/(payload)/` is generated integration shape**, excluded from lint and formatting. Regenerate, never hand-edit. Same for `src/payload-types.ts`.
- **Adding an admin component needs `pnpm generate:importmap`**, not just `generate:types`.
- **`pnpm migrate:create` patches migration imports automatically.** Calling the Payload CLI directly means running `scripts/fix-migration-imports.mjs` yourself.

---

## Domain vocabulary

Use these words precisely; they're CMS's terms too.

- **School** — one of physical branches (Sri Petaling, Puchong Utama, Parklane OUG). Not "location", not "centre", not "branch".
- **Program** — daily offering with fixed hours (Morning School, After School Program, Evening Daycare). Not "class", not "course".
- **Event** — recurring school activity type (Graduation, Sports Day, Field Trips, Community Service). Not dated calendar entry.
- **Block** — one entry in page's `layout` array; unit editor adds and reorders.
- **Page** — editor-composed route, built from blocks.
