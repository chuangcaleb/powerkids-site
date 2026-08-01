import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated } from '@/payload/access/authenticated'
import { authenticatedOrPublished } from '@/payload/access/authenticated-or-published'

import { revalidateProgram, revalidateProgramDelete } from './hooks/revalidate-program'

/**
 * Daily offerings with fixed hours — Morning School, After School Program,
 * Evening Daycare. Not a "class" or "course": every program runs every day
 * across schools that offer it.
 */
export const Programs: CollectionConfig = {
  slug: 'programs',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'hours', 'order'],
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
    afterChange: [revalidateProgram],
    afterDelete: [revalidateProgramDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    slugField({ fieldToUse: 'name' }),
    {
      name: 'hours',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. "7:30am - 1:00pm".',
      },
    },
    {
      name: 'ageRange',
      type: 'text',
      admin: {
        description: 'e.g. "3 - 6 years". Leave empty if not age-restricted.',
      },
    },
    {
      name: 'strapline',
      type: 'text',
      admin: {
        description: 'Short one-liner shown in card/list views.',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
    },
    {
      name: 'body',
      type: 'richText',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
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
