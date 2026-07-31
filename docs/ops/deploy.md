# Deploy and Rollback

**Purpose:** how code reach production, and how to get back when it shouldn't have.
**Read this when:** shipping, or something broken in production.

> **Status: pipeline live, cutover pending.** Preview and production deploys work as described. Phase 6 cover DNS switch.

---

## Vercel setup

**Env vars must exist before first deploy succeeds.** Payload config reads them while Next collects page data, so project with no variables fails at build with `Missing required environment variable: …` — intended behaviour, not misconfiguration to work around. Set every key from [environments.md](environments.md) for **both** Preview and Production.

Two must differ between environments:

- **`PAYLOAD_SECRET`** — distinct value per environment. Sharing it means session token minted against preview valid against production.
- **`NEXT_PUBLIC_SERVER_URL`** — actual origin of that environment. Localhost value left in preview breaks preview callbacks and absolute URLs.

Preview deploys point at **dev** Neon branch and dev R2 bucket. Previews exist to review code; pointing them at production data risks editor's real content altered by branch that never merges.

## Pipeline

```
feature branch ──PR──► preview deploy + CI
                          │
                       review
                          │
                        merge ──► production deploy
```

Every pull request get preview URL with working admin panel against dev database. CI run the [verify loop](../workflows/verify-loop.md); red blocks merge.

Automated contributors never push to `main`. Owner merges.

## Rollback

**Bad code** — Vercel's instant rollback to previous deployment. Seconds, no rebuild. Do this first, diagnose after.

**Bad data** — Neon's point-in-time restore. Note ordering trap: rolling back code does **not** roll back migration. If deploy migrated schema, restore database to point before it, then redeploy older code. Rolling back code alone against migrated database usually fails worse than original bug.

**Bad content** — Payload version history. Editors restore previous version of document themselves; no deploy involved.

**Bad media** — deleting/replacing file takes effect in database immediately, but media domain caches four hours, so edge keeps serving old image. See [environments.md](environments.md#media-serving-and-cache)

## Launch cutover (Phase 6)

Planned in full before the day. Outline:

1. Lower DNS TTL well in advance.
2. Verify every v3 URL resolves on new deployment — route map in [../reference/content-inventory.md](../reference/content-inventory.md) is checklist.
3. Seed and proof-read production content.
4. Switch DNS.
5. Watch logs and analytics for 404s.
6. Keep v3 deployment live and reachable until new site proven.

Rollback is repointing DNS. Why old deployment stays up.
