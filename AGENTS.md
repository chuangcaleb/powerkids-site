# Agents

Website for PowerKids Kindergarten. `v4` rebuild on Next.js + Payload CMS.

---

## Non-negotiables

1. **Content is data, never markup.** Navigation, social links, contact details, opening hours, school addresses, programs, events — CMS records.
2. **Code declares what exists; docs say why and which.** Never write a doc that restates code: no counters, no field lists, no block/component inventories, no directory maps. Rules, rationale, and pick-guides for closed hand-authored sets (layout primitives, token groups) belong in docs; their values do not. Code is single source of truth.
3. **Never read `.env`.** Maintain `.env.example` with key names + comments only.

Domain vocabulary in [`CONTEXT.md`](CONTEXT.md) — use those words exactly.

---

## Where things are

Each `docs/<topic>/` folder has its own `README.md` index. Some common docs:

- [docs/coding-standards.md](docs/coding-standards.md) — writing or reviewing any code in `src/`.
- [docs/workflows/verify-loop.md](docs/workflows/verify-loop.md) — before every commit and every push.
- [docs/ops/migrations.md](docs/ops/migrations.md) — when schema changes
- [docs/adr/](docs/adr/) — about to redo or reverse a past architectural decision.

---

## Keeping this file small

This file is a router, read on every task. It carries only: what the project is, how to run it, rules that bind every task, and where to go next. Anything narrower goes in a linked doc.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
