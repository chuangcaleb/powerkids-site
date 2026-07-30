# powerkids-site

Website for **PowerKids Kindergarten** — three schools across the Klang Valley, Malaysia. <https://powerkids.edu.my>

This branch (`v4`) is a ground-up rebuild. Its purpose is to move every piece of content out of code and into a CMS, so school staff can edit copy, swap photos, add pages, and rearrange sections without a developer.

## Status

**Phase 0 of 8** — archive and documentation. No application code yet. See [the phase list](#phases).

## Stack

| Layer | Choice |
| --- | --- |
| Framework | [Next.js](https://nextjs.org) (App Router), `>=16.2.2` |
| CMS | [Payload](https://payloadcms.com) `>=3.73`, mounted in the same app |
| Database | [Neon](https://neon.tech) Postgres |
| Media | [Cloudflare R2](https://developers.cloudflare.com/r2/), S3-compatible adapter |
| Hosting | [Vercel](https://vercel.com) |
| Styling | Vanilla CSS — design tokens, CUBE-style composition primitives, CSS Modules |
| Language | TypeScript, strict |
| Packages | pnpm |

Payload does not support Next `15.5`–`16.1.x`. The version floor is a hard requirement.

## Getting started

> Not yet available — Phase 1 sets this up.

```bash
pnpm install
cp .env.example .env   # fill in your own credentials
pnpm dev
```

The public site runs at `/`, the admin panel at `/admin`.

## Documentation

Docs use progressive disclosure: start narrow, follow links only as far as your task needs.

- **[AGENTS.md](AGENTS.md)** — conventions, non-negotiables, and a map of every other doc. Start here.
- **DESIGN.md** — visual identity: tokens, type scale, invariants. *(Phase 2)*
- **[docs/architecture/](docs/architecture/)** — system shape, content model, block catalogue
- **[docs/design/](docs/design/)** — layout primitives, tokens, components
- **[docs/workflows/](docs/workflows/)** — verify loop, how to add a block or page, how to edit content
- **[docs/ops/](docs/ops/)** — environments, deploy, migrations
- **[docs/decisions/](docs/decisions/)** — architecture decision records
- **[docs/reference/](docs/reference/)** — audited v3 content and design, the migration source of truth

## Phases

| # | Phase | State |
| --- | --- | --- |
| 0 | Archive, extract, document skeleton | in progress |
| 1 | Foundation — app, database, storage, CI, deploy | |
| 2 | Design system — tokens, primitives, components | |
| 3 | Content model — collections, globals, blocks | |
| 4 | Rendering — layouts, pages, block renderers | |
| 5 | Content migration — seed script | |
| 6 | Launch — SEO, performance, accessibility, cutover | |
| 7 | Forms — registration and careers *(deferred)* | |
| 8 | Localisation — activate additional languages *(deferred)* | |

## History

| Ref | What |
| --- | --- |
| `main` | Currently the live v3 site |
| `v3-final` (tag) | Exact state of the live site at the start of the rebuild |
| `v3` (branch) | The Astro implementation — reference only, never copied |
| `archive/v4-payload-template` | An abandoned 2025 attempt on the stock Payload starter |

## Licence

MIT
