# Hooks

Which collection/field hook to use, its args, when it fires, and revalidating Next.js after a change.

## Collection hooks

| Hook              | Fires                               | Key args                                | Return   |
| ----------------- | ----------------------------------- | --------------------------------------- | -------- |
| `beforeOperation` | Op starts                           | `{ args, operation, req }`              | `args`   |
| `beforeValidate`  | Before validation                   | `{ data, operation, originalDoc, req }` | `data`   |
| `beforeChange`    | After validation, before write      | `{ data, operation, originalDoc, req }` | `data`   |
| `afterChange`     | After write                         | `{ doc, previousDoc, operation, req }`  | `doc`    |
| `beforeRead`      | Before doc returned (find/findByID) | `{ doc, query, req }`                   | `doc`    |
| `afterRead`       | After doc populated                 | `{ doc, query, req }`                   | `doc`    |
| `beforeDelete`    | Before delete                       | `{ id, req }`                           | —        |
| `afterDelete`     | After delete                        | `{ doc, id, req }`                      | `doc`    |
| `afterOperation`  | Op completes                        | `{ operation, result, req }`            | `result` |
| `afterError`      | On thrown error                     | `{ error, req }`                        | —        |

```ts
hooks: {
  beforeChange: [async ({ data, operation }) => {
    if (operation === 'update' && data.status === 'published') data.publishedAt = new Date()
    return data
  }],
}
```

Globals expose the same hooks minus create/delete-only ones (`operation` is always
`'update'`).

## Field hooks

Same names, per-field, bubble bottom-up (before the collection hook of the same
phase). Args: `{ value, siblingData, data, req, operation }`. `siblingData` = other
fields on the doc — use for cross-field derivations.

```ts
import type { FieldHook } from 'payload'

const afterReadHook: FieldHook = ({ value, req }) =>
  req.user?.roles?.includes('admin') ? value : value.replace(/(.{2})(.*)(@.*)/, '$1***$3')

const emailField = { name: 'email', type: 'email', hooks: { afterRead: [afterReadHook] } }
```

## Transactions and `req`

Each operation runs in a transaction keyed by `req.transactionID` (Postgres). **Always
pass `req` through to nested `payload.*` calls inside a hook** — omitting it opens an
unrelated transaction, risking deadlock.

```ts
afterChange: [
  async ({ doc, req }) => {
    await req.payload.update({
      collection: 'related',
      id: doc.relatedId,
      data: { synced: true },
      req,
    })
  },
]
```

## Footguns

- **Infinite loops**: `afterChange` calling `update` on its own doc re-triggers
  `afterChange`. Guard with a changed-field check or a `context` flag.
- **`context`**: `req.context` (or the hook's `context` arg) is a plain object
  persisted across the hook chain for one request. Set it early, read it later, to
  pass data forward or flag "already handled".
- Field hook return replaces the value — returning `undefined` clears it.

## Revalidation after change (Next.js)

`context.disableRevalidate` suppresses revalidation from internal/seed writes;
diff `doc` vs `previousDoc` for publish/unpublish transitions.

```ts
import type { CollectionAfterChangeHook } from 'payload'
import { revalidatePath } from 'next/cache'

export const revalidatePage: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  req: { context },
}) => {
  if (context.disableRevalidate) return doc
  const path = (slug: string) => (slug === 'home' ? '/' : `/${slug}`)
  if (doc._status === 'published') revalidatePath(path(doc.slug))
  if (previousDoc?._status === 'published' && doc._status !== 'published') {
    revalidatePath(path(previousDoc.slug))
  }
  return doc
}
```

Mirror in `afterDelete` (`CollectionAfterDeleteHook`).

Access control (`access` key) is separate from hooks — see [collections.md](collections.md).
