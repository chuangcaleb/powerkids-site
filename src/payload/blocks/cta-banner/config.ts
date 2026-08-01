import type { Block } from 'payload'

/** Full-width call to action. Primitives: `wrapper`, `repel`. */
export const CtaBanner: Block = {
  slug: 'cta-banner',
  interfaceName: 'CtaBannerBlock',
  labels: { singular: 'CTA Banner', plural: 'CTA Banner Blocks' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
}
