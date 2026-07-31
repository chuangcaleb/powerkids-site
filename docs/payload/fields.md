# Field types

Which Payload field type to use, and its minimal config shape.

Fields actually in use: see [content-model.md](../architecture/content-model.md) and [blocks.md](../architecture/blocks.md).

## Field type reference

| Type           | Use                                                | Gotcha                                                                                                   |
| -------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `text`         | short string                                       | for a URL slug use `slugField()`, not a hand-rolled `text`                                               |
| `textarea`     | long plain string                                  | no formatting; use `richText` for formatted copy                                                         |
| `number`       | numeric value                                      | `min`/`max` validate but don't clamp input                                                               |
| `checkbox`     | boolean                                            | value is `true`/`false`, never `undefined` after save                                                    |
| `select`       | fixed taxonomy, one or many                        | real taxonomy only — publish state should use `versions.drafts` + `_status`, not a custom select         |
| `richText`     | formatted long-form content                        | requires `lexicalEditor()`; feature set is per-field or global                                           |
| `upload`       | reference to a `media`-type collection doc         | `relationTo` required; `filterOptions` restricts mime types                                              |
| `relationship` | reference to one/many docs in one/many collections | polymorphic (`relationTo` as array) changes the returned shape                                           |
| `array`        | repeating group of sub-fields, ordered             | needs its own `fields`; `minRows`/`maxRows` bound it                                                     |
| `blocks`       | repeating, polymorphic sub-layouts                 | each `Block` needs a unique `slug`; builds page layouts                                                  |
| `group`        | nests fields under one object key                  | named (`name` set) changes data shape; unnamed is presentational only                                    |
| `tabs`         | groups fields into admin UI tabs                   | named tabs nest data like `group`; unnamed tabs don't                                                    |
| `row`          | lays fields out horizontally                       | presentational only, never affects stored data                                                           |
| `join`         | reverse relationship (read-only)                   | needs an existing `relationship`/`upload` field on the _other_ collection pointing back via `on`         |
| virtual field  | any field with `virtual: true`                     | not a distinct `type` — a flag; not stored, computed via `hooks.afterRead` or a relationship path string |

Other real types (rare here): `radio`, `date`, `email`, `code`, `json`, `point`, `collapsible`, `ui`. Full list: https://payloadcms.com/docs/fields/overview

## Scalar fields (text / textarea / number / checkbox)

```ts
import type { TextField } from 'payload'

const titleField: TextField = {
  name: 'title',
  type: 'text',
  required: true,
  unique: true,
  minLength: 5,
  maxLength: 100,
  defaultValue: 'Untitled',
}
```

`textarea`/`number` share this shape; `number` also takes `min`/`max`. `checkbox` takes no length options — just `defaultValue: boolean`.

## Slug

```ts
import { slugField } from 'payload'

fields: [
  // ...
  slugField(),
]
```

`slugField()` — built-in **helper function**, not distinct field `type`. Returns small field set (`text` field named `slug` plus `generateSlug` checkbox) wired together: auto-generates from another field, unique + indexed, renders in sidebar, gives editors lock/unlock + regenerate in admin UI. Don't hand-roll from plain `text` field.

Options, passed to `slugField(...)`:

| Option          | Effect                                                              |
| --------------- | ------------------------------------------------------------------- |
| `name`          | slug field's own name, default `'slug'`                             |
| `useAsSlug`     | top-level field to generate from, default `'title'`                 |
| `checkboxName`  | name of `generateSlug` checkbox field, default `'generateSlug'`     |
| `disableUnique` | drop unique index — use when adding compound unique index instead   |
| `overrides`     | function receiving default fields, for granular per-field overrides |
| `localized`     | localize slug + checkbox fields, default `false`                    |
| `position`      | field position (e.g. `'sidebar'`)                                   |
| `required`      | default `true`                                                      |

Upstream marks **experimental** — may change or vanish in future release. Use at own risk; re-check `docs/fields/slug.mdx` in Payload repo on upgrade.

## Select

```ts
import type { SelectField } from 'payload'

const priorityField: SelectField = {
  name: 'priority',
  type: 'select',
  options: [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
  ],
  defaultValue: 'medium',
  required: true,
  // hasMany: true for multi-select; options may also be plain strings
}
```

## Rich text (Lexical)

```ts
import type { RichTextField } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { HeadingFeature, LinkFeature } from '@payloadcms/richtext-lexical'

const contentField: RichTextField = {
  name: 'content',
  type: 'richText',
  required: true,
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3'] }),
      LinkFeature({ enabledCollections: ['pages'] }),
    ],
  }),
}
```

`features` must return the full array — it does not merge with defaults. Omitting `editor` falls back to the root config's editor.

## Upload

```ts
import type { UploadField } from 'payload'

const imageField: UploadField = {
  name: 'featuredImage',
  type: 'upload',
  relationTo: 'media',
  required: true,
  filterOptions: { mimeType: { contains: 'image' } },
}
```

