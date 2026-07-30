# Content Model

**Purpose:** every collection and global, what it holds, and how they relate.
**Read this when:** adding or changing a field, writing a query, or seeding data.

> **Status: draft.** Phase 3 finalises this and updates the doc to match the shipped schema. Field lists below are intent, not yet implementation.

Source content for every entity is [../reference/content-inventory.md](../reference/content-inventory.md).

---

## Rule

Nothing listed here may be hard-coded in a component. If a phone number, address, nav label, or opening time appears in JSX, it is a defect.

---

## Collections

### `pages`
Editor-composed routes. The only collection with a block layout.

`title`, `slug`, `layout` (blocks), `seo`, `publishedAt`, `_status`
Drafts and version history enabled. Slug is unique and indexed.

### `media`
Uploads, backed by R2. `alt` is **required** — no exceptions, no empty strings.

`alt`, `caption`, focal point, generated sizes

### `schools`
The physical branches. Three active; see the inventory for two inactive entries.

`name`, `address` (multi-line), `phones` (array), `mapUrl`, `photo`, `principal` → `people`, `order`

### `programs`
Daily offerings with fixed hours.

`name`, `slug`, `hours`, `ageRange`, `strapline`, `summary`, `body`, `image`, `order`

### `events`
Recurring activity types, not dated calendar entries.

`name`, `slug`, `summary`, `body`, `gallery` → `media[]`, `videos` (array of embed id + label), `order`

`videos` exists so the Graduation page's per-year entries stop being a developer task.

### `people`
Principals, and the team section if it returns.

`name`, `role`, `school` → `schools`, `bio`, `portrait`, `order`

### `users`
Admin authentication. Roles: `admin` (full) and `editor` (content only, no user management).

---

## Globals

### `site-settings`
Brand name, tagline, founding year, email, phones, opening hours and days, social links, default share image.

Founding year is stored so "{n} years & counting" stays computed rather than hard-coded.

### `navigation`
`header` and `footer` link trees. Footer column headings are fields, not markup.

### `seo-defaults`
Title template, default description, default OG image.

---

## Relationships

```
pages ──has many──► blocks (embedded)
blocks ──reference──► media, programs, events, schools
schools ──one──► people (principal)
people ──one──► schools
events ──many──► media (gallery)
```

## Access

| Role | Read | Write |
| --- | --- | --- |
| Public | published only | none |
| `editor` | all | all content collections |
| `admin` | all | everything, incl. `users` |

## Ordering

Collections that render as lists carry an explicit `order` field. Never rely on creation order or alphabetical sorting for editor-visible sequence.
