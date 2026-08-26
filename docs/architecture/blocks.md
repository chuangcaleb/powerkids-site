# Blocks

**Purpose:** why the block set is closed, and rules every block follows.
**Read this when:** building a block renderer, changing a block's fields, or deciding whether new content needs a new block.

**The block set itself lives in code:** `src/payload/blocks/` — one directory per block, `config.ts` (schema) beside `component.tsx` (renderer), dispatched by `render-blocks.tsx`. Read that directory for the current list and field shapes; this doc does not restate them.

---

## Why set closed

Editors get freedom of _arrangement_, not freedom of _design_. Fixed catalogue mean every page composed by staff still look like site. Adding block deliberate change with review — see [../workflows/adding-a-block.md](../workflows/adding-a-block.md).

Before adding one, check existing block with new variant wouldn't do. Two blocks differ only in alignment = one block with alignment field.

**Hero is not a block.** Every page has exactly one, always present, independent of `layout` — `src/payload/collections/pages/hero.ts`. Pulled out of the closed set deliberately: editors don't choose whether a page has a hero, only its content and impact level. Decided when Pages itself was built — the one deviation from the block catalogue.

---

## Rules for every block

1. **Named for what it is, not where sits.** `framed-rows`, never `homepage-section-3`.
2. **Fields carry admin labels + descriptions.** Editor who never saw code must pick right block from panel.
3. **Layout comes from primitives.** Block needing media query probably picked wrong primitive.
4. **Degrades at any content length.** One card and twelve cards both look right; long headings must not overflow.
5. **Server component unless interactivity unavoidable.** Accordion and video tabs are the expected exceptions.
6. **No content defaults pretending to be design.** If field optional, block must render sensibly without it.
7. **`interfaceName` set on every block config.** Without it `generate:types` emits an anonymous inline type per usage site instead of one named type — e.g. `FaqBlock`, `ScrapbookBlock`.
8. **Content-driven blocks offer a `source` toggle.** Where a block can either take hand-written entries or pull from a collection (cards from programs/events, gallery from an event, video tabs from an event), give the editor both. Auto-populated sources stay in sync as the collection changes; manual gives per-instance copy control.

---

## Intent worth keeping

Reasons behind block shapes that the config file can't explain:

- **Stats can compute from `site-settings.foundedYear`** rather than store a number, so "{n} years & counting" never goes stale.
- **Events carry their own videos** so the Graduation page's per-year entries stop being a developer task.
- **Contact and schools blocks take a heading only** — every other value comes from globals or the `schools` collection. Deliberate: contact details in JSX is the defect this whole content model exists to prevent.
- **Styling is intentionally boilerplate.** Renderers cover layout and logic; visual polish is a later pass, not an omission.
