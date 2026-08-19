# Phases

**Purpose:** index of rebuild phases. Status + pointer only.
**Read when:** starting phase, or need know what phase repo in.

**Read only your own phase file.** Each self-contained — repeats context it need. Reading all of them wastes context and mixes concerns.

**Never read an archived phase for current state.** Completed phases move to `archive/`; they're frozen records and several already contradict shipped code. Open one only to recover why a past decision was made.

---

## Status

| #   | Phase                                        | State        | File                                                                 |
| --- | -------------------------------------------- | ------------ | -------------------------------------------------------------------- |
| 0   | Archive + docs skeleton                      | done         | —                                                                    |
| 1   | Foundation — app, DB, storage, CI            | archived     | [archive/phase-1-foundation.md](archive/phase-1-foundation.md)       |
| 2   | Design system — tokens, primitives           | archived     | [archive/phase-2-design-system.md](archive/phase-2-design-system.md) |
| 3   | Content model — collections, globals, blocks | archived     | [archive/phase-3-content-model.md](archive/phase-3-content-model.md) |
| 4   | Rendering — layouts, block renderers         | done         | [archive/phase-4-rendering.md](archive/phase-4-rendering.md)         |
| 5   | Content migration — seed script              | next         | [phase-5-content-migration.md](phase-5-content-migration.md)         |
| 6   | Launch — SEO, a11y, cutover                  | blocked on 5 | [phase-6-launch.md](phase-6-launch.md)                               |
| 7   | Forms — registration, careers                | deferred     | [phase-7-forms.md](phase-7-forms.md)                                 |
| 8   | Localisation — activate `ms`                 | deferred     | [phase-8-localisation.md](phase-8-localisation.md)                   |
| 9   | Media hygiene — unreferenced-media cleanup   | deferred     | [phase-9-media-hygiene.md](phase-9-media-hygiene.md)                 |

**Phase 4 done.** Phase 5 next.

---

## How phase works

1. Agent proposes plan for phase, stating branch/PR-unit split and where review checkpoints will land. Owner approves. **Gate.**
2. Work lands as PRs. Default one branch per large coherent unit; group small units together rather than branching per sub-step. Review happens at natural checkpoints (end of a logical chunk), not after every commit. Owner merges. Never push `main`.
3. Phase done only when its **Post** checklist all true — including docs.

Each phase file has same shape:

- **Goal** — one sentence.
- **Pre** — must be true before starting. Some need owner, not agent.
- **Work** — what gets built.
- **Post** — definition of done. Checklist.
- **Verify** — commands + manual checks proving Post.
- **Traps** — known landmines for this phase, found earlier. Read them; each cost real time already.

## Conventions

Agent docs written caveman-compressed: drop articles, filler, hedging. Keep all technical substance, exact names, commands, error strings. Code, commit messages, PR bodies, and anything for school staff (`docs/workflows/content-editing.md`) stay normal prose.
