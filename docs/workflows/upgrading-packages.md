# Upgrading Packages

**Purpose:** repo-specific rules on top of standard pnpm/Payload upgrade mechanics.
**Read when:** asked to upgrade/bump packages, or `pnpm outdated` comes up.

For the commands themselves, use official docs, not this file:

- pnpm: [`pnpm outdated`](https://pnpm.io/cli/outdated), [`pnpm update`](https://pnpm.io/cli/update)
- Payload: [Upgrade guides](https://payloadcms.com/docs/upgrade/overview) — read the guide for any major version crossed

---

## Repo-specific rules

1. **`@payloadcms/*` + `payload` bump together, same version.** Payload ships as matched packages; mixing versions across them is unsupported.
2. **Major bumps (`typescript`, `eslint`, `graphql`, `lexical`, `@types/node`, etc.) are a separate, deliberate pass** — not part of a routine bump. Flag them to the owner instead of pulling them in silently.
3. **After bumping Payload, re-check version-pinned workarounds.** Some code exists only because a Payload version lacked a feature, and says so in a comment naming the version checked. Grep for it (`grep -rn "Payload has no native" src/`), re-verify against the new version's `.d.ts` (`node_modules/payload/dist/**/*.d.ts`), update the cited version either way, delete the workaround if Payload now covers it natively.
4. **A version bump alone never needs a migration.** Only a schema change does — see [../ops/migrations.md](../ops/migrations.md).
5. **Run [verify-loop.md](verify-loop.md) after every bump.** Skip `build` only if sandboxed without network (Google Fonts fetch fails offline — unrelated to the bump, not a real failure).
