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
- **`pnpm migrate:create`'s enum create-vs-rename prompt can't run non-interactively** (raw-mode TUI, no TTY in an agent shell). Introspect the live schema instead (`payload.db.drizzle.execute(...)` via a throwaway `pnpm payload run` script) and hand-write the migration — see `20260811_230000_drop_programs_events_authored_blocks.ts` for the pattern.
- **`pnpm payload run scripts/seed-admin.ts` gets you admin login credentials on dev** — no other way to see them.
- **`mask-image` + `background-image` on the same element silently fails to composite in Chromium.** Confirmed: an identical mask over a plain `background-color` renders fine; swap in any `background-image`, repeating or not, and the mask stops applying. `.dot-grid-edge-fade` (`src/styles/utilities/dot-grid.css`) works around it by painting the fade as a second gradient layer in the same `background-image` list rather than a real mask.
