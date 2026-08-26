# Architecture Overview

**Purpose:** how system fit together — one app, requests go where, data live where.
**Read this when:** new to repo, or change cross more than one directory.

---

## Shape

One Next.js app serve both public site and CMS admin panel. Payload mount into App Router as route group — one deploy, one build, one set TypeScript types shared end to end.

```
Visitor ──► Vercel ──► Next.js App Router
                        ├── (site)     public pages, server components
                        └── (payload)  /admin panel + REST/GraphQL API
                                  │
                        ┌─────────┴─────────┐
                   Neon Postgres      Cloudflare R2
                   (content)          (media originals + sizes)
```

Editors and visitors hit same deployment. No separate CMS service to run, monitor, keep in sync.

## Rendering

- **Server components default.** Content rendering never ship JavaScript. `"use client"` need stated reason.
- **Pages are data.** Route resolve `pages` record by slug, walk `layout` array, render one component per block.
- **Cache on tags, revalidate on publish.** Payload hooks revalidate affected paths on document publish.
- **Drafts** render through Next's draft mode; Payload's live preview point at same routes.

## Where code lives

`ls src/` for the layout — it's shallow and self-describing. What isn't obvious from the tree:

- **`src/payload/`** holds everything Payload owns: collections, globals, blocks, access utilities, admin components, migrations. `payload.config.ts` at `src/` is the centre of gravity.
- **`src/app/(payload)/`** is Payload's required integration shape, not hand-written app code. Excluded from lint and formatting; regenerate rather than edit.
- **`src/payload-types.ts`** is generated from the config — never edit it. Regenerate with `pnpm generate:types`.
- **Migrations** are generated, committed, and never hand-edited after running — see [../workflows/migrations.md](../workflows/migrations.md).

## Boundaries

- **`src/lib/` pure.** No React, no Payload imports, no environment access. Everything unit-testable isolation.
- **Blocks own schema and renderer**, side by side. Block = one directory readable in full.
- **Collections never import components.** Schema and presentation stay separate; renderer map over data.
- **Nothing read `process.env` outside typed config module** — `src/lib/env.ts` only one that does.

## Related

- Content model: [content-model.md](content-model.md)
- Block catalogue: [blocks.md](blocks.md)
- Environments and bindings: [../workflows/environments.md](../workflows/environments.md)
- Why this stack: [../adr/0001-nextjs-payload-vercel.md](../adr/0001-nextjs-payload-vercel.md)
