# powerkids-site

Website for **PowerKids Kindergarten** — three schools across the Klang Valley, Malaysia. <https://powerkids.edu.my>

This v4 is a ground-up rebuild in PayloadCMS. Its purpose is to move every piece of content out of code and into a CMS, so school staff can edit copy, swap photos, add pages, and rearrange sections without a developer.

## Status

Phases 0–4 (foundation, design system, content model, rendering) are done. Phase 5 (automated content migration) was permanently skipped — the owner populates the CMS by hand instead of migrating v3 copy. **Phase 6 (launch: SEO, accessibility, cutover) is next.** See [the phase list](#phases).

## Stack

| Layer     | Choice                                                                                                             |
| --------- | ------------------------------------------------------------------------------------------------------------------ |
| Framework | [Next.js](https://nextjs.org) (App Router)                                                                         |
| CMS       | [Payload](https://payloadcms.com), mounted in same app                                                             |
| Database  | [Neon](https://neon.tech) Postgres                                                                                 |
| Media     | [Cloudflare R2](https://developers.cloudflare.com/r2/), S3-compatible adapter                                      |
| Hosting   | [Vercel](https://vercel.com)                                                                                       |
| Styling   | Vanilla CSS — design tokens, [Every Layout](https://every-layout.dev/layouts/) composition primitives, CSS Modules |
| Language  | TypeScript, strict                                                                                                 |
| Packages  | pnpm                                                                                                               |

Versions pinned exactly, not caret-ranged. Payload couples tightly to Next — doesn't support Next `15.5`–`16.1.x` — so upgrades are deliberate change, not incidental.

## Getting started

```bash
pnpm install
cp .env.example .env
```

Fill in `.env`. See [docs/ops/environments.md](docs/ops/environments.md).

```bash
pnpm migrate
pnpm dev
```

Public site runs at [localhost:3000](http://localhost:3000), admin panel at [/admin](http://localhost:3000/admin). Avoid `/admin`'s account-creation prompt — this project stores one permanent dev admin credentials. Set it up:

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

## Engineering conventions

### PayloadCMS

**One app, two route groups.** Following PayloadCMS recommended conventions, `src/app/(site)/` is the public-facing marketing site; `src/app/(payload)/` is the generated Payload admin panel, mounted in the same Next.js deploy rather than run as a separate service (see [ADR 0001](docs/adr/0001-nextjs-payload-vercel.md)). `(payload)` and `src/payload-types.ts` are generated output — excluded from lint/format, never hand-edited, regenerated with `pnpm generate:types`.

**Content is data, never markup.** Page content, navigation, contact details — all are CMS records (`src/payload/collections/`, `src/payload/globals/`), not hardcoded JSX. Pages are editor-composed from a closed catalogue of **blocks** — see [docs/architecture/blocks.md](docs/architecture/blocks.md).

### Design & Styling

**Token-driven design.** Avoid magic values, always declare standard tokens in native CSS Variables. `DESIGN.md` is the primary source of truth for why. `src/styles/tokens/` is the implementation of tokens, and the next highest authority.

**Reusable layout primitives.** [Every Layout](https://every-layout.dev/layouts/) methodology is to give layout _hints_ to the browser, and let the browser decide. There's really only a handful of layout archetypes, so we should avoid micromanaging every single box.

**Fluid scales for responsive type and space.** We avoid media breakpoints like the plague (lol) so there's a smooth size scaling between each pixel difference in screen width, instead of sudden jumps. Also allows us to avoid eyeballing arbitrary sizes and breakpoints.

### Media assets

**Media filenames are content-addressed.** Uploads are renamed to include a content hash (`hero-4846c1b1.webp`) before Payload derives size variants, so a 4-hour edge cache never serves stale bytes after a replacement — different content gets a different URL instead of colliding on cache-control. See [docs/ops/environments.md#media-serving-and-cache](docs/ops/environments.md#media-serving-and-cache).

**Duplicate uploads are flagged, not blocked.** Media re-uploads are detected by checksum group and surfaced to editors for review rather than silently rejected. See [ADR 0005](docs/adr/0005-media-duplicate-detection-by-checksum-group.md).

## Documentation

- **AGENTS.md** — conventions, non-negotiables, pointers to everything else. Start here.
- **CONTEXT.md** — domain glossary (School, Block, Page).
- **DESIGN.md** — visual identity: tokens, type scale, invariants.
- **docs/architecture/** — system shape, content model, block catalogue.
- **docs/design/** — layout primitives, tokens, components.
- **docs/workflows/** — verify loop, worktrees, how to add a block or page, how to edit content.
- **docs/ops/** — environments, deploy, migrations.
- **docs/adr/** — architecture decision records.

## Licence

MIT
