import type { Block } from 'payload'

/** Cards — manual, or auto-populated from programs/events. Primitive: `grid-auto`. */
export const CardGrid: Block = {
  slug: 'card-grid',
  interfaceName: 'CardGridBlock',
  labels: { singular: 'Card Grid', plural: 'Card Grid Blocks' },
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'source',
      type: 'select',
      required: true,
      defaultValue: 'manual',
      options: [
        { label: 'Manual cards', value: 'manual' },
        { label: 'All programs', value: 'programs' },
        { label: 'All events', value: 'events' },
      ],
      admin: {
        description:
          'Auto-populated cards stay in sync as programs/events are added or removed. Manual cards give full control over copy per card.',
      },
    },
    {
      name: 'cards',
      type: 'array',
      admin: {
        condition: (_, { source } = {}) => source === 'manual',
        components: { RowLabel: '@/payload/admin/components/row-label#RowLabel' },
      },
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'body', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'url',
          type: 'text',
          admin: { description: 'Optional — makes the card a link.' },
        },
      ],
    },
  ],
}
