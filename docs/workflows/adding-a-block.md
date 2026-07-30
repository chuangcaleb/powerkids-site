# Adding a Block

**Purpose:** the end-to-end steps to add a new layout block, so none of them get skipped.
**Read this when:** the content needs an arrangement no existing block provides.

> **Status: not yet implemented.** Phase 3 and 4 establish this workflow; the steps are the intended shape.

---

## First, don't

Adding a block widens what editors can build, permanently. Check in order:

1. Does an existing block cover it with a **new variant field**? Two blocks that differ only by alignment or colour are one block.
2. Is this **content**, not layout? A one-off arrangement on one page is usually a `prose` block with better copy.
3. Will editors actually **choose this correctly**? A catalogue of twenty blocks is a catalogue nobody reads.

If all three clear, proceed. New blocks need owner sign-off — they change the product, not just the code.

---

## Steps

1. **Agree the fields.** Write them into [../architecture/blocks.md](../architecture/blocks.md) first. The doc is the spec.
2. **Create `src/blocks/<name>/config.ts`.** Payload block config: `slug`, admin `labels`, and a `description` written for a non-technical editor. Every field gets a label and, where it isn't obvious, a description.
3. **Register it** on the `pages.layout` field.
4. **Generate types**: `pnpm generate:types`.
5. **Create a migration.** See [../ops/migrations.md](../ops/migrations.md).
6. **Build `src/blocks/<name>/Component.tsx`.** Server component. Layout from primitives, styling from tokens via a co-located CSS Module. No raw values.
7. **Register the renderer** in the block dispatcher.
8. **Handle the empty and extreme cases.** No image, no heading, one item, twenty items, a 90-character heading.
9. **Add it to the kitchen sink** so it is visible in isolation.
10. **Test.** Unit-test any pure logic; extend the Playwright smoke run if it introduces a new interaction.
11. **Check it rendered** at 320px, 768px, and 1440px, and with a keyboard if it is interactive.
12. **Update the docs in this same commit** — the block catalogue entry, and the component inventory if it added shared UI.
13. **Run the verify loop**, then open a PR.

## Definition of done

The block appears in the admin panel with a label an editor understands, renders correctly with minimal and maximal content, ships no client JS unless justified in a comment, and is documented.
