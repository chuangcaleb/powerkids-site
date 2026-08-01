# Environments

**Purpose:** which services exist, what each environment point at, what every env var for.
**Read this when:** setup local, add var, debug config diff between environments.

> **Status: pipeline live.** Environments below are provisioned and in use.

**Never commit real values, never read `.env`.** File document variable _names and purposes only_. Automated contributors may update `.env.example`; only owner fill `.env` and Vercel dashboard.

---

## Environments

|          | Local            | Preview            | Production           |
| -------- | ---------------- | ------------------ | -------------------- |
| Host     | `localhost:3000` | Vercel preview URL | `powerkids.edu.my`   |
| Database | Neon dev branch  | Neon dev branch    | Neon primary         |
| Media    | R2 dev bucket    | R2 dev bucket      | R2 production bucket |
| Trigger  | `pnpm dev`       | any pull request   | merge to `main`      |

Preview deployments share dev database on purpose: previews for reviewing code, shared scratch database keep cheap. Never point preview at production data.

### Media isolation

**Local and Preview use separate R2 bucket from Production, with API token scoped to that bucket only.**

Because filenames content-addressed (see [Media serving and cache](#media-serving-and-cache)), promoting file between buckets straight copy: same bytes produce same name.

## Services

| Service       | Used for                            | Who owns access |
| ------------- | ----------------------------------- | --------------- |
| Vercel        | Hosting, builds, preview deploys    | Owner           |
| Neon          | Postgres, branch-per-environment    | Owner           |
| Cloudflare R2 | Media originals and generated sizes | Owner           |
| GitHub        | Source, CI                          | Owner           |

## Variables

Every name below appear in `.env.example` with comment. Values come from owner.

| Name                     | Purpose                                                              |
| ------------------------ | -------------------------------------------------------------------- |
| `DATABASE_URI`           | Neon connection string for this environment                          |
| `PAYLOAD_SECRET`         | Signs auth tokens. Unique per environment; rotating log everyone out |
| `NEXT_PUBLIC_SERVER_URL` | Public origin, used for absolute URLs and preview callbacks          |
| `S3_BUCKET`              | R2 bucket name                                                       |
| `S3_ACCESS_KEY_ID`       | R2 access key                                                        |
| `S3_SECRET_ACCESS_KEY`   | R2 secret                                                            |
| `S3_ENDPOINT`            | R2 S3-compatible endpoint                                            |
| `S3_REGION`              | `auto` for R2 — not bucket's location hint                           |
| `R2_PUBLIC_URL`          | Public base URL media served from                                    |
| `PREVIEW_SECRET`         | Guards draft-preview route                                           |

`S3_REGION` is `auto` for R2. Using location hint instead common, confusing failure.

### Two R2 traps

**Endpoint is not public URL.** `S3_ENDPOINT` is account-level write endpoint (no bucket path); `R2_PUBLIC_URL` is separate public read URL. Swap them: uploads appear to work, images break.

**R2 Secret Access Key is 64 lowercase hex.** Same Cloudflare page also shows ~53-char "Token value" — different credential. Using it produces `SignatureDoesNotMatch`, misleadingly reads like code bug, not wrong-credential problem.

## How variables are read

`src/lib/env.ts` only module touching `process.env` — lint rule enforces. Throws error naming variable when missing, rather than letting `undefined` flow into connection string and fail somewhere unrelated.

**Applies at build time too.** Payload config calls `requireEnv` while being constructed, Next constructs it during page-data collection, so missing variable fails build. Ordering deliberate: deploy that cannot work should fail at deploy, not at first request that happens to need variable.

Consequence: **every build needs every variable set to something**. CI sets deliberately fake values in `.github/workflows/verify.yml`; Vercel needs real ones present for **both** Preview and Production, or deployment fails at build.

**CI's build never touches a real database, even with `generateStaticParams`.** Pages that call the Payload Local API at build time (SSG) need a working `DATABASE_URI` — real on Vercel, but CI's is a placeholder. CI runs `pnpm build:compile` (`next build --experimental-build-mode compile`) instead of plain `pnpm build`: it compiles and type-checks every route without running static generation, so no DB connection is needed. Vercel's actual Preview/Production builds use plain `pnpm build` with a real `DATABASE_URI` and do the full static generation there. See [Payload: Building without a DB connection](https://payloadcms.com/docs/production/building-without-a-db-connection).

## Media serving and cache

Uploads go to R2 through S3 adapter, served from `R2_PUBLIC_URL` directly, not proxied through app. `next/image`'s allowlist derived from that variable in `next.config.ts`, so custom domain needs no separate config.

**Filenames carry content hash**, e.g. `hero-4846c1b1.webp`. `beforeOperation` hook on `media` renames every upload before Payload derives size variants from it — see `src/lib/media-filename.ts`.

Exists because media domain caches four hours (`cache-control: max-age=14400`). Without content-addressed names, replacing photo reuses filename, edge keeps serving old bytes, editor concludes CMS broken. With them, different content is different URL: replacement visible immediately, old object deleted.

Verified in Phase 1: replacing document's file produced new URL that served instantly, while previous URL returned 404 on cache-busted request.

Two consequences worth knowing:

- **Cache TTL now free to raise.** Content-addressed URLs immutable by construction, so `max-age=31536000, immutable` safe, strictly better for visitors. Not yet applied — Cloudflare-side setting on custom domain.
- **Identical content uploaded twice still stores twice.** Payload requires unique filenames per document, so second copy becomes e.g. `mary-2bb95600-1.webp`. Hash prevents stale caches, not duplicate storage.

## Dev admin account

Local Payload admin needs one permanent login both owner and agents can use. A "powerkids dev admin" entry in your password manager of choice (1Password, Bitwarden, etc.) is source of truth — pick one, no specific manager required.

- Sync locally: open your password manager yourself copy the fields, run `pnpm sync:dev-admin`, paste when prompted — writes `.agents/secrets/dev-admin.json` (gitignored, agent-readable, never named `.env*`, `chmod 600`). Deliberately manual: never shells out to a password manager's CLI, so no vault-wide session token ever exists in an agent-driven shell for an injected command to ride on.
- Seed into Payload: `pnpm seed:dev-admin` reads that file, creates the user if missing or updates name/password if it exists. Guarded `NODE_ENV !== 'production'` — cannot run against prod.
- Rotate the password in your password manager first, rerun sync script, rerun seed script.
- Never reuse this password for preview or production admin accounts.

## Known gaps

**No email adapter.** Payload logs warning at boot, writes mail to console instead of sending it. Nothing depends on email yet, but **password resets will not reach anyone** until adapter configured — so first real admin accounts must have passwords set directly rather than through reset link. Resolve before handing accounts to school staff (Phase 6), or earlier if registration form lands first (Phase 7). Both want same adapter

## Adding a variable

1. Add to `.env.example` with comment saying what for.
2. Add row to table above.
3. Add key to `EnvKey` union in `src/lib/env.ts`, read via `requireEnv`.
4. Read through typed config module, never `process.env` directly.

Tell owner set in Vercel for both preview and production — missing production variable build failure, at worst moment.
