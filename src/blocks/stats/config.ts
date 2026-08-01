import type { Block } from 'payload'

/** Large numbers with labels ("{n} years"). Primitive: `grid-auto`. */
export const Stats: Block = {
  slug: 'stats',
  labels: { singular: 'Stats', plural: 'Stats Blocks' },
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'stats',
      type: 'array',
      minRows: 1,
      admin: {
        components: { RowLabel: '@/admin/components/row-label#RowLabel' },
      },
      fields: [
        {
          name: 'useFoundedYear',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description:
              'Compute this stat as "{n} years & counting" from site-settings.foundedYear instead of a fixed value.',
          },
        },
        {
          name: 'value',
          type: 'text',
          admin: {
            condition: (_, { useFoundedYear } = {}) => !useFoundedYear,
            description: 'e.g. "500+".',
          },
        },
        { name: 'label', type: 'text', required: true },
      ],
    },
  ],
}
