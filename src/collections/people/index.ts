import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticated-or-published'

/**
 * Principals and (if the section returns) team members. Bio content only —
 * rendering decisions belong to whichever block references this collection.
 */
export const People: CollectionConfig = {
  slug: 'people',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'school'],
    group: 'Content',
  },
  access: {
    read: authenticatedOrPublished,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: { drafts: true },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. "Principal", "Curriculum Lead".',
      },
    },
    {
      name: 'school',
      type: 'relationship',
      relationTo: 'schools',
      admin: {
        description: 'Leave empty if not tied to a single school.',
      },
    },
    {
      name: 'bio',
      type: 'richText',
    },
    {
      name: 'portrait',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description:
          'Controls listing order where this person appears. Lower shows first.',
      },
    },
  ],
}
