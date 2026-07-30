# powerkids-site

Website for **PowerKids Kindergarten** — three schools across the Klang Valley, Malaysia. <https://powerkids.edu.my>

This branch (`v4`) is a ground-up rebuild. Its purpose is to move every piece of content out of code and into a CMS, so school staff can edit copy, swap photos, add pages, and rearrange sections without a developer.

## Status

**Phase 1 of 8** — foundation. The app, admin panel, database, and media storage exist; there is no design system, content model, or public content yet. See [the phase list](#phases).

## Stack

| Layer     | Choice                                                                        |
| --------- | ----------------------------------------------------------------------------- |
| Framework | [Next.js](https://nextjs.org) (App Router), `16.2.12`                         |
| CMS       | [Payload](https://payloadcms.com) `3.86.0`, mounted in the same app           |
| Database  | [Neon](https://neon.tech) Postgres                                            |
| Media     | [Cloudflare R2](https://developers.cloudflare.com/r2/), S3-compatible adapter |
| Hosting   | [Vercel](https://vercel.com)                                                  |
| Styling   | Vanilla CSS — design tokens, CUBE-style composition primitives, CSS Modules   |
| Language  | TypeScript, strict                                                            |
| Packages  | pnpm                                                                          |

Versions are pinned exactly, not caret-ranged. Payload couples tightly to Next — it does not support Next `15.5`–`16.1.x` — so upgrades are a deliberate change, not an incidental one.

## Getting started

Requires Node `>=22` (see `.nvmrc`) and pnpm.

```bash
pnpm install
cp .env.example .env
```

Fill in `.env` — every key is documented there, and in [docs/ops/environments.md](docs/ops/environments.md). You need a Neon connection string and Cloudflare R2 credentials; ask the owner. Then:

```bash
pnpm migrate
pnpm dev
```

The public site runs at [localhost:3000](http://localhost:3000), the admin panel at [/admin](http://localhost:3000/admin). The first visit to `/admin` prompts you to create an account.

**Every variable must be set before anything runs, including the build** — the Payload config reads them while Next collects page data. A missing one fails loudly, naming itself.

### Commands

|                              |                                                                 |
| ---------------------------- | --------------------------------------------------------------- |
| `pnpm dev`                   | Dev server                                                      |
| `pnpm verify`                | lint → typecheck → test → build. Run before committing.         |
| `pnpm migrate`               | Apply pending migrations                                        |
| `pnpm migrate:create <name>` | Generate a migration after a schema change                      |
| `pnpm generate:types`        | Regenerate `payload-types.ts`                                   |
| `pnpm generate:importmap`    | Regenerate the admin import map after adding an admin component |

Git hooks handle formatting on commit and run the full verify loop on push.

## Documentation

Docs use progressive disclosure: start narrow, follow links only as far as your task needs.

- **[AGENTS.md](AGENTS.md)** — conventions, non-negotiables, and a map of every other doc. Start here.
- **DESIGN.md** — visual identity: tokens, type scale, invariants. _(Phase 2)_
- **[docs/architecture/](docs/architecture/)** — system shape, content model, block catalogue
- **[docs/design/](docs/design/)** — layout primitives, tokens, components
- **[docs/workflows/](docs/workflows/)** — verify loop, how to add a block or page, how to edit content
- **[docs/ops/](docs/ops/)** — environments, deploy, migrations
- **[docs/decisions/](docs/decisions/)** — architecture decision records
- **[docs/reference/](docs/reference/)** — audited v3 content and design, the migration source of truth

## Phases

| #   | Phase                                                     | State       |
| --- | --------------------------------------------------------- | ----------- |
| 0   | Archive, extract, document skeleton                       | done        |
| 1   | Foundation — app, database, storage, CI, deploy           | in progress |
| 2   | Design system — tokens, primitives, components            |             |
| 3   | Content model — collections, globals, blocks              |             |
| 4   | Rendering — layouts, pages, block renderers               |             |
| 5   | Content migration — seed script                           |             |
| 6   | Launch — SEO, performance, accessibility, cutover         |             |
| 7   | Forms — registration and careers _(deferred)_             |             |
| 8   | Localisation — activate additional languages _(deferred)_ |             |

## History

| Ref                           | What                                                     |
| ----------------------------- | -------------------------------------------------------- |
| `main`                        | Currently the live v3 site                               |
| `v3-final` (tag)              | Exact state of the live site at the start of the rebuild |
| `v3` (branch)                 | The Astro implementation — reference only, never copied  |
| `archive/v4-payload-template` | An abandoned 2025 attempt on the stock Payload starter   |

## Licence

MIT
