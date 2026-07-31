# Phase 1 — Foundation

**Status: done.**

**Goal:** running app — Next + Payload on Neon + R2, green verify loop, CI, deploy.

---

## History (resolved)

Stacked PRs #4–#7 landed on branches, not `v4` — rescued via `fix/recover-phase-1` → PR #10, now on `v4`. Doc conflicts resolved by hand (kept `v4` caveman prose, re-applied branch content). `sync:dev-admin` script + `powerkids dev admin` flow also on `v4`.

---

## Built and verified against real services

- Next `16.2.12`, Payload `3.86.0`, React `19.2.8`, `sharp` `0.34.5`, TS strict, pnpm
- Neon Postgres adapter; first migration applied
- R2 via `@payloadcms/storage-s3`; dev bucket `powerkids-payloadcms-dev`, prod `powerkids-payloadcms`
- `users` (roles `admin`/`editor`, self-promotion blocked), `media` (`alt` NOT NULL, WebP, 3 sizes, content-hash filenames)
- `src/lib/env.ts` — only module reading `process.env`, lint-enforced
- ESLint convention rules, Prettier, Vitest, Lefthook, GitHub Actions verify

Verified: migration applies; `/admin` renders; first-user register + login; unauthenticated API read refused; upload without `alt` rejected; upload with `alt` reaches R2 and serves; delete removes object; dev bucket isolated from prod.

## Outstanding

None. Preview `/admin` verified in browser, signed into Vercel — Payload panel renders.

Deferred to later phases: R2 cache header tuning (`docs/phases/phase-6-launch.md`). `bws` secret wiring dropped — not in use.

Phase 1 complete.

## Traps found here

- **Payload migration generator emits broken import.** Value import of type-only `MigrateUpArgs`/`MigrateDownArgs` — dies at runtime under ESM. `pnpm migrate:create` auto-patches via `scripts/fix-migration-imports.mjs`; `verbatimModuleSyntax` makes `pnpm typecheck` catch it too. Still true in 3.86.0.
- **`formatOptions` not inherited by `imageSizes`.** Must repeat per size or PNG stays PNG — 4.7 MB variant became 101 KB once fixed.
- **R2 `S3_ENDPOINT` is account-level, no bucket path.** `R2_PUBLIC_URL` is separate public URL. Swapping them = uploads succeed, images 401.
- **R2 Secret Access Key = 64 lowercase hex.** The 53-char "Token value" on same Cloudflare page is a different credential; using it gives `SignatureDoesNotMatch`, which reads like a code bug.
- **`s3Storage` collection key must be literal `media`.** Computed key `[Media.slug]` types as `string`, kills contextual typing.
- **Build needs every env var.** Payload config constructed during page-data collection. CI sets fake values; Vercel needs real ones for Preview and Production.
- **Stacked PRs merged bottom-up still lost work.** Merge one, confirm it landed on `v4`, then retarget the next by hand.
