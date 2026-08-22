# Worktrees

A new worktree lacks gitignored files. Copy from the main repo root proactively — don't wait for a missing-file error.

- `.env` — via `cp`, never `Read` (contents must not enter transcript/context).
- `.agents/` — includes `.agents/secrets/dev-admin.json` (dev admin credentials, for direct operations against the dev DB/admin panel).
- `CLAUDE.md` — gitignored per-worktree; copy it too if it exists.

Branch/worktree names: use conventional-commit style (`feat/...`, `fix/...`), never a tool-name prefix.
