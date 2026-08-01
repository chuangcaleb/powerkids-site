import type { Field } from 'payload'

/**
 * Always-present opener field, independent of `layout` — every page has
 * exactly one hero. Not one of the 12 closed blocks: see the "Hero
 * placement" decision recorded in docs/architecture/blocks.md.
 */
export const hero: Field = {
  name: 'hero',
  type: 'group',
  label: false,
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'highImpact',
      options: [
        { label: 'None', value: 'none' },
        { label: 'High impact — full-bleed image', value: 'highImpact' },
        { label: 'Low impact — heading only', value: 'lowImpact' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type !== 'none',
      },
    },
    {
      name: 'subheading',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type !== 'none',
      },
    },
    {
      name: 'ctas',
      type: 'array',
      maxRows: 2,
      admin: {
        condition: (_, { type } = {}) => type !== 'none',
        components: {
          RowLabel: '@/components/row-label#RowLabel',
        },
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, { type } = {}) => type === 'highImpact',
      },
    },
  ],
}
