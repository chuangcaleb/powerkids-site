# Database Migrations

**Purpose:** how schema changes reach each database safely.
**Read this when:** you changed collection, global, or block field.

> **Status: not yet configured.** Phase 1 establish migration setup.

---

## The rule

**Every schema change ships with migration.** Payload push schema auto in dev, but production run migrations only. Field added without one work locally, fail on deploy.

## Loop

```bash
pnpm payload migrate:create <descriptive-name>   # after changing the schema
pnpm payload migrate                             # apply locally
pnpm generate:types                              # regenerate payload-types.ts
pnpm verify
```

Commit migration file and regenerated types together with schema change. Migrations run auto on deploy.

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
