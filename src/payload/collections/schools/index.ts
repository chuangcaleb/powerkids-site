import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated } from '@/payload/access/authenticated'
import { authenticatedOrPublished } from '@/payload/access/authenticated-or-published'

import { revalidateSchool, revalidateSchoolDelete } from './hooks/revalidate-schools'

/**
 * Physical branches. Three active. Salak South Garden and Bukit Jalil were
 * commented out in v3 and are not seeded here unless the owner says otherwise.
 */
export const Schools: CollectionConfig = {
  slug: 'schools',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'order'],
    group: 'Content',
  },
  access: {
    read: authenticatedOrPublished,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: { drafts: true },
  hooks: {
    afterChange: [revalidateSchool],
    afterDelete: [revalidateSchoolDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    slugField({ fieldToUse: 'name' }),
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
      admin: {
        components: { RowLabel: '@/payload/admin/components/row-label#RowLabel' },
      },
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
