# Block Catalogue

**Purpose:** closed set of layout blocks editor can place on page, plus rules each follow.
**Read this when:** building block renderer, changing block's fields, or deciding new content need new block.

> **Status: draft.** Phase 3 implement schemas, Phase 4 renderers. Doc update same change as either.

---

## Why set closed

Editors get freedom of _arrangement_, not freedom of _design_. Fixed catalogue mean every page composed by staff still look like site. Adding block deliberate change with review — see [../workflows/adding-a-block.md](../workflows/adding-a-block.md).

Before adding one, check existing block with new variant wouldn't do. Two blocks differ only in alignment = one block with alignment field.

---

## Catalogue

| Block        | Purpose                                                | Primitives                    |
| ------------ | ------------------------------------------------------ | ----------------------------- |
| `hero`       | Page opener: heading, subheading, image, CTAs          | `wrapper`, `flow`, `switcher` |
| `prose`      | Rich text at reading width                             | `flow`                        |
| `media-text` | Image beside text, side selectable                     | `switcher`                    |
| `card-grid`  | Cards — manual, or auto-populated from programs/events | `grid-auto`                   |
| `steps`      | Numbered process (the registration steps)              | `flow`                        |
| `stats`      | Large numbers with labels ("{n} years")                | `grid-auto`                   |
| `gallery`    | Photo grid, any number of images                       | `grid-auto`                   |
| `cta-banner` | Full-width call to action                              | `wrapper`, `repel`            |
| `schools`    | Renders the `schools` collection                       | `grid-auto`, `switcher`       |
| `faq`        | Accordion                                              | `flow`                        |
| `contact`    | Hours, email, phones, socials — all from globals       | `switcher`                    |
| `video`      | Embedded video with a tab heading                      | `flow`                        |

---

## Rules for every block

1. **Named for what it is, not where sits.** `card-grid`, never `homepage-section-3`.
2. **Fields carry admin labels + descriptions.** Editor who never saw code must pick right block from panel.
3. **Layout comes from primitives.** Block needing media query probably picked wrong primitive.
4. **Degrades at any content length.** One card and twelve cards both look right; long headings must not overflow.
5. **Server component unless interactivity unavoidable.** Only `faq` and `video` expected need client JS.
6. **No content defaults pretending to be design.** If field optional, block must render sensibly without it.
7. **Every block documented here same change that adds it.**

---

## Per-block notes

Filled in as each block lands. Each entry get: fields, variants, editor guidance, content-inventory sections it serves.
