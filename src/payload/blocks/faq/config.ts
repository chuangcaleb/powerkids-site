import type { Block } from 'payload'
import { withHeaderTabs } from '@/payload/fields/header'

/** Accordion. Primitive: `flow`. */
export const Faq: Block = {
  slug: 'faq',
  interfaceName: 'FaqBlock',
  labels: { singular: 'FAQ', plural: 'FAQ Blocks' },
  fields: withHeaderTabs([
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      admin: {
        components: {
          RowLabel: '@/payload/admin/components/row-labels/row-label#RowLabel',
        },
      },
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'richText', required: true },
      ],
    },
  ]),
}
