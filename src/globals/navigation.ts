import type { GlobalConfig } from 'payload'

const linkFields = [
  { name: 'label', type: 'text', required: true },
  { name: 'url', type: 'text', required: true },
] as const

/** Header and footer link trees. Footer column headings are fields, not markup. */
export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: {
    group: 'Settings',
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'header',
      type: 'array',
      fields: [...linkFields],
    },
    {
      name: 'footerColumns',
      type: 'array',
      admin: {
        description: 'Each column has a heading and its own list of links.',
      },
      fields: [
        { name: 'heading', type: 'text', required: true },
        {
          name: 'links',
          type: 'array',
          fields: [...linkFields],
        },
      ],
    },
  ],
}
