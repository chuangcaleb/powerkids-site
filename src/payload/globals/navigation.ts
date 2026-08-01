import type { GlobalConfig } from 'payload'

import { authenticated } from '@/payload/access/authenticated'

const linkFields = [
  { name: 'label', type: 'text', required: true },
  { name: 'url', type: 'text', required: true },
] as const

const rowLabel = { RowLabel: '@/payload/admin/components/row-label#RowLabel' } as const

/** Header and footer link trees. Footer column headings are fields, not markup. */
export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: {
    group: 'Settings',
  },
  access: {
    read: () => true,
    update: authenticated,
  },
  fields: [
    {
      name: 'header',
      type: 'array',
      admin: { components: rowLabel },
      fields: [...linkFields],
    },
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
