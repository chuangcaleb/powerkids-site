# Verify Loop

**Purpose:** exact checks pass before commit.
**Read when:** before every commit and every push.

**The gate:** per commit, targeted checks on the touched files. Before push, the full loop.

---

## The loop

```bash
pnpm verify
```

Runs, in order:

| Step | Command          | Catches                                             |
| ---- | ---------------- | --------------------------------------------------- |
| 1    | `pnpm lint`      | Style, correctness rules. `pnpm format` auto-fixes. |
| 2    | `pnpm typecheck` | Type errors, incl. stale generated Payload types.   |
| 3    | `pnpm test`      | Unit tests.                                         |
| 4    | `pnpm build`     | Build-time failures other three miss.               |

Stop at first failure, fix it. Don't commit around red step. Don't disable rule to pass — rule wrong? Change deliberately, own commit, with reason.

**Mid-edit, don't run full `pnpm verify`.** Scope the check to what changed — run `eslint`/`stylelint`/`tsc` against the touched files directly (`pnpm exec eslint <file>`); there are no per-tool package scripts. Full loop is for pre-push checkpoints (lefthook already runs it there) and CI — running it after every small edit repeats the other three steps for no new signal.

## Also required

- **Schema changes** need `pnpm generate:types` + migration. See [../ops/migrations.md](../ops/migrations.md). Adding admin component also needs `pnpm generate:importmap`.
- **New pure functions** in `src/lib/` need unit test, same change.
- **Visual changes** need look at rendered result at 320px, 768px, 1440px. Green checks don't prove layout right.
- **Markup/landmark/heading changes** need `pnpm test:a11y` against a running `pnpm dev` (real dev DB, not CI's fake env — see `scripts/check-a11y.mjs`). Not part of `pnpm verify`; run it by hand.
- **New or changed blocks** need [../architecture/blocks.md](../architecture/blocks.md) updated only when the change breaks a rule stated there or adds rationale the config can't express. Don't add the block to a list — that doc holds no list.

## CI

Same loop runs every pull request. Red pipeline blocks merge.
