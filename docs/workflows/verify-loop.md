# Verify Loop

**Purpose:** the exact checks that must pass before any commit.
**Read this when:** before every commit. No exceptions.

---

## The loop

```bash
pnpm verify
```

Which runs, in order:

| Step | Command          | Catches                                                     |
| ---- | ---------------- | ----------------------------------------------------------- |
| 1    | `pnpm lint`      | Style and correctness rules. `pnpm format` auto-fixes.      |
| 2    | `pnpm typecheck` | Type errors, including generated Payload types being stale. |
| 3    | `pnpm test`      | Unit tests.                                                 |
| 4    | `pnpm build`     | Build-time failures the other three miss.                   |

Stop at the first failure and fix it. Do not commit around a red step, and do not disable a rule to make one pass — if a rule is wrong, change it deliberately in its own commit with a reason.

## Also required

- **Schema changes** need `pnpm generate:types` and a migration. See [../ops/migrations.md](../ops/migrations.md). Adding an admin component also needs `pnpm generate:importmap`.
- **New pure functions** in `src/lib/` need a unit test in the same change.
- **Visual changes** need a look at the rendered result at 320px, 768px, and 1440px. Green checks do not prove a layout is right.
- **New or changed blocks** need [../architecture/blocks.md](../architecture/blocks.md) updated in the same commit.

## CI

The same loop runs on every pull request. A red pipeline blocks merge.
