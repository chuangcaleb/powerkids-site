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

### Media isolation

**Local and Preview use a separate R2 bucket from Production, with an API token scoped to that bucket only.**

The reason is narrow and specific: **R2 has no object versioning**. A deleted object is gone. The media in the production bucket is a kindergarten's photographs of graduations, sports days, and field trips — in many cases the only remaining copy. A preview deployment is a branch that may never merge, running code nobody has reviewed yet, and it must not be able to reach those files.

Prefix separation inside one bucket (`dev/`, `prod/`) was considered and rejected. It costs the same and isolates nothing: the same credentials reach both prefixes, so the protection is a config string rather than an access boundary. Separate buckets plus separately scoped tokens means a misconfigured preview fails with a permissions error instead of deleting a photograph.

Neither bucket costs anything at this scale — R2's free tier is far beyond what this site needs, and the dev bucket can serve from its plain `r2.dev` URL with no custom domain.

Because filenames are content-addressed (see [Media serving and cache](#media-serving-and-cache)), promoting a file between buckets is a straight copy: the same bytes produce the same name.

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

**Filenames carry a content hash**, e.g. `hero-4846c1b1.webp`. A `beforeOperation` hook on `media` renames every upload before Payload derives the size variants from it — see `src/lib/media-filename.ts`.

This exists because the media domain caches for four hours (`cache-control: max-age=14400`). Without content-addressed names, replacing a photo reuses the filename, the edge keeps serving the old bytes, and the editor concludes the CMS is broken. With them, different content is a different URL: a replacement is visible immediately and the old object is deleted.

Verified in Phase 1: replacing a document's file produced a new URL that served instantly, while the previous URL returned 404 on a cache-busted request.

Two consequences worth knowing:

- **The cache TTL is now free to raise.** Content-addressed URLs are immutable by construction, so `max-age=31536000, immutable` is safe and strictly better for visitors. Not yet applied — it is a Cloudflare-side setting on the custom domain.
- **Identical content uploaded twice still stores twice.** Payload requires unique filenames per document, so the second copy becomes `mary-2bb95600-1.webp`. The hash prevents stale caches, not duplicate storage.

## Known gaps

**No email adapter.** Payload logs a warning at boot and writes mail to the console instead of sending it. Nothing depends on email yet, but **password resets will not reach anyone** until an adapter is configured — so the first real admin accounts must have their passwords set directly rather than through a reset link. Resolve before handing accounts to school staff (Phase 6), or earlier if the registration form lands first (Phase 7). Both want the same adapter.

## Adding a variable

1. Add it to `.env.example` with a comment saying what it is for.
2. Add a row to the table above.
3. Add the key to the `EnvKey` union in `src/lib/env.ts` and read it through `requireEnv`.
4. Tell the owner to set it in Vercel for both preview and production — a missing production variable is a build failure, at the worst moment.
