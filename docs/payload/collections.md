# Collections and globals

How to shape a `CollectionConfig` or `GlobalConfig`: admin display, uploads, drafts, versions, live preview.

Project-specific collections and fields: see [content-model.md](../architecture/content-model.md).

## CollectionConfig shape

```ts
import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Post', plural: 'Posts' },
  admin: {
    useAsTitle: 'title', // field shown as doc title in list/edit views
    defaultColumns: ['title', 'author', '_status', 'createdAt'],
    group: 'Content', // admin sidebar section — see Admin group ordering below
    description: 'Blog posts and articles',
    listSearchableFields: ['title', 'slug'],
  },
  versions: { drafts: true }, // see Drafts & versions below
  fields: [
    { name: 'title', type: 'text', required: true, index: true },
    // built-in helper, not a hand-rolled `text` field — see fields.md
    slugField(),
  ],
  defaultSort: '-createdAt',
  timestamps: true, // default true — adds/manages createdAt, updatedAt
}
```

Hooks/access are separate config keys (`hooks`, `access`); see [hooks.md](hooks.md).

## Upload collections

```ts
export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 1024 },
    ],
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    crop: true,
  },
  fields: [
    { name: 'alt', type: 'text', required: true }, // no built-in default — enforce yourself
    { name: 'caption', type: 'text' },
  ],
}
```

`imageSizes[].name` becomes the key under `doc.sizes` on the returned doc. With
`@payloadcms/storage-s3`, files go to the bucket, not `staticDir`. `alt` has no
built-in requiredness — the field above is how you enforce it.

## Drafts & versions

```ts
versions: true               // audit log only, no draft workflow
versions: { maxPerDoc: 50 }  // cap version history (0 = unlimited)
versions: {
  drafts: {
    autosave: true,            // periodic autosave while editing
    schedulePublish: true,     // schedule future publish/unpublish
    validate: false,           // default: drafts skip required-field validation
  },
  maxPerDoc: 100,
}
```

Enabling `versions.drafts` auto-injects a managed `_status` field
(`draft` / `published` / `changed`) — do not add a custom status field. Use `_status`
directly in `defaultColumns` and `access`.

```ts
await payload.create({ collection: 'posts', data: {...}, draft: true })
await payload.findByID({ collection: 'posts', id, draft: true }) // latest draft if present

access: {
  read: ({ req: { user } }) =>
    user ? true : { _status: { equals: 'published' } },
}
```

`_status`: `draft` (never published), `published` (no newer draft), `changed`
(published, has newer unpublished draft).

## Live preview

```ts
const previewURL = ({ data }: { data: any }) =>
  `${process.env.NEXT_PUBLIC_SERVER_URL}/api/preview?slug=${data?.slug}&collection=pages`

admin: {
  livePreview: { url: previewURL },
  preview: previewURL,
}
```

`livePreview.url` drives the in-admin iframe; `preview` drives the "Preview" button.
Both need a matching `/api/preview` route that sets Next.js draft mode.

## Globals

Single-instance documents — no `id` list, no `find`, just `findGlobal`/`updateGlobal`.

```ts
import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header',
  admin: { group: 'Settings' },
  fields: [
    { name: 'logo', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'nav',
      type: 'array',
      maxRows: 8,
      fields: [
        { name: 'link', type: 'relationship', relationTo: 'pages' },
        { name: 'label', type: 'text' },
      ],
    },
  ],
}
```

Globals support `versions`/`drafts`, `hooks`, `access`, minus ops that don't apply
(`create`, `delete`).

## Admin group ordering

`admin.group` buckets a collection/global under a labeled sidebar section. Groups
appear in first-seen order across `collections`/`globals` in `payload.config.ts` —
order those arrays to control sidebar order, not alphabetically.

Auth, RBAC, MongoDB/SQLite specifics: not used here — see https://payloadcms.com/docs.
