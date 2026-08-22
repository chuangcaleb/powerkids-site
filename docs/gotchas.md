# Gotchas

**Purpose:** repo-specific facts that defy the reasonable assumption. Each has already cost time.
**Read when:** touching build, migrations, generated files, env, or tests.

---

- **Home page slug is `index`, not `home`.** Revalidation, preview redirects, and sitemap logic all branch on it.
- **`push: false` unconditionally** in the Postgres adapter. Never gate it on `NODE_ENV` — a dev push against a shared database already destroyed data once. Schema changes go through migrations, always.
- **No end-to-end suite exists.** No Playwright, no axe-core, no specs. `pnpm test` is `vitest` over unit tests only. Don't write steps that reference a browser suite.
- **No per-tool package scripts.** `pnpm lint`/`typecheck`/`test`/`build`/`verify` exist; `pnpm eslint`/`stylelint` do not. Use `pnpm exec` for targeted runs.
- **Only `src/lib/env.ts` reads `process.env`.** Everything else imports from it.
- **`src/app/(payload)/` is a generated integration shape**, excluded from lint and formatting. Regenerate, never hand-edit. Same for `src/payload-types.ts`.
- **Adding an admin component needs `pnpm generate:importmap`**, not just `generate:types`.
- **`pnpm migrate:create` patches migration imports automatically.** Calling the Payload CLI directly means running `scripts/fix-migration-imports.mjs` yourself.
- **`pnpm migrate:create`'s enum/column create-vs-rename prompt needs a raw-mode TTY**, which a plain piped shell doesn't have. Two ways through: drive it with `expect` (`spawn pnpm migrate:create <name>`, `expect "create column" { send "\r"; exp_continue }`) so the tool runs normally end to end — preferred, since it keeps the generated migration paired with its schema snapshot; or introspect the live schema instead (`payload.db.drizzle.execute(...)` via a throwaway `pnpm payload run` script) and hand-write the migration — see `20260811_230000_drop_programs_events_authored_blocks.ts` for the pattern.
- **A hand-written migration has no schema snapshot**, since it skips `migrate:create` entirely. `migrate:create`'s next run then diffs against whatever snapshot predates it — stale — and regenerates bogus statements for columns the hand-written migration already touched. Fix by temporarily reverting the collection config to the state the hand-written migration actually shipped, running `migrate:create` again to produce the missing snapshot `.json`, renaming it to match the hand-written migration's filename, discarding the throwaway `.ts` it also generated, then restoring the real config and re-running `migrate:create` for the real change.
- **`pnpm payload run scripts/seed-admin.ts` gets you admin login credentials on dev** — no other way to see them.
- **`mask-image` + `background-image` on the same element silently fails to composite in Chromium.** Confirmed: an identical mask over a plain `background-color` renders fine; swap in any `background-image`, repeating or not, and the mask stops applying. `.dot-grid-edge-fade` (`src/styles/utilities/dot-grid.css`) works around it by painting the fade as a second gradient layer in the same `background-image` list rather than a real mask.
