# Agents

`powerkids.edu.my` — website for PowerKids Kindergarten, Klang Valley, Malaysia. `v4` from-scratch rebuild on Next.js + Payload CMS, replacing the v3 Astro site.

**pnpm only** (Node ≥22). Scripts: `pnpm dev`, `lint`, `typecheck`, `test`, `build`, `verify`. No per-tool scripts — `pnpm eslint`/`stylelint` don't exist; use `pnpm exec` for targeted runs.

**Current phase:** `docs/phases/README.md` owns it — the only place phase status is recorded. Starting a phase? Read that index, then **only your own phase file**.

---

## Non-negotiables

1. **Never copy v3 code.** Old implementation on `v3` branch / `v3-final` tag. Read for content and design intent (`git show v3-final:<path>`); reimplement from scratch. Same for `archive/v4-payload-template`, an abandoned starter-template attempt.
2. **Content is data, never markup.** Navigation, social links, contact details, opening hours, school addresses, programs, events — CMS records.
3. **Code declares what exists; docs say why and which.** Never write a doc that restates code: no counters, no field lists, no block/component inventories, no directory maps. Rules, rationale, and pick-guides for closed hand-authored sets (layout primitives, token groups) belong in docs; their values do not. Code is single source of truth.
4. **Never read `.env`.** Secrets are the owner's business. Maintain `.env.example` with key names + comments only.

---

## Domain vocabulary

CMS uses these words too. Use them exactly.

- **School** — a physical branch (Sri Petaling, Puchong Utama, Parklane OUG). Not "location", "centre", "branch".
- **Program** — a daily offering with fixed hours (Morning School, After School Program, Evening Daycare). Not "class", "course".
- **Event** — a recurring school activity type (Graduation, Sports Day, Field Trips, Community Service). Not a dated calendar entry.
- **Block** — one entry in a page's `layout` array; the unit an editor adds and reorders.
- **Page** — an editor-composed route, built from blocks.

---

## Where things are

Load-on-demand. Open a doc **when** its trigger fires, not to browse.

| Read                                                                         | When                                                                    |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [docs/conventions.md](docs/conventions.md)                                   | Writing or reviewing any code in `src/`                                 |
| [docs/gotchas.md](docs/gotchas.md)                                           | Anything touching build, migrations, generated files, or tests          |
| [docs/workflows/git.md](docs/workflows/git.md)                               | Branching, committing, opening a PR, or any non-trivial git op          |
| [docs/workflows/verify-loop.md](docs/workflows/verify-loop.md)               | Before every commit and before every push                               |
| [docs/workflows/upgrading-packages.md](docs/workflows/upgrading-packages.md) | Asked to bump/upgrade dependencies, or `pnpm outdated` comes up         |
| [DESIGN.md](DESIGN.md)                                                       | Writing any CSS, or choosing a colour, shadow, or motion behaviour      |
| [docs/design/layout-primitives.md](docs/design/layout-primitives.md)         | Writing layout — before reaching for grid, flex, or a media query       |
| [docs/design/tokens.md](docs/design/tokens.md)                               | Unsure which token means what, or tempted to add a new one              |
| [docs/design/components.md](docs/design/components.md)                       | About to create a new shared component                                  |
| [docs/architecture/overview.md](docs/architecture/overview.md)               | Change crosses more than one directory, or you're new to the repo       |
| [docs/architecture/content-model.md](docs/architecture/content-model.md)     | Adding or changing a collection/global field, or seeding data           |
| [docs/architecture/blocks.md](docs/architecture/blocks.md)                   | Adding, changing, or deciding against a block                           |
| [docs/payload.md](docs/payload.md)                                           | Any task touching `src/payload/`                                        |
| [docs/workflows/adding-a-block.md](docs/workflows/adding-a-block.md)         | A content need no existing block covers                                 |
| [docs/workflows/adding-a-page.md](docs/workflows/adding-a-page.md)           | Someone asks for a new page — usually the answer is "no code needed"    |
| [docs/workflows/content-editing.md](docs/workflows/content-editing.md)       | Editing content as an editor would, or writing editor-facing guidance   |
| [docs/ops/environments.md](docs/ops/environments.md)                         | Touching env vars, R2, Neon, or anything that differs per environment   |
| [docs/ops/migrations.md](docs/ops/migrations.md)                             | Schema changed — always, no exceptions                                  |
| [docs/ops/deploy.md](docs/ops/deploy.md)                                     | Deploying or rolling back                                               |
| [docs/decisions/](docs/decisions/)                                           | About to redo or reverse a past architectural decision                  |
| [docs/reference/content-inventory.md](docs/reference/content-inventory.md)   | Need real v3 copy, a route that must keep resolving, or an owner ruling |
| [docs/reference/v3-design-audit.md](docs/reference/v3-design-audit.md)       | Deciding whether a v3 visual element carries over                       |
| [docs/phases/README.md](docs/phases/README.md)                               | Starting a phase, or need to know what phase the repo is in             |
| [docs/backlog.md](docs/backlog.md)                                           | Loose end looks like a bug — check it wasn't a deliberate deferral      |

---

## Keeping this file small

This file is a router, read on every task. It carries only: what the project is, how to run it, rules that bind every task, and where to go next. Anything narrower — a convention, a workflow, a gotcha — goes in a linked doc. Adding a section here means arguing that every future task needs it.
