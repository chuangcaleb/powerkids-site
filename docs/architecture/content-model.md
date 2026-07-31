# Content Model

**Purpose:** every collection and global, what it hold, how they relate.
**Read when:** adding/changing field, writing query, seeding data.

> **Status: draft.** Phase 3 finalise, update doc to match shipped schema. Field lists below intent, not yet implementation.

Source content for every entity: [../reference/content-inventory.md](../reference/content-inventory.md).

---

## Rule

Nothing listed here hard-coded in component. Phone number, address, nav label, opening time in JSX = defect.

---

## Collections

### `pages`

Editor-composed routes. Only collection with block layout.

`title`, `slug`, `layout` (blocks), `seo`, `publishedAt`, `_status`
Drafts, version history enabled. Slug unique, indexed.

### `media`

Uploads, backed by R2. `alt` **required** — no exceptions, no empty strings.

`alt`, `caption`, focal point, generated sizes

### `schools`

Physical branches. Three active; see inventory for two inactive entries.

`name`, `address` (multi-line), `phones` (array), `mapUrl`, `photo`, `principal` → `people`, `order`

### `programs`

Daily offerings, fixed hours.

`name`, `slug`, `hours`, `ageRange`, `strapline`, `summary`, `body`, `image`, `order`

### `events`

Recurring activity types, not dated calendar entries.

`name`, `slug`, `summary`, `body`, `gallery` → `media[]`, `videos` (array of embed id + label), `order`

`videos` field exists so Graduation page's per-year entries stop being developer task.

### `people`

Principals, team section if it returns.

`name`, `role`, `school` → `schools`, `bio`, `portrait`, `order`

### `users`

Admin auth. Roles: `admin` (full) and `editor` (content only, no user management).

---

## Globals

### `site-settings`

Brand name, tagline, founding year, email, phones, opening hours/days, social links, default share image.

Founding year stored so "{n} years & counting" stay computed, not hard-coded.

### `navigation`

`header`, `footer` link trees. Footer column headings are fields, not markup.

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

| Role     | Read           | Write                     |
| -------- | -------------- | ------------------------- |
| Public   | published only | none                      |
| `editor` | all            | all content collections   |
| `admin`  | all            | everything, incl. `users` |

## Ordering

Collections rendered as lists carry explicit `order` field. Never rely on creation order or alphabetical sort for editor-visible sequence.
