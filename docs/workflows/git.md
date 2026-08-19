# Git & Review Workflow

**Purpose:** branch, commit, and review cadence — and when to stop and ask.
**Read when:** branching, committing, opening a PR, or attempting any non-trivial git op.

---

## Gates

- **Plan gate per phase.** Propose the plan, get approval, then start. The plan states the branch/PR split and where the review checkpoints sit.
- **Small, obvious change:** execute directly. **Architectural:** propose first.
- **Review checkpoint is a natural checkpoint, not every commit.** Stop and ask for review at the end of a logical chunk — wherever you'd otherwise pause to ask "continue?".

## Branches and PRs

- **Base is `v4`** during phase development. Feature branch off it, PR into it. Never push to `main`.
- Descriptive names: `feat/hero-block`, `fix/footer-nav-order`.
- **PR per feature; "feature" sized by judgment, not a fixed unit count.** Default: one branch per large coherent unit, grouping small units together (especially frontend work you're confident in) rather than branching per sub-step (tokens, then primitives, then styles, …). Some phases need several branches, some one. Cut branches finer than the stated granularity and the git ceremony — ancestor check, fast-forward, push — repeats with no review benefit.

## Commits

- **Conventional commits:** `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.
- **One commit per task, not one per branch.** A branch can span many blocks or files; each distinct unit of work (one block, one bug fix, one doc correction) gets its own commit. A commit mixing "add 11 block renderers" + "fix an unrelated slug bug" + "docs update" is unreviewable and unbisectable. Split as you go; don't batch and squash at the end.
- **Verify before committing** — targeted checks per commit, full `pnpm verify` before push. See [verify-loop.md](verify-loop.md).

## Risky ops

- **Unusual git op — refspec push, force flag, history rewrite — flag it before attempting**, not after a permission denial.
- **Shared branch with possible concurrent worktrees: run `git worktree list` once up front**, not re-discovered per retry.
