import type { Block } from 'payload'
import { withHeaderTabs } from '@/payload/fields/header'

/** Cards — manual, or auto-populated from programs/events. Primitive: `grid-auto`. */
export const CardGrid: Block = {
  slug: 'card-grid',
  interfaceName: 'CardGridBlock',
  labels: { singular: 'Card Grid', plural: 'Card Grid Blocks' },
  fields: withHeaderTabs([
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
  ]),
}