## Relationship

```ts
import type { RelationshipField } from 'payload'

const authorField: RelationshipField = {
  name: 'author',
  type: 'relationship',
  relationTo: 'people',
  required: true,
  maxDepth: 2, // caps populate depth
}

// hasMany + filterOptions
const categoriesField: RelationshipField = {
  name: 'categories',
  type: 'relationship',
  relationTo: 'categories',
  hasMany: true,
  filterOptions: { active: { equals: true } },
}

// polymorphic: array relationTo -> { relationTo, value } shape per item
const relatedField: RelationshipField = {
  name: 'related',
  type: 'relationship',
  relationTo: ['posts', 'pages'],
  hasMany: true,
}
```

## Array

```ts
import type { ArrayField } from 'payload'

const slidesField: ArrayField = {
  name: 'slides',
  type: 'array',
  minRows: 2,
  maxRows: 10,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}
```

## Blocks

```ts
import type { BlocksField, Block } from 'payload'

const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'background', type: 'upload', relationTo: 'media' },
  ],
}

const layoutField: BlocksField = { name: 'layout', type: 'blocks', blocks: [HeroBlock] }
```

`interfaceName` names the generated TS type. Per-block editor rules: see [blocks.md](../architecture/blocks.md).

## Group, tabs, row

```ts
import type { GroupField, TabsField, RowField } from 'payload'

// Named group — nests data under `meta`
const metaField: GroupField = {
  name: 'meta',
  type: 'group',
  fields: [
    { name: 'title', type: 'text' },
    { name: 'description', type: 'textarea' },
  ],
}

// Tabs — named tab nests data like a group; unnamed tab does not
const tabsField: TabsField = {
  type: 'tabs',
  tabs: [
    { label: 'Content', fields: [{ name: 'title', type: 'text' }] },
    { name: 'seo', label: 'SEO', fields: [{ name: 'metaTitle', type: 'text' }] },
  ],
}

// Row — layout only, no data shape change
const rowField: RowField = {
  type: 'row',
  fields: [
    { name: 'firstName', type: 'text', admin: { width: '50%' } },
    { name: 'lastName', type: 'text', admin: { width: '50%' } },
  ],
}
```

## Join

```ts
import type { JoinField } from 'payload'

// On `people` — programs where this person is `principal`
const programsField: JoinField = {
  name: 'programsLed',
  type: 'join',
  collection: 'programs',
  on: 'principal', // relationship field on `programs` pointing back here
  admin: { allowCreate: false },
}
```

Read-only, not stored — resolved at read time; the relationship field on the other collection must already exist.

## Virtual fields

Not a `type`, a flag on any data field. Two forms:

```ts
import type { TextField } from 'payload'

// Computed from siblings — needs an afterRead hook
const fullNameField: TextField = {
  name: 'fullName',
  type: 'text',
  virtual: true,
  hooks: {
    afterRead: [({ siblingData }) => `${siblingData.firstName} ${siblingData.lastName}`],
  },
}

// Sourced from a relationship path — Payload resolves it, no hook needed
const authorNameField: TextField = {
  name: 'authorName',
  type: 'text',
  virtual: 'author.name',
}
```

Never written to the database — skip in manual DB/migration work.

## Validation

Every field accepts `validate`, returning `true` or a string error message:

```ts
{
  name: 'email',
  type: 'text',
  validate: (value) => (Boolean(value) && value.includes('@')) || 'Must be a valid email',
}
```

Signature: `(value, { data, siblingData, operation, req }) => true | string | Promise<true | string>` — async validation supported.

## admin.condition

Show/hide a field in the admin UI based on other field values. Client-side only — not a security boundary; pair with an `access` rule or `beforeChange` hook if the value must be blocked server-side.

```ts
{
  name: 'featureText',
  type: 'text',
  admin: {
    // (data, siblingData) => boolean; siblingData scopes to the parent group/array/block/row
    condition: (data, siblingData) => siblingData?.enableFeature === true,
  },
}
```

## defaultValue

Static value, or a function: `(args: { user, locale }) => value`. For `array`/`blocks`, must be an array of row objects matching the sub-`fields` shape.

## Field-level hooks

`beforeValidate`, `beforeChange`, `afterChange`, `afterRead` — same shapes as collection hooks, scoped to one field (normalizing a value, computing a virtual field). Collection/global hook wiring: see `AGENTS.md`.

## Common flags

| Flag        | Effect                                                                            |
| ----------- | --------------------------------------------------------------------------------- |
| `required`  | validated on save; does not set a default                                         |
| `unique`    | DB-level uniqueness constraint; implies an index                                  |
| `index`     | adds a DB index without uniqueness — for fields queried/sorted often              |
| `localized` | one value per locale; not applicable — this project is single-locale, leave unset |
| `hidden`    | removed from the admin UI entirely (still stored)                                 |
