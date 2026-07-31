# Phase 1 — Foundation

**Status: built and verified, NOT fully merged to `v4`.** Read "Unmerged work" first.

**Goal:** running app — Next + Payload on Neon + R2, green verify loop, CI, deploy.

---

## Unmerged work — resolve before Phase 2

Stacked PRs #4–#7 merged into each other's branches, not into `v4`. Only #4 (tooling) reached `v4`. Everything Payload sits elsewhere.

| Ref                              | Holds                                                       |
| -------------------------------- | ----------------------------------------------------------- |
| `v4`                             | tooling only, plus owner's caveman doc compression          |
| `origin/feat/payload-core`       | Payload config, users, media, migration                     |
| `origin/chore/deploy-and-docs`   | above + deploy/env docs                                     |
| `origin/rescue/phase-1-complete` | **everything**, incl. media filename hash + migration fixer |

`rescue/phase-1-complete` = merge commit of PR #7. Was reachable from no remote branch; pushed to preserve it. Deepest and most complete ref.

**Conflict warning:** owner compressed `docs/` to caveman style on `v4` _after_ branching. Same doc files edited on both sides. Expect conflicts in `docs/ops/environments.md`, `docs/ops/migrations.md`, `docs/architecture/*`. Take `v4`'s caveman prose, re-apply the _content_ from the branch (R2 traps, cache behaviour, migration import patch, media isolation).

Owner also added to `v4` independently: `sync:dev-admin` script + Bitwarden `powerkids-dev-admin` flow. Keep it.

Suggested resolution: branch off `v4`, merge `rescue/phase-1-complete`, resolve doc conflicts by hand, verify, PR. Do **not** force-push `v4`.

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

- [ ] Land unmerged work on `v4` (above)
- [ ] Open preview `/admin` in browser while signed into Vercel, confirm Payload panel renders. Preview sits behind Vercel Authentication — `curl` returns Vercel's login page, not ours. Only remaining Phase 1 check.
- [ ] Optional: raise media cache to `max-age=31536000, immutable` — safe now filenames content-addressed. Cloudflare-side setting.
- [ ] Optional: `bws` secret wiring (owner deferred)

## Traps found here

- **Payload migration generator emits broken import.** Value import of type-only `MigrateUpArgs`/`MigrateDownArgs` — dies at runtime under ESM. `pnpm migrate:create` auto-patches via `scripts/fix-migration-imports.mjs`; `verbatimModuleSyntax` makes `pnpm typecheck` catch it too. Still true in 3.86.0.
- **`formatOptions` not inherited by `imageSizes`.** Must repeat per size or PNG stays PNG — 4.7 MB variant became 101 KB once fixed.
- **R2 `S3_ENDPOINT` is account-level, no bucket path.** `R2_PUBLIC_URL` is separate public URL. Swapping them = uploads succeed, images 401.
- **R2 Secret Access Key = 64 lowercase hex.** The 53-char "Token value" on same Cloudflare page is a different credential; using it gives `SignatureDoesNotMatch`, which reads like a code bug.
- **`s3Storage` collection key must be literal `media`.** Computed key `[Media.slug]` types as `string`, kills contextual typing.
- **Build needs every env var.** Payload config constructed during page-data collection. CI sets fake values; Vercel needs real ones for Preview and Production.
- **Stacked PRs merged bottom-up still lost work.** See above. Next time: merge one, confirm it landed on `v4`, then retarget the next by hand.
