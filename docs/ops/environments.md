# Environments

**Purpose:** which services exist, what each environment point at, what every env var for.
**Read this when:** setup local, add var, debug config diff between environments.

> **Status: not yet provisioned.** Phase 1 create these resources.

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

## Adding a variable

1. Add to `.env.example` with comment saying what for.
2. Add row to table above.
3. Read through typed config module, never `process.env` directly.
4. Tell owner set in Vercel for both preview and production — missing production variable build failure, at worst moment.
