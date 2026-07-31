# Architecture Overview

**Purpose:** how the system fits together — one app, where requests go, where data lives.
**Read this when:** you are new to the repo, or a change crosses more than one directory.

> **Status: partly built.** The application shell, admin panel, database, and media storage exist as of Phase 1. Content collections, blocks, and the rendering layer arrive in Phases 3 and 4 — those sections are marked below.

---

## Shape

One Next.js application serves both the public site and the CMS admin panel. Payload mounts into the App Router as a route group, so there is one deploy, one build, one set of TypeScript types shared end to end.

```
Visitor ──► Vercel ──► Next.js App Router
                        ├── (site)     public pages, server components
                        └── (payload)  /admin panel + REST/GraphQL API
                                  │
                        ┌─────────┴─────────┐
                   Neon Postgres      Cloudflare R2
                   (content)          (media originals + sizes)
```

Editors and visitors hit the same deployment. There is no separate CMS service to run, monitor, or keep in sync.

## Rendering _(Phase 4)_

- **Server components by default.** Content rendering never ships JavaScript. `"use client"` requires a stated reason.
- **Pages are data.** A route resolves a `pages` record by slug, then walks its `layout` array and renders one component per block.
- **Cache on tags, revalidate on publish.** Payload hooks revalidate the affected paths when a document is published.
- **Drafts** render through Next's draft mode; Payload's live preview points at the same routes.

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
    env.ts           the only module that reads process.env
  migrations/        generated, committed, never hand-edited after running
  payload.config.ts  the centre of gravity
  payload-types.ts   generated from the config — do not edit
docs/                see AGENTS.md for the map
```

The files under `src/app/(payload)/` are Payload's required integration shape rather than hand-written application code. They are excluded from lint and formatting, and should be regenerated rather than edited.

## Boundaries

- **`src/lib/` is pure.** No React, no Payload imports, no environment access. Everything in it is unit-testable in isolation.
- **Blocks own their schema and their renderer**, side by side. A block is one directory you can read in full.
- **Collections never import components.** Schema and presentation stay separate; the renderer maps over data.
- **Nothing reads `process.env` outside a typed config module.**

## Related

- Content model: [content-model.md](content-model.md)
- Block catalogue: [blocks.md](blocks.md)
- Environments and bindings: [../ops/environments.md](../ops/environments.md)
- Why this stack: [../decisions/0001-nextjs-payload-vercel.md](../decisions/0001-nextjs-payload-vercel.md)
