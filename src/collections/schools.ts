import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

/**
 * Physical branches. Three active — see docs/reference/content-inventory.md
 * for the two inactive entries and why they're not migrated.
 */
export const Schools: CollectionConfig = {
  slug: 'schools',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'order'],
    group: 'Content',
  },
  access: {
    read: ({ req }) => Boolean(req.user) || { _status: { equals: 'published' } },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  versions: { drafts: true },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    slugField(),
    {
      name: 'address',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Multi-line. Rendered as written, no auto-formatting.',
      },
    },
    {
      name: 'phones',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'number',
          type: 'text',
          required: true,
          admin: { description: 'Display form, e.g. "010 - 221 2482".' },
        },
        {
          name: 'href',
          type: 'text',
          required: true,
          admin: {
            description: 'tel: link target, e.g. "+60102212482". Include country code.',
          },
        },
      ],
    },
    {
      name: 'mapUrl',
      type: 'text',
      admin: {
        description: 'Google Maps link for this school.',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'principal',
      type: 'relationship',
      relationTo: 'people',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Controls listing order on the schools page. Lower shows first.',
      },
    },
  ],
}
