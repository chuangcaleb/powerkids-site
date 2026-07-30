# Database Migrations

**Purpose:** how schema changes reach each database safely.
**Read this when:** you changed a collection, global, or block field.

> **Status: not yet configured.** Phase 1 establishes the migration setup.

---

## The rule

**Every schema change ships with a migration.** Payload can push schema automatically in development, but production runs migrations only. A field added without one works locally and fails on deploy.

## Loop

```bash
pnpm payload migrate:create <descriptive-name>   # after changing the schema
pnpm payload migrate                             # apply locally
pnpm generate:types                              # regenerate payload-types.ts
pnpm verify
```

Commit the migration file and the regenerated types together with the schema change. Migrations run automatically on deploy.

## Writing them

- **Name them for what they do**: `add-school-map-url`, not `update-1`.
- **Read the generated SQL before committing.** Renames in particular: Payload may emit a drop plus an add, which silently destroys data. Rewrite it as a real rename.
- **Additive first.** To rename or remove a field with content in it: add the new field, backfill it, deploy, migrate the data, then drop the old one in a later change. Two deploys, no data loss.
- **Test against a copy of production data**, not an empty database. Empty databases migrate cleanly no matter how wrong the migration is.
- **Never edit a migration that has run** anywhere. Write a new one.

## Neon branching

Neon branches are cheap copies of the database. Use one to rehearse a risky migration against real data, then throw it away. This is also how the seed script gets tested repeatedly from a clean state.

## When it fails mid-deploy

The database may be half-migrated. Do not retry blindly. Restore to the pre-deploy point, fix the migration, deploy again. See [deploy.md](deploy.md).
