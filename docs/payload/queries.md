# Querying

How to read and write documents through Payload's Local API, and the `Where` operator shapes it accepts.

## Local API

Server components and route handlers call the Local API directly — no HTTP round trip.

```ts
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

const posts = await payload.find({
  collection: 'posts',
  where: { status: { equals: 'published' } },
  depth: 1,
  limit: 10,
  page: 1,
  sort: '-createdAt',
  select: { title: true, heroImage: true },
})

const one = await payload.findByID({ collection: 'posts', id, depth: 1 })
const globalDoc = await payload.findGlobal({ slug: 'site-settings', depth: 1 })

await payload.create({ collection: 'posts', data: { title: 'x' } })
await payload.update({ collection: 'posts', id, data: { title: 'y' } })
await payload.delete({ collection: 'posts', id })
await payload.count({ collection: 'posts', where: { status: { equals: 'published' } } })
```

Cache `getPayload({ config })` per request; don't call it repeatedly in a loop.

## Where operators

```ts
import type { Where } from 'payload'

const w: Where = {
  color: { equals: 'blue' },
  status: { not_equals: 'draft' },
  price: { greater_than: 100 },
  age: { less_than_equal: 65 },
  title: { contains: 'kids' }, // case-insensitive substring
  description: { like: 'phrase words' }, // all words present
  category: { in: ['tech', 'news'] },
  image: { exists: true },
  'author.role': { equals: 'editor' }, // dot path into relationship/nested field
}

const combined: Where = {
  or: [
    { color: { equals: 'mint' } },
    { and: [{ color: { equals: 'white' } }, { featured: { equals: false } }] },
  ],
}
```

## Key options

| Option       | Effect                                                                             |
| ------------ | ---------------------------------------------------------------------------------- |
| `depth`      | How many levels of relationship/upload fields populate. `0` returns raw IDs.       |
| `select`     | Restrict returned fields — `{ field: true }`. Reduces payload size and query cost. |
| `limit`      | Docs per page. `0` = no limit (use carefully).                                     |
| `page`       | 1-indexed pagination cursor.                                                       |
| `pagination` | Set `false` to skip count/pagination metadata entirely (faster).                   |
| `sort`       | Field name; prefix `-` for descending.                                             |
| `draft`      | `true` reads the draft version if the collection has drafts enabled.               |
| `locale`     | Not used in this project — single-language content.                                |

## Nested / relationship queries

Query into relationships and nested objects with dot-path strings (`'author.name'`, `'meta.featured'`). Payload joins across the relation at query time — this works for `relationship` and `upload` fields, not arbitrary joins.

## Performance footguns

- **Depth explosion**: `depth: 2+` on a document with several relationship fields fans out into many extra queries. Default to `depth: 0` or `1` and only raise it where the UI actually needs populated data.
- **N+1 in loops**: calling `payload.findByID` inside a `.map`/`for` over a list is one query per item. Use `where: { id: { in: [...] } }` with a single `find` instead.
- **Missing `select`**: without it, every field on the doc (including large rich-text/blocks JSON) comes back. Always `select` when you only need a few fields, e.g. list views.
- **`pagination: false`** only when you truly don't need `totalDocs`/`hasNextPage` — otherwise leave it on.

## REST / GraphQL

Both exist (`GET /api/{collection}`, `/api/graphql`) but this project's server components read exclusively through the Local API above; REST is only relevant if a client component needs to fetch after mount.

Full operator list and transaction/`req`-threading behavior for hooks: https://payloadcms.com/docs
