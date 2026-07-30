# Environments

**Purpose:** which services exist, what each environment points at, and what every environment variable is for.
**Read this when:** setting up locally, adding a variable, or debugging a config difference between environments.

> **Status: not yet provisioned.** Phase 1 creates these resources.

**Never commit real values, and never read `.env`.** This file documents variable *names and purposes only*. Automated contributors may update `.env.example`; only the owner fills in `.env` and the Vercel dashboard.

---

## Environments

| | Local | Preview | Production |
| --- | --- | --- | --- |
| Host | `localhost:3000` | Vercel preview URL | `powerkids.edu.my` |
| Database | Neon dev branch | Neon dev branch | Neon primary |
| Media | R2 dev bucket | R2 dev bucket | R2 production bucket |
| Trigger | `pnpm dev` | any pull request | merge to `main` |

Preview deployments share the dev database on purpose: previews are for reviewing code, and a shared scratch database keeps them cheap. Never point a preview at production data.

## Services

| Service | Used for | Who owns access |
| --- | --- | --- |
| Vercel | Hosting, builds, preview deploys | Owner |
| Neon | Postgres, branch-per-environment | Owner |
| Cloudflare R2 | Media originals and generated sizes | Owner |
| GitHub | Source, CI | Owner |

## Variables

Every name below appears in `.env.example` with a comment. Values come from the owner.

| Name | Purpose |
| --- | --- |
| `DATABASE_URI` | Neon connection string for this environment |
| `PAYLOAD_SECRET` | Signs auth tokens. Unique per environment; rotating it logs everyone out |
| `NEXT_PUBLIC_SERVER_URL` | Public origin, used for absolute URLs and preview callbacks |
| `S3_BUCKET` | R2 bucket name |
| `S3_ACCESS_KEY_ID` | R2 access key |
| `S3_SECRET_ACCESS_KEY` | R2 secret |
| `S3_ENDPOINT` | R2 S3-compatible endpoint |
| `S3_REGION` | `auto` for R2 — not the bucket's location hint |
| `R2_PUBLIC_URL` | Public base URL media is served from |
| `PREVIEW_SECRET` | Guards the draft-preview route |

`S3_REGION` is `auto` for R2. Using the location hint instead is a common and confusing failure.

## Adding a variable

1. Add it to `.env.example` with a comment saying what it is for.
2. Add a row to the table above.
3. Read it through the typed config module, never `process.env` directly.
4. Tell the owner to set it in Vercel for both preview and production — a missing production variable is a build failure, at the worst moment.
