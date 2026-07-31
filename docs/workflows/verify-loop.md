# Verify Loop

**Purpose:** exact checks pass before commit.
**Read when:** before every commit. No exceptions.

> **Status: not yet implemented.** Phase 1 wires scripts, pre-commit hook, CI.

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

## Also required

- **Schema changes** need `pnpm generate:types` + migration. See [../ops/migrations.md](../ops/migrations.md). Adding admin component also needs `pnpm generate:importmap`.
- **New pure functions** in `src/lib/` need unit test, same change.
- **Visual changes** need look at rendered result at 320px, 768px, 1440px. Green checks don't prove layout right.
- **New or changed blocks** need [../architecture/blocks.md](../architecture/blocks.md) updated, same commit.

## CI

Same loop runs every pull request. Red pipeline blocks merge.
