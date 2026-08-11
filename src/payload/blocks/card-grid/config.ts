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
      name: 'cards',
      type: 'array',
      admin: {
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
