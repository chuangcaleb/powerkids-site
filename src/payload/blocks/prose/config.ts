import type { Block } from 'payload'

/** Rich text at reading width. Primitive: `flow`. */
export const Prose: Block = {
  slug: 'prose',
  interfaceName: 'ProseBlock',
  labels: { singular: 'Prose', plural: 'Prose Blocks' },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
  ],
}
