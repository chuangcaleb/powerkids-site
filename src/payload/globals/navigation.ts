import type { GlobalConfig } from 'payload'

import { authenticated } from '@/payload/access/authenticated'

import { revalidateLayout } from './hooks/revalidate-layout'

const linkFields = [
  { name: 'label', type: 'text', required: true },
  { name: 'url', type: 'text', required: true },
] as const

const rowLabel = { RowLabel: '@/payload/admin/components/row-label#RowLabel' } as const

/**
 * Footer link tree. Footer column headings are fields, not markup. Header
 * nav will be reintroduced later with a standard nested nav structure.
 */
export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: {
    group: 'Settings',
  },
  access: {
    read: () => true,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateLayout],
  },
  fields: [
    {
      name: 'footerColumns',
      type: 'array',
      admin: {
        description: 'Each column has a heading and its own list of links.',
        components: rowLabel,
      },
      fields: [
        { name: 'heading', type: 'text', required: true },
        {
          name: 'links',
          type: 'array',
          admin: { components: rowLabel },
          fields: [...linkFields],
        },
      ],
    },
  ],
}
