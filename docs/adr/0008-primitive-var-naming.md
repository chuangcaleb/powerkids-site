# 0008. Layout primitive var naming convention

**Status:** accepted
**Date:** 2026-08-25

## Context

[0007](0007-primitive-override-convention.md) fixed how primitive vars get overridden but explicitly deferred renaming the vars themselves. The custom property names across `src/styles/compositions/*.css` had drifted into five inconsistent shapes for the same underlying concept (an alignment knob) plus one unrelated naming gap:

- `cluster`: `--cluster-align-x` / `--cluster-align-y` — axis-relative (`x`/`y` map to `justify-content`/`align-items`)
- `switcher`: `--switcher-vertical-alignment` — visual-relative, and necessarily so: `switcher` flips `flex-direction` between row and column, so an axis-relative name would silently swap meaning across that flip
- `repel`: `--repel-y-alignment` — visual-relative name on a primitive whose direction can also flip via `--repel-direction`, but ships row by default
- `sidebar`: `--sidebar-align` — unqualified, single axis, no ambiguity either way
- `grid-auto`: `--grid-align-items` — named after the literal CSS property it fills, not a naming choice at all
- `wrapper`: `--gutter` — unprefixed, unlike every other wrapper var (`--wrapper-max-width`), flagged as a known irregularity in `primitive-vars.ts`

A contributor (human or agent) picking a name for a new primitive's alignment knob had no rule to follow — five existing primitives, five different shapes.

## Decision

**Visual-relative naming (`-vertical-align` / `-horizontal-align`) by default**, because a caller reasons about which side content moves toward, not which flexbox axis property implements it — and because `switcher` proves axis-relative names actively break under a direction flip.

**Exception: fixed single-orientation primitives may keep short axis-relative or unqualified names.** `cluster` is always row-oriented and exposes both axes at once (`--cluster-align-x` / `--cluster-align-y`); renaming to `--cluster-horizontal-align` / `--cluster-vertical-align` adds length without adding information, since the orientation never changes. Kept as-is. `sidebar` and `grid-auto` expose only one axis each, so the qualifier is redundant — shortened to `--sidebar-align` (unchanged) and `--grid-align` (was `--grid-align-items`).

Applied renames:

| Primitive   | Before                          | After                       |
| ----------- | ------------------------------- | --------------------------- |
| `switcher`  | `--switcher-vertical-alignment` | `--switcher-vertical-align` |
| `repel`     | `--repel-y-alignment`           | `--repel-vertical-align`    |
| `grid-auto` | `--grid-align-items`            | `--grid-align`              |
| `wrapper`   | `--gutter`                      | `--wrapper-gutter`          |
| `cluster`   | `--cluster-align-x` / `-y`      | unchanged                   |
| `sidebar`   | `--sidebar-align`               | unchanged                   |

Rule going forward: name the var after what a caller needs to know (which visual side moves) unless the primitive's orientation is fixed and unambiguous, in which case prefer the shorter axis-relative or unqualified form.

## Consequences

**Makes easy.** A new primitive's alignment var has a rule to follow instead of five precedents to choose between. `--switcher-vertical-align` and `--repel-vertical-align` now read as the same concept, since both survive their primitive's respective direction flip (`switcher`'s is guaranteed; `repel`'s direction toggle is opt-in via `--repel-direction`). `--wrapper-gutter` matches every other wrapper var, so `primitive-vars.test.ts` no longer needs a hardcoded exception for it.

**Makes hard.** Nothing new — this is a pure rename, mechanically checked by the existing drift test.

**Costs.** Six call sites and one token file touched for a rename with no behavior change; git blame on `--gutter`/`--grid-align-items` history now points to this commit rather than original intent.

## Alternatives considered

**Axis-relative (`-x`/`-y`) everywhere, matching `cluster`.** Rejected: breaks the moment a primitive's orientation isn't fixed — `switcher`'s whole reason for existing is the row/column flip, and an axis-relative name would mean something different in each orientation. `repel`'s optional `--repel-direction` toggle has the same problem in miniature.

**Visual-relative (`-vertical`/`-horizontal`) everywhere, including `cluster`.** Rejected by the project owner: `cluster` is always row, so `--cluster-vertical-align`/`--cluster-horizontal-align` is strictly longer than `--cluster-align-x`/`-y` for identical meaning — no ambiguity to resolve, so the shorter form wins.

**Keep `-alignment` suffix (`--switcher-vertical-alignment`).** Rejected: `-align` is the same information in fewer characters; no other primitive var uses the longer form, so trimming this one aligns it with `--sidebar-align`, `--grid-align`, `--cluster-align-x`.
