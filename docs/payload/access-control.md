# Access control

How to gate create/read/update/delete on collections, globals, and fields, and how public reads must exclude drafts.

## Default deny

Every operation is **denied unless an access function returns `true`**. Omitting `access` falls back to Payload's built-in default, which varies by collection type — always set `access` explicitly rather than rely on it.

## Function signature

```ts
import type { Access, FieldAccess } from 'payload'

// Collection: create, read, update, delete, admin, unlock, readVersions
const collectionCheck: Access = ({ req, id, data }) => {
  return true // or false, or a Where query (read/update/delete only)
}

// Field: create, read, update — boolean ONLY, no Where
const fieldCheck: FieldAccess = ({ req, doc, siblingData }) => Boolean(req.user)
```

Return types:

- `boolean` — allow/deny the whole operation.
- `Where` query object — collection-level `read`/`update`/`delete` only. Applied as a row-level filter; non-matching docs are excluded (read) or the op 404s (update/delete).
- Field-level access is boolean-only; a `Where` there is ignored.

Argument shapes differ by operation: `create` gets `{ req, data }`; `read`/`delete` get `{ req, id }`; `update` gets `{ req, id, data }`; field-level adds `doc` (read/update) and `siblingData` (all).

## Collection-level

```ts
export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    create: ({ req }) => Boolean(req.user),
    read: ({ req }) => {
      if (req.user) return true
      return { _status: { equals: 'published' } } // public: published only
    },
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
    admin: ({ req }) => Boolean(req.user), // controls admin-panel visibility
  },
}
```

`admin` only hides/shows the collection in the panel nav — it does not restrict the API.

## Field-level

```ts
{
  name: 'internalNotes',
  type: 'textarea',
  access: {
    read: ({ req }) => Boolean(req.user),   // omitted from API response if false
    update: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
  },
}
```

A denied field is silently omitted from the response (read) or ignored on write — no error thrown. Forgetting a field-level `read` on a sensitive field is a silent leak, not a crash.

## Published vs. draft reads

With `versions.drafts` enabled, unpublished docs carry `_status: 'draft'`. Public-facing `read` access must filter on `_status`:

```ts
read: ({ req }) => {
  if (req.user) return true
  return { _status: { equals: 'published' } }
}
```

Omitting this check leaks drafts to anonymous visitors via the API even though the admin UI hides them. Project's collections with drafts enabled: see [content-model.md](../architecture/content-model.md).

## `req.user` shape

`req.user` is `null`/`undefined` when unauthenticated, otherwise the authenticated document from the auth collection (`id`, `email`, plus custom fields). One auth collection (`users`), no public signup — `Boolean(req.user)` is a sufficient admin check for most operations here. Project's user fields: see [content-model.md](../architecture/content-model.md).

## `overrideAccess` in Local API

Local API (`payload.find`, `payload.create`, etc.) **skips access control by default**. Passing `user` alone does nothing unless paired with `overrideAccess: false`:

```ts
// WRONG — user is ignored, runs with full privileges
await payload.find({ collection: 'posts', user: someUser })

// CORRECT — enforces that user's access functions
await payload.find({ collection: 'posts', user: someUser, overrideAccess: false })
```

Server components calling Local API directly run as admin by default — fine for trusted SSR, but never forward an untrusted `id`/`where` without filtering `_status` or setting `overrideAccess: false`.

## Footguns

- **Leaking drafts**: public `read` without `_status: { equals: 'published' }` exposes unpublished content via the API.
- **Unrestricted update/delete**: no `access.update`/`access.delete` means anyone can write — set both explicitly, even on admin-only collections.
- **Missing field-level `read`**: collection `read: true` does not hide individual fields; each sensitive field needs its own `access.read`.
- **Local API defaults to admin**: forgetting `overrideAccess: false` when passing `user` silently bypasses every access function.
- **Access runs before hooks**: hooks can't compensate for a permissive access function.
