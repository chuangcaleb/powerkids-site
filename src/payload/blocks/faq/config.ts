import type { Block } from 'payload'

/** Accordion. Primitive: `flow`. */
export const Faq: Block = {
  slug: 'faq',
  labels: { singular: 'FAQ', plural: 'FAQ Blocks' },
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      admin: {
        components: { RowLabel: '@/payload/admin/components/row-label#RowLabel' },
      },
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'richText', required: true },
      ],
    },
  ],
}
