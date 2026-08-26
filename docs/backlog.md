# Backlog

**Purpose:** small, deliberate deferrals — known gaps nobody is working on yet.
**Read when:** picking up loose ends between phases, or about to "fix" something that was left this way on purpose.

Not a general task tracker — see [future/README.md](future/README.md) for larger deferred work. An item lands here only when it was found during other work, judged real, and consciously postponed.

---

## Link `appearance` is a dead admin control

`linkField()` ships an `appearance` select (`default` / `outline`) and the enum columns exist in the database, but `CMSLink` renders a plain anchor and never reads the value. An editor can pick an appearance and nothing changes.

Decide one way: either style the two appearances in `CMSLink`, or drop the field — dropping costs a migration to remove the `link_appearance` columns and their enums. The field is kept for now purely because the column exists; the factory no longer lets a call site vary it.
