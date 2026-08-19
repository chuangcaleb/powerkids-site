# Backlog

**Purpose:** small, deliberate deferrals — known gaps nobody is working on yet.
**Read when:** picking up loose ends between phases, or about to "fix" something that was left this way on purpose.

Not a task tracker for phase work — phases own their own scope ([phases/README.md](phases/README.md)). An item lands here only when it was found during other work, judged real, and consciously postponed.

---

## Link `appearance` is a dead admin control

`link()` ships an `appearance` select (`default` / `outline`) and the enum columns exist in the database, but `CMSLink` renders a plain anchor and never reads the value. An editor can pick an appearance and nothing changes.

Decide one way: either style the two appearances in `CMSLink`, or drop the field — dropping costs a migration to remove the `link_appearance` columns and their enums.

## `link()` factory has unused parameters

`link()` accepts `appearances`, `disableLabel`, and `extraFields`; its only caller passes `overrides` alone. Speculative generality until a second caller needs them. Trim to what is used, or keep and record which planned block needs each.

Resolve together with the `appearance` item above — same field, same decision.
