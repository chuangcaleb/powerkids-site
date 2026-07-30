# Deploy and Rollback

**Purpose:** how code reaches production, and how to get back when it shouldn't have.
**Read this when:** shipping, or something is broken in production.

> **Status: not yet configured.** Phase 1 sets up the pipeline; Phase 6 covers the DNS cutover.

---

## Pipeline

```
feature branch ──PR──► preview deploy + CI
                          │
                       review
                          │
                        merge ──► production deploy
```

Every pull request gets a preview URL with a working admin panel against the dev database. CI runs the [verify loop](../workflows/verify-loop.md); red blocks merge.

Automated contributors never push to `main`. The owner merges.

## Rollback

**Bad code** — Vercel's instant rollback to the previous deployment. Seconds, no rebuild. Do this first, diagnose after.

**Bad data** — Neon's point-in-time restore. Note the ordering trap: rolling back code does **not** roll back a migration. If a deploy migrated the schema, restore the database to a point before it, then redeploy the older code. Rolling back code alone against a migrated database usually fails in a worse way than the original bug.

**Bad content** — Payload version history. Editors restore a previous version of a document themselves; no deploy involved.

## Launch cutover (Phase 6)

Planned in full before the day. Outline:

1. Lower the DNS TTL well in advance.
2. Verify every v3 URL resolves on the new deployment — the route map in [../reference/content-inventory.md](../reference/content-inventory.md) is the checklist.
3. Seed and proof-read production content.
4. Switch DNS.
5. Watch logs and analytics for 404s.
6. Keep the v3 deployment live and reachable until the new site is proven.

Rollback is repointing DNS. Which is why the old deployment stays up.
