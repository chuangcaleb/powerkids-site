import type { Block } from 'payload'

/** Numbered process — the registration steps on v3. Primitive: `flow`. */
export const Steps: Block = {
  slug: 'steps',
  labels: { singular: 'Steps', plural: 'Steps Blocks' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'steps',
      type: 'array',
      minRows: 1,
      admin: {
        components: { RowLabel: '@/payload/admin/components/row-label#RowLabel' },
      },
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    {
      name: 'cta',
      type: 'group',
      admin: {
        description: 'Optional call-to-action link shown after the steps.',
      },
      fields: [
        { name: 'label', type: 'text' },
        { name: 'url', type: 'text' },
      ],
    },
  ],
}
