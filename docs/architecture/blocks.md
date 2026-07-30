# Block Catalogue

**Purpose:** the closed set of layout blocks an editor may place on a page, and the rules each one follows.
**Read this when:** building a block renderer, changing a block's fields, or deciding whether new content needs a new block.

> **Status: draft.** Phase 3 implements the schemas, Phase 4 the renderers. This doc is updated in the same change as either.

---

## Why the set is closed

Editors get freedom of *arrangement*, not freedom of *design*. A fixed catalogue means every page composed by staff still looks like the site. Adding a block is a deliberate change with a review — see [../workflows/adding-a-block.md](../workflows/adding-a-block.md).

Before adding one, check that an existing block with a new variant would not do. Two blocks that differ only in alignment are one block with an alignment field.

---

## Catalogue

| Block | Purpose | Primitives |
| --- | --- | --- |
| `hero` | Page opener: heading, subheading, image, CTAs | `wrapper`, `flow`, `switcher` |
| `prose` | Rich text at reading width | `flow` |
| `media-text` | Image beside text, side selectable | `switcher` |
| `card-grid` | Cards — manual, or auto-populated from programs/events | `grid-auto` |
| `steps` | Numbered process (the registration steps) | `flow` |
| `stats` | Large numbers with labels ("{n} years") | `grid-auto` |
| `gallery` | Photo grid, any number of images | `grid-auto` |
| `cta-banner` | Full-width call to action over the blob motif | `wrapper`, `repel` |
| `schools` | Renders the `schools` collection | `grid-auto`, `switcher` |
| `faq` | Accordion | `flow` |
| `contact` | Hours, email, phones, socials — all from globals | `switcher` |
| `video` | Embedded video with a tab heading | `flow` |

---

## Rules for every block

1. **Named for what it is, not where it sits.** `card-grid`, never `homepage-section-3`.
2. **Fields carry admin labels and descriptions.** An editor who has never seen the code must be able to pick the right block from the panel.
3. **Layout comes from primitives.** A block that needs a media query has probably picked the wrong primitive.
4. **Degrades at any content length.** One card and twelve cards must both look right; long headings must not overflow.
5. **Server component unless interactivity is unavoidable.** Only `faq` and `video` are expected to need client JS.
6. **No content defaults that pretend to be design.** If a field is optional, the block must render sensibly without it.
7. **Every block is documented here in the same change that adds it.**

---

## Per-block notes

Filled in as each block lands. Each entry gets: fields, variants, editor guidance, and the content-inventory sections it serves.
