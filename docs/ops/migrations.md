# Database Migrations

**Purpose:** how schema changes reach each database safely.
**Read this when:** you changed collection, global, or block field.

---

## The rule

**Every schema change ships with migration — dev included.** `push` is `false` unconditionally in `src/payload.config.ts`. It used to be `!isProduction`, so dev auto-pushed schema on every boot — but drizzle-kit push resolves structural diffs (blocks/arrays/relationships, enum edits, type changes) by dropping and recreating the table instead of altering it, silently, since a dev server has no TTY to prompt on. That wiped real dev data on restart. Migrations are the only schema path now, in every environment.

## Loop

```bash
pnpm migrate:create <descriptive-name>   # after changing the schema
pnpm migrate                             # apply locally
pnpm generate:types                      # regenerate payload-types.ts
pnpm verify
```

Run `pnpm migrate` after pulling anyone else's schema change too, before starting `pnpm dev` — nothing applies it for you automatically anymore.

Commit migration file and regenerated types together with schema change. Migrations run auto on deploy.

### Generated import gets patched auto

Payload's generator emits this at top of every migration:

```ts
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
```

`MigrateUpArgs` and `MigrateDownArgs` are **type-only** exports, so under ESM this fails at runtime with `does not provide an export named 'MigrateDownArgs'` and `pnpm migrate` dies before applying anything — error points at module system, not real cause.

`pnpm migrate:create` therefore runs `scripts/fix-migration-imports.mjs` after, rewriting line to `import type`. Nothing to remember; not manual step.

If you generate migration by calling Payload CLI directly, run script yourself. Delete both once Payload release fixes generator.

## Writing them

- **Name for what they do**: `add-school-map-url`, not `update-1`.
- **Read generated SQL before committing.** Renames especially: Payload may emit drop plus add, silently destroy data. Rewrite as real rename.
- **Additive first.** To rename/remove field with content in it: add new field, backfill it, deploy, migrate data, then drop old one in later change. Two deploys, no data loss.
- **Test against copy of production data**, not empty database. Empty databases migrate clean no matter how wrong migration is.
- **Never edit migration that has run** anywhere. Write new one instead.

## Neon branching

Neon branches: cheap copies of database. Use one to rehearse risky migration against real data, then throw away. Same way seed script gets tested repeatedly from clean state.

## When it fails mid-deploy

Database may be half-migrated. Don't retry blindly. Restore to pre-deploy point, fix migration, deploy again. See [deploy.md](deploy.md).
