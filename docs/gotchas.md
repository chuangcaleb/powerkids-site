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
