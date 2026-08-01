import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

/**
 * Editor-composed routes. `layout` (block array) lands in a follow-up
 * branch alongside the block catalogue itself — see docs/architecture/blocks.md.
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status'],
    group: 'Content',
  },
  access: {
    read: ({ req }) => Boolean(req.user) || { _status: { equals: 'published' } },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  versions: {
    drafts: true,
    maxPerDoc: 20,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField(),
    {
      name: 'seo',
      type: 'group',
      admin: {
        description: 'Falls back to seo-defaults global when left empty.',
      },
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
