# powerkids-site

Website for **PowerKids Kindergarten** — three schools across the Klang Valley, Malaysia. <https://powerkids.edu.my>

This branch (`v4`) is a ground-up rebuild. Its purpose is to move every piece of content out of code and into a CMS, so school staff can edit copy, swap photos, add pages, and rearrange sections without a developer.

## Status

Phases 0–4 (foundation, design system, content model, rendering) are done. Phase 5 (automated content migration) was permanently skipped — the owner populates the CMS by hand instead of migrating v3 copy. **Phase 6 (launch: SEO, accessibility, cutover) is next.** See [the phase list](#phases).

## Stack

| Layer     | Choice                                                                        |
| --------- | ----------------------------------------------------------------------------- |
| Framework | [Next.js](https://nextjs.org) (App Router), `16.2.12`                         |
| CMS       | [Payload](https://payloadcms.com) `3.86.0`, mounted in same app               |
| Database  | [Neon](https://neon.tech) Postgres                                            |
| Media     | [Cloudflare R2](https://developers.cloudflare.com/r2/), S3-compatible adapter |
| Hosting   | [Vercel](https://vercel.com)                                                  |
| Styling   | Vanilla CSS — design tokens, CUBE-style composition primitives, CSS Modules   |
| Language  | TypeScript, strict                                                            |
| Packages  | pnpm                                                                          |

Versions pinned exactly, not caret-ranged. Payload couples tightly to Next — doesn't support Next `15.5`–`16.1.x` — so upgrades are deliberate change, not incidental.

## Getting started

Requires Node `>=22` (see `.nvmrc`) and pnpm.

```bash
pnpm install
cp .env.example .env
```

Fill in `.env` — every key documented there, and in [docs/ops/environments.md](docs/ops/environments.md). Need Neon connection string and Cloudflare R2 credentials; ask owner. Then:

```bash
pnpm migrate
pnpm dev
```

Public site runs at [localhost:3000](http://localhost:3000), admin panel at [/admin](http://localhost:3000/admin). Don't use `/admin`'s account-creation prompt — this project shares one permanent dev admin login instead. Set it up:

```bash
pnpm sync:dev-admin  # paste credentials from your password manager
pnpm seed:dev-admin  # creates/updates the account in your local DB
```

See [docs/ops/environments.md](docs/ops/environments.md#dev-admin-account) for why and the full flow.

**Every variable must be set before anything runs, including build** — Payload config reads them while Next collects page data. Missing one fails loudly, naming itself.

### Commands

|                              |                                                          |
| ---------------------------- | -------------------------------------------------------- |
| `pnpm dev`                   | Dev server                                               |
| `pnpm verify`                | lint → typecheck → test → build. Run before committing.  |
| `pnpm migrate`               | Apply pending migrations                                 |
| `pnpm migrate:create <name>` | Generate migration after schema change                   |
| `pnpm generate:types`        | Regenerate `payload-types.ts`                            |
| `pnpm generate:importmap`    | Regenerate admin import map after adding admin component |

Git hooks handle formatting on commit, run full verify loop on push.

## Code structure & notable engineering practices

For a reviewer skimming the codebase rather than running it.

**One app, two route groups.** `src/app/(site)/` is the public marketing site; `src/app/(payload)/` is the generated Payload admin panel, mounted in the same Next.js deploy rather than run as a separate service (see [ADR 0001](docs/adr/0001-nextjs-payload-vercel.md)). `(payload)` and `src/payload-types.ts` are generated output — excluded from lint/format, never hand-edited, regenerated with `pnpm generate:types`.

**Content is data, never markup.** Navigation, contact details, opening hours, school addresses, programs, and events are all CMS records (`src/payload/collections/`, `src/payload/globals/`), not hardcoded JSX. Pages are editor-composed from a closed catalogue of **blocks** — see [docs/architecture/blocks.md](docs/architecture/blocks.md).

**Every schema change ships through a migration, in every environment — no exceptions, dev included.** The Postgres adapter's `push` option is unconditionally `false`; it used to auto-push schema in dev, until drizzle-kit's structural-diff resolution silently dropped and recreated a table on a shared dev database. See [docs/ops/migrations.md](docs/ops/migrations.md).

**Media filenames are content-addressed.** Uploads are renamed to include a content hash (`hero-4846c1b1.webp`) before Payload derives size variants, so a 4-hour edge cache never serves stale bytes after a replacement — different content gets a different URL instead of colliding on cache-control. See [docs/ops/environments.md#media-serving-and-cache](docs/ops/environments.md#media-serving-and-cache).

**Duplicate uploads are flagged, not blocked.** Media re-uploads are detected by checksum group and surfaced to editors for review rather than silently rejected or silently allowed — the system warns, the editor decides. See [ADR 0005](docs/adr/0005-media-duplicate-detection-by-checksum-group.md).

**CI never touches a real database.** Pages using the Payload Local API at build time need a live `DATABASE_URI` for static generation; CI instead runs `next build --experimental-build-mode compile`, which type-checks and compiles every route without running generation, so a placeholder `DATABASE_URI` is enough. The real static build happens on Vercel, where a real database is present. See [docs/ops/environments.md](docs/ops/environments.md).

**Docs are progressive disclosure, not a wiki.** [AGENTS.md](AGENTS.md) stays a short router; each `docs/<topic>/` folder carries its own index of what's inside and when to read it, so an agent (or a new contributor) opens only what the current task needs. [CONTEXT.md](CONTEXT.md) holds the domain glossary; [docs/adr/](docs/adr/) holds decisions expensive enough to justify writing down.

## Documentation

- **[AGENTS.md](AGENTS.md)** — conventions, non-negotiables, pointers to everything else. Start here.
- **[CONTEXT.md](CONTEXT.md)** — domain glossary (School, Block, Page).
- **DESIGN.md** — visual identity: tokens, type scale, invariants.
- **[docs/architecture/](docs/architecture/)** — system shape, content model, block catalogue.
- **[docs/design/](docs/design/)** — layout primitives, tokens, components.
- **[docs/workflows/](docs/workflows/)** — verify loop, worktrees, how to add a block or page, how to edit content.
- **[docs/ops/](docs/ops/)** — environments, deploy, migrations.
- **[docs/adr/](docs/adr/)** — architecture decision records.

## History

| Ref              | What                                         |
| ---------------- | -------------------------------------------- |
| `main`           | Currently live v3 site                       |
| `v3-final` (tag) | Exact state of live site at start of rebuild |

## Licence

MIT
