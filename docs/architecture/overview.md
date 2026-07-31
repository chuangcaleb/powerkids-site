# Architecture Overview

**Purpose:** how system fit together — one app, requests go where, data live where.
**Read this when:** new to repo, or change cross more than one directory.

> **Status: partly built.** App shell, admin panel, database, media storage exist as of Phase 1. Content collections, blocks, rendering layer arrive Phase 3 and 4 — those sections marked below.

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

## Rendering _(Phase 4)_

- **Server components default.** Content rendering never ship JavaScript. `"use client"` need stated reason.
- **Pages are data.** Route resolve `pages` record by slug, walk `layout` array, render one component per block.
- **Cache on tags, revalidate on publish.** Payload hooks revalidate affected paths on document publish.
- **Drafts** render through Next's draft mode; Payload's live preview point at same routes.

## Directory map

Directories marked _(later)_ do not exist yet.

```
src/
  app/
    (site)/          public routes, layouts, metadata
    (payload)/       admin panel + API — Payload's required route shape
  collections/       Payload collection definitions
  globals/           Payload global definitions              (Phase 3)
  blocks/            one directory per block: config + renderer  (Phase 3–4)
  components/        shared UI, one directory each, CSS Modules co-located  (Phase 2)
  styles/                                                    (Phase 2)
    tokens/          design tokens — the single source of implementation values
    global/          reset, base typography
    compositions/    layout primitives
    utilities/       single-purpose helpers
  lib/               framework-agnostic helpers, pure functions
    env.ts           only module reading process.env
  migrations/        generated, committed, never hand-edited after running
  payload.config.ts  centre of gravity
  payload-types.ts   generated from config — do not edit
docs/                see AGENTS.md for the map
```

Files under `src/app/(payload)/` are Payload's required integration shape, not hand-written app code. Excluded from lint and formatting; regenerate rather than edit.

## Boundaries

- **`src/lib/` pure.** No React, no Payload imports, no environment access. Everything unit-testable isolation.
- **Blocks own schema and renderer**, side by side. Block = one directory readable in full.
- **Collections never import components.** Schema and presentation stay separate; renderer map over data.
- **Nothing read `process.env` outside typed config module** — `src/lib/env.ts` only one that does.

## Related

- Content model: [content-model.md](content-model.md)
- Block catalogue: [blocks.md](blocks.md)
- Environments and bindings: [../ops/environments.md](../ops/environments.md)
- Why this stack: [../decisions/0001-nextjs-payload-vercel.md](../decisions/0001-nextjs-payload-vercel.md)
