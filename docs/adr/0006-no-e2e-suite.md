# 0006. No end-to-end test suite

**Status:** accepted
**Date:** 2026-08-22

## Context

`pnpm test` runs `vitest` over unit tests only. No Playwright, no axe-core, no browser-driven specs exist. The site is a single small marketing surface plus the Payload admin panel, both changing frequently during rebuild; a browser suite would need constant upkeep against layout and content-model churn that hasn't settled yet.

## Decision

Ship without an end-to-end suite for now. Coverage is unit tests (hooks, access control, pure logic) plus manual verification in the browser preview before each change lands.

## Consequences

**Makes easy.** No browser-suite maintenance tax while blocks, fields, and layout are still shifting weekly. `pnpm verify` stays fast.

**Costs.** Regressions in cross-page flows (draft preview, admin duplicate-review UI, navigation) are only caught by hand-testing or in production. Nothing currently guards against them automatically.

## Alternatives considered

- **Playwright from day one** — rejected: the content model and block catalogue are still being redesigned per-phase; specs would need rewriting as often as the code they test.
