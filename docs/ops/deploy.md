# Deploy and Rollback

**Purpose:** how code reaches production, and how to get back when it shouldn't have.
**Read this when:** shipping, or something is broken in production.

> **Status: pipeline live, cutover pending.** Preview and production deploys work as described. The DNS switch is Phase 6.

---

## Vercel setup

**Environment variables must exist before the first deploy succeeds.** The Payload config reads them while Next collects page data, so a project with no variables fails at build with `Missing required environment variable: …` — this is the intended behaviour, not a misconfiguration to work around. Set every key from [environments.md](environments.md) for **both** Preview and Production.

Two must differ between environments:

- **`PAYLOAD_SECRET`** — a distinct value per environment. Sharing it means a session token minted against preview is valid against production.
- **`NEXT_PUBLIC_SERVER_URL`** — the actual origin of that environment. A localhost value left in preview breaks preview callbacks and absolute URLs.

Preview deploys point at the **dev** Neon branch and dev R2 bucket. Previews exist to review code; pointing them at production data risks an editor's real content being altered by a branch that never merges.

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

**Bad media** — deleting or replacing a file takes effect in the database immediately, but the media domain caches for four hours, so the old image keeps being served from the edge. See [environments.md](environments.md#media-serving-and-cache).

## Launch cutover (Phase 6)

Planned in full before the day. Outline:

1. Lower the DNS TTL well in advance.
2. Verify every v3 URL resolves on the new deployment — the route map in [../reference/content-inventory.md](../reference/content-inventory.md) is the checklist.
3. Seed and proof-read production content.
4. Switch DNS.
5. Watch logs and analytics for 404s.
6. Keep the v3 deployment live and reachable until the new site is proven.

Rollback is repointing DNS. Which is why the old deployment stays up.
