# Content Model

**Purpose:** every collection and global, what it hold, how they relate.
**Read when:** adding/changing field, writing query, seeding data.

> **Status: shipped** for collections and globals below — see `src/collections/`, `src/globals/`. Blocks (the `pages.layout` field itself) land in a follow-up branch; this doc's block section stays draft until then.

Source content for every entity: [../reference/content-inventory.md](../reference/content-inventory.md).

---

## Rule

Nothing listed here hard-coded in component. Phone number, address, nav label, opening time in JSX = defect.

---

## Conventions

- **File structure:** `src/collections/<slug>/index.ts`, with `hooks/` alongside for anything more than a one-line access check.
- **Access:** shared utilities in `src/access/` (`authenticated`, `authenticatedOrPublished`, `anyone`, `admin`/`adminFieldAccess`) — collections compose these rather than repeating inline role checks. `users`' `update` stays inline (self-or-admin) since that compound check doesn't fit any single utility.
- **Row labels:** array-field rows use the shared `src/admin/components/row-label.tsx` client component (`admin.components.RowLabel`) instead of one bespoke label component per field. Lives under `src/admin/`, not `src/components/` — it's a CMS-only admin-panel component, not a front-end one.

---

## Collections

### `pages`

Editor-composed routes. Only collection with block layout.

`title`, `hero` (group — always present, not a block, see [blocks.md](blocks.md)), `meta` (SEO tab, via `@payloadcms/plugin-seo`'s field set), `publishedAt`, `slug`. `layout` (the 11-block set) lands with the block catalogue itself.

Drafts, version history enabled (`maxPerDoc: 20`). Slug unique, indexed, via Payload's `slugField()`. `afterChange`/`afterDelete` hooks revalidate the page's Next.js path on publish/unpublish/delete.

### `media`

Uploads, backed by R2. `alt` **required** — no exceptions, no empty strings.

`alt`, `caption`, focal point, generated sizes, folder-organised (Payload's built-in folders feature)

### `schools`

Physical branches. Three active; see inventory for two inactive entries.

`name`, `slug`, `address` (multi-line), `phones` (array of `number`/`href`), `mapUrl`, `photo`, `principal` → `people`, `order`

### `programs`

Daily offerings, fixed hours.

`name`, `slug`, `hours`, `ageRange`, `strapline`, `summary`, `body`, `image`, `order`

`ageRange` and `strapline` are optional.

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

`tagline`, `foundedYear`, `email`, `phones` (array), `openingHours`, `openingDays`, `socials` (array), `defaultShareImage`.

Brand name (`PowerKids`, "Power" red + "Kids" blue) is a fixed display convention, not a CMS field — see `DESIGN.md`.

Founding year stored so "{n} years & counting" stay computed, not hard-coded.

### `navigation`

`header` (array of `label`/`url`), `footerColumns` (array of `heading` + `links` array). Column headings are fields, not markup.

### `seo-defaults`

`titleTemplate` (`{title}` placeholder), `defaultDescription`, `defaultImage`.

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
