# Content Model

**Purpose:** the rules governing collections and globals — not their field lists.
**Read when:** adding/changing a field, writing a query, seeding data.

**The model itself lives in code:** `src/payload/collections/` and `src/payload/globals/`. Read those for current fields, types, and access. This doc holds only what the schema can't say.

---

## Rule

Nothing in the CMS is hard-coded in a component. Phone number, address, nav label, opening time in JSX = defect. This is the reason the content model exists; every collection below traces back to it.

---

## Conventions

- **File structure:** `src/payload/collections/<slug>/index.ts`, with `hooks/` alongside for anything more than a one-line access check.
- **Access:** shared utilities in `src/payload/access/` (`authenticated`, `authenticatedOrPublished`, `anyone`, `admin`/`adminFieldAccess`) — collections compose these rather than repeating inline role checks. `users`' `update` stays inline (self-or-admin) since that compound check doesn't fit any single utility.
- **Row labels:** array-field rows use the shared `src/payload/admin/components/row-label.tsx` client component (`admin.components.RowLabel`) instead of one bespoke label component per field.
- **Ordering:** collections rendered as lists carry an explicit `order` field. Never rely on creation order or alphabetical sort for editor-visible sequence.
- **Uploads:** `alt` is required — no exceptions, no empty strings.

## Roles

Two roles, `admin` and `editor`. Public reads see published documents only; `editor` writes content collections; `admin` additionally manages `users`.

## Design decisions behind the schema

Things a reader would otherwise mistake for arbitrary:

- **`pages` is the only collection with a block layout.** Everything else is structured data that blocks render. Adding `layout` to another collection means rethinking this boundary, not copying a field.
- **Media carries `checksum`, `hasDuplicate`, and `duplicateDismissed`** to flag re-uploads of a file already present, by checksum group rather than a single pointer. Non-blocking by design — the editor decides, the system only warns. See [ADR 0005](../decisions/0005-media-duplicate-detection-by-checksum-group.md) and `src/payload/collections/media/hooks/flag-duplicate.ts`.
- **Brand name is not a CMS field.** `PowerKids` with "Power" red and "Kids" blue is a fixed display convention — see `DESIGN.md`.
- **Footer column headings are fields, not markup.** Staff reorganise the footer without a deploy.
- **Two schools are inactive, not deleted.** Salak South Garden and Bukit Jalil were commented out in v3; not seeded in v4 unless the owner says otherwise.

## Relationships

```
pages ──has many──► blocks (embedded)
blocks ──reference──► media, programs, events, schools
schools ──one──► people (principal)
people ──one──► schools
events ──many──► media (gallery)
```
