# Agents

`powerkids.edu.my` — website for PowerKids Kindergarten. `v4` from-scratch rebuild on Next.js + Payload CMS.

**pnpm only** (Node ≥22). Scripts: `pnpm dev`, `lint`, `typecheck`, `test`, `build`, `verify`. No per-tool scripts — `pnpm eslint`/`stylelint` don't exist; use `pnpm exec` for targeted runs.

**Current phase:** `docs/phases/README.md` owns it — the only place phase status is recorded. Starting a phase? Read that index, then **only your own phase file**.

---

## Non-negotiables

1. **Content is data, never markup.** Navigation, social links, contact details, opening hours, school addresses, programs, events — CMS records.
2. **Code declares what exists; docs say why and which.** Never write a doc that restates code: no counters, no field lists, no block/component inventories, no directory maps. Rules, rationale, and pick-guides for closed hand-authored sets (layout primitives, token groups) belong in docs; their values do not. Code is single source of truth.
3. **Never read `.env`.** Secrets are the owner's business. Maintain `.env.example` with key names + comments only.

Domain vocabulary lives in [`CONTEXT.md`](CONTEXT.md) — read it, use those words exactly.

---

## Where things are

Each `docs/<topic>/` folder has its own `README.md` indexing what's inside and when to read it — browse there for the topic you need, rather than a flat list here. Non-negotiables below still fire on every task; a few docs fire on every task too and are called out for that reason:

- [docs/coding-standards.md](docs/coding-standards.md) — writing or reviewing any code in `src/`.
- [docs/workflows/verify-loop.md](docs/workflows/verify-loop.md) — before every commit and every push.
- [docs/ops/migrations.md](docs/ops/migrations.md) — schema changed, always, no exceptions.
- [docs/phases/README.md](docs/phases/README.md) — the only place phase status is recorded; read before starting any phase work.
- [docs/adr/](docs/adr/) — about to redo or reverse a past architectural decision.

---

## Keeping this file small

This file is a router, read on every task. It carries only: what the project is, how to run it, rules that bind every task, and where to go next. Anything narrower goes in a linked doc.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
