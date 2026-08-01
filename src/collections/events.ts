import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

/**
 * Recurring school activity types — Graduation, Sports Day, Field Trips,
 * Community Service. Not a dated calendar entry: one document per activity
 * type, with per-occurrence media (gallery, videos) added over time.
 */
export const Events: CollectionConfig = {
  slug: 'events',
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
      name: 'summary',
      type: 'textarea',
    },
    {
      name: 'body',
      type: 'richText',
    },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'videos',
      type: 'array',
      admin: {
        description: 'One entry per year. Add a new one each occurrence.',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: { description: 'e.g. "Graduation 2026".' },
        },
        {
          name: 'embedId',
          type: 'text',
          required: true,
          admin: { description: 'Video platform embed/video ID.' },
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Controls listing order. Lower shows first.',
      },
    },
  ],
}
