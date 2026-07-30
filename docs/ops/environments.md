# Environments

**Purpose:** which services exist, what each environment points at, and what every environment variable is for.
**Read this when:** setting up locally, adding a variable, or debugging a config difference between environments.

**Never commit real values, and never read `.env`.** This file documents variable _names and purposes only_. Automated contributors may update `.env.example`; only the owner fills in `.env` and the Vercel dashboard.

---

## Environments

|          | Local            | Preview            | Production           |
| -------- | ---------------- | ------------------ | -------------------- |
| Host     | `localhost:3000` | Vercel preview URL | `powerkids.edu.my`   |
| Database | Neon dev branch  | Neon dev branch    | Neon primary         |
| Media    | R2 dev bucket    | R2 dev bucket      | R2 production bucket |
| Trigger  | `pnpm dev`       | any pull request   | merge to `main`      |

Preview deployments share the dev database on purpose: previews are for reviewing code, and a shared scratch database keeps them cheap. Never point a preview at production data.

## Services

| Service       | Used for                            | Who owns access |
| ------------- | ----------------------------------- | --------------- |
| Vercel        | Hosting, builds, preview deploys    | Owner           |
| Neon          | Postgres, branch-per-environment    | Owner           |
| Cloudflare R2 | Media originals and generated sizes | Owner           |
| GitHub        | Source, CI                          | Owner           |

## Variables

Every name below appears in `.env.example` with a comment. Values come from the owner.

| Name                     | Purpose                                                                         |
| ------------------------ | ------------------------------------------------------------------------------- |
| `DATABASE_URI`           | Neon connection string for this environment. Use the pooled string.             |
| `PAYLOAD_SECRET`         | Signs auth tokens. Unique per environment; rotating it logs everyone out.       |
| `NEXT_PUBLIC_SERVER_URL` | Public origin, used for absolute URLs and preview callbacks. No trailing slash. |
| `S3_BUCKET`              | R2 bucket name                                                                  |
| `S3_ACCESS_KEY_ID`       | R2 API token key, with Object Read & Write                                      |
| `S3_SECRET_ACCESS_KEY`   | R2 API token secret                                                             |
| `S3_ENDPOINT`            | Account-level endpoint: `https://<account-id>.r2.cloudflarestorage.com`         |
| `R2_PUBLIC_URL`          | Public base URL media is served from — the `r2.dev` URL or a custom domain      |

### Two R2 traps

**The endpoint is not the public URL.** `S3_ENDPOINT` is the account-level API endpoint used to _write_ objects; `R2_PUBLIC_URL` is where visitors _read_ them. Swapping them produces uploads that appear to succeed but render as broken images.

**There is no `S3_REGION` variable, deliberately.** R2's region is always the literal string `auto`. Setting the bucket's location hint instead produces signature errors that read like a credentials problem, so the value is hard-coded in `src/lib/env.ts` where nobody can set it wrongly.

## How variables are read

`src/lib/env.ts` is the only module that touches `process.env` — a lint rule enforces this. It throws an error naming the variable when one is missing, rather than letting `undefined` flow into a connection string and fail somewhere unrelated.

**This applies at build time too.** The Payload config calls `requireEnv` while being constructed, and Next constructs it during page-data collection, so a missing variable fails the build. That ordering is deliberate: a deploy that cannot work should fail at deploy, not at the first request that happens to need the variable.

The consequence is that **every build needs every variable set to something**. CI sets deliberately fake values in `.github/workflows/verify.yml`; Vercel needs the real ones present for **both** Preview and Production, or the deployment fails at build.

## Media serving and cache

Uploads go to R2 through the S3 adapter and are served from `R2_PUBLIC_URL` directly, not proxied through the app. `next/image`'s allowlist is derived from that variable in `next.config.ts`, so a custom domain needs no separate config.

**Cached for four hours.** The custom domain returns `cache-control: max-age=14400`. Deleting or replacing a file in the CMS takes effect in the database immediately, but the old image keeps being served from Cloudflare's edge until the TTL expires — verified during Phase 1 setup, where a deleted object still returned 200 from cache while a cache-busted request correctly returned 404.

This will confuse editors: they replace a photo, reload, and see the old one. Two mitigations, to decide before launch:

- Uploading a _new_ file rather than replacing an existing one produces a new filename, so it appears instantly. This is the behaviour to teach in `docs/workflows/content-editing.md`.
- A purge-on-publish hook could clear the cache for changed files. Costs an API call and a Cloudflare token; worth it only if replacing files turns out to be common.

## Known gaps

**No email adapter.** Payload logs a warning at boot and writes mail to the console instead of sending it. Nothing depends on email yet, but **password resets will not reach anyone** until an adapter is configured — so the first real admin accounts must have their passwords set directly rather than through a reset link. Resolve before handing accounts to school staff (Phase 6), or earlier if the registration form lands first (Phase 7). Both want the same adapter.

## Adding a variable

1. Add it to `.env.example` with a comment saying what it is for.
2. Add a row to the table above.
3. Add the key to the `EnvKey` union in `src/lib/env.ts` and read it through `requireEnv`.
4. Tell the owner to set it in Vercel for both preview and production — a missing production variable is a build failure, at the worst moment.
