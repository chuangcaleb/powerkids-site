# Adding a Block

**Purpose:** end-to-end steps add new layout block, none get skipped.
**Read this when:** content need arrangement no existing block provide.

---

## First, don't

Adding block widens what editors can build, permanently. Check in order:

1. Existing block cover it with **new variant field**? Two blocks differ only by alignment or colour = one block.
2. This **content**, not layout? One-off arrangement on one page usually `prose` block, better copy.
3. Editors actually **choose this correctly**? Catalogue of twenty blocks = catalogue nobody reads.

All three clear, proceed. New blocks need owner sign-off — change product, not just code.

---

## Steps

1. **Agree the fields with the owner before writing any.** New blocks change the product, not just the code.
2. **Create `src/payload/blocks/<name>/config.ts`.** Payload block config: `slug`, admin `labels`, and a `description` written for a non-technical editor. Every field gets label and, where not obvious, description.
3. **Register it** on `pages.layout` field.
4. **Generate types**: `pnpm generate:types`.
5. **Create a migration.** See [../ops/migrations.md](../ops/migrations.md).
6. **Build `src/payload/blocks/<name>/component.tsx`.** Server component. Layout from primitives, styling from tokens via co-located CSS Module. No raw values.
7. **Register the renderer** in block dispatcher.
8. **Handle empty and extreme cases.** No image, no heading, one item, twenty items, 90-character heading.
9. **Add it to kitchen sink** — visible in isolation.
10. **Test.** Unit-test any pure logic (`vitest`). No end-to-end suite exists — don't reference one.
11. **Check it rendered** at 320px, 768px, and 1440px, and with keyboard if interactive.
12. **Update docs same commit** — only if the block breaks a rule in [../architecture/blocks.md](../architecture/blocks.md) or introduces intent the config can't express. Field lists belong in `config.ts`, not in docs.
13. **Run verify loop**, then open PR.

## Definition of done

Block appears in admin panel with label editor understands, renders correctly with minimal and maximal content, ships no client JS unless justified in comment, documented.
