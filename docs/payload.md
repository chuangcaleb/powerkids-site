# Payload — project rules and gotchas

**Purpose:** what Payload's own docs can't tell you — this project's constraints, plus corrections to mistakes agents make here.
**Read when:** any task touching `src/payload/`.

For Payload's API surface (field types, config shapes, hook signatures, operator lists) use the `payload` skill or <https://payloadcms.com/docs>. Do not vendor upstream docs back into this repo — a stale copy is worse than no copy.

## Rules that survive every task

- Access control is default-deny: no `access` function means no public access. Set `access` explicitly on every collection — including admin-only ones.
- Local API skips access control unless you pass `overrideAccess: false` **plus** `user`. Passing `user` alone silently runs with full privileges.
- Drafts must never leak to the public site — public reads filter `_status` or omit `draft: true`.
- Field-level `read` denial is silent: the field is omitted, no error. A missing one on a sensitive field is a leak, not a crash.
- `depth` populates relationships and costs a query per level; `depth: 0` returns IDs only.
- Schema change means `pnpm generate:types` plus a migration, in the same commit.
- Nested Local API calls inside a hook must thread `req` through, or they fall outside the request transaction.
- Field hooks take `{ value, siblingData }` and return a value; collection hooks take `{ doc, data, req }` and act on the document — not interchangeable.
- A hook that writes to its own collection re-triggers itself unless guarded with a `req.context` flag.
- Uploads carry a required `alt` — Payload does not enforce it, the field config does.
- Config is read once at startup; never mutate it at runtime.

## Project constraints

- One auth collection (`users`), no public signup. `Boolean(req.user)` is a sufficient admin check for most operations.
- Single-language content — `locale` is unused. Activating a second locale is deferred — see [future/localisation.md](future/localisation.md).
- Server components read **exclusively** through the Local API. REST/GraphQL exist but are only relevant if a client component fetches after mount.

## Gotchas

Each of these is a correction to something an agent gets wrong by default — usually because upstream examples show otherwise.

- **`push: false`, unconditionally.** Upstream examples gate it on `NODE_ENV === 'development'`. Don't. A stray dev run against a shared database already destroyed data once — see [workflows/migrations.md](workflows/migrations.md).
- **`slugField()` option is `fieldToUse`**, not `useAsSlug`. See call sites in `src/payload/collections/*/index.ts`.
- **The home page slug is `index`, not `home`.** Hooks, preview redirects, and sitemap logic all branch on it. Copying an upstream revalidate example that tests `slug === 'home'` produces a page that never revalidates.
- **`migrationDir` is `src/payload/migrations`**, resolved from `payload.config.ts` — not `./migrations`.
- **Preview route is `src/app/(site)/preview/route.ts`** (with `exit-preview` alongside), not Payload's suggested `/api/preview`.
- **R2 needs `region: 'auto'`** — it's a required-field placeholder, not a location hint.
- **`src/app/(payload)/` and `src/payload-types.ts` are generated**, excluded from lint and formatting. Regenerate (`pnpm generate:types`), never hand-edit.
- **Adding an admin component needs `pnpm generate:importmap`**, not just `generate:types`.

## Related

- This project's collections, globals, fields: [architecture/content-model.md](architecture/content-model.md)
- Block catalogue and editor rules: [architecture/blocks.md](architecture/blocks.md)
- Add a block, end to end: [workflows/adding-a-block.md](workflows/adding-a-block.md)
- Migration workflow and commands: [workflows/migrations.md](workflows/migrations.md)
- Env vars and service bindings: [workflows/environments.md](workflows/environments.md)
