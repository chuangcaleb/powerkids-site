# Git & Review Workflow

**Purpose:** branch, commit, and review cadence — and when to stop and ask.
**Read when:** branching, committing, opening a PR, or attempting any non-trivial git op.

---

## Gates

- **Plan gate for non-trivial work.** Propose the plan, get approval, then start. The plan states the branch split and where the review checkpoints sit.
- **Small, obvious change:** execute directly. **Architectural:** propose first.
- **Review checkpoint is a natural checkpoint, not every commit.** Stop and ask for review at the end of a logical chunk — wherever you'd otherwise pause to ask "continue?".

## Branches, previews, and merging

- **Base is `main`.** Feature branch off it. Never push to `main` directly.
- Descriptive names: `feat/hero-block`, `fix/footer-nav-order`. No tool-name prefix.
- **One branch per group of related commits that needs its own preview deployment.** A branch gets a Vercel preview URL on its PR — that's the unit a reviewer looks at. Group small, related units onto one branch (especially frontend work you're confident in) rather than branching per sub-step (tokens, then primitives, then styles, …); split onto a new branch when the work is large enough, or different enough, to want its own preview and its own review pass. Cutting branches finer than that repeats the git ceremony — ancestor check, fast-forward, push — for no review benefit.
- **Merge to `main` at the end of the session** once the branch's work is reviewed and green. Small, low-risk refactors may fast-forward-merge locally without a PR if the owner says so for that change; anything else goes through a PR with a preview deploy.

## Commits

- **Conventional commits:** `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.
- **One commit per task, not one per branch.** A branch can span many blocks or files; each distinct unit of work (one block, one bug fix, one doc correction) gets its own commit. A commit mixing "add 11 block renderers" + "fix an unrelated slug bug" + "docs update" is unreviewable and unbisectable. Split as you go; don't batch and squash at the end.
- **Verify before committing** — targeted checks per commit, full `pnpm verify` before push. See [verify-loop.md](verify-loop.md).

## Risky ops

- **Unusual git op — refspec push, force flag, history rewrite — flag it before attempting**, not after a permission denial.
- **Shared branch with possible concurrent worktrees: run `git worktree list` once up front**, not re-discovered per retry.
