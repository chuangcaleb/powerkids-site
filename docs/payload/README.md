# Payload reference

Payload's own API surface — config shapes, field types, hooks, access, queries. Not this project's content model or conventions; those live in `../architecture/` and `../workflows/`. Read this page, open one sibling file only when the task touches it.

## Read this when

| Task                                                         | Read                                                 |
| ------------------------------------------------------------ | ---------------------------------------------------- |
| Pick or configure a field type                               | [fields.md](./fields.md)                             |
| Configure a collection/global, uploads, drafts, live preview | [collections.md](./collections.md)                   |
| Write a collection or field hook                             | [hooks.md](./hooks.md)                               |
| Write or debug an access function                            | [access-control.md](./access-control.md)             |
| Query via Local API, build a `where`, tune `depth`/`select`  | [queries.md](./queries.md)                           |
| Postgres adapter, S3-compatible media storage                | [adapters.md](./adapters.md)                         |
| Custom endpoints, jobs, admin UI customisation               | [advanced.md](./advanced.md)                         |
| This project's actual collections/globals/fields             | [content-model.md](../architecture/content-model.md) |
| Block catalogue, per-block editor rules                      | [blocks.md](../architecture/blocks.md)               |
| Add a block, end to end                                      | [adding-a-block.md](../workflows/adding-a-block.md)  |
| Migration workflow and commands                              | [migrations.md](../ops/migrations.md)                |

## Rules that survive every task

- Access control is default-deny: no `access` function means no public access (access-control.md).
- Local API skips access control unless you pass `overrideAccess: false` plus `user` (queries.md).
- Drafts must never leak to the public site — public reads filter `_status` or omit `draft: true` (collections.md).
- `depth` populates relationships and costs a query per level; `depth: 0` returns IDs only (queries.md).
- Schema change means `pnpm generate:types` plus a migration, in the same commit (adapters.md, [migrations.md](../ops/migrations.md)).
- Nested Local API calls inside a hook must thread `req` through, or they fall outside the request transaction (adapters.md, hooks.md).
- Field hooks take `{ value, siblingData }` and return a value; collection hooks take `{ doc, data, req }` and act on the document — not interchangeable (hooks.md).
- A hook that writes to its own collection re-triggers itself unless guarded with a `req.context` flag (hooks.md).
- Uploads carry a required `alt` — Payload does not enforce it, the field config does (collections.md).
- Config is read once at startup; never mutate it at runtime (collections.md).

## Not covered here

Trimmed from upstream as out of scope: plugin authoring, RBAC and multi-tenant access, localization, MongoDB/SQLite adapters, non-S3 storage, email adapters, and CMS import tooling. If one becomes relevant, pull it from <https://payloadcms.com/docs> or <https://github.com/payloadcms/skills> rather than guessing.

Condensed from the upstream Payload agent documentation at `payloadcms/skills@832d5bc` (2026-07-07). Refresh by re-condensing from upstream, not by editing these files to match a newer API from memory.
