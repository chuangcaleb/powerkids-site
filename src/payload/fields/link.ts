import type { Condition, GroupField } from 'payload'

type LinkFieldOptions = {
  /**
   * Admin visibility condition — the one thing a call site has ever needed to
   * vary (the `content` block gates the group behind its `enableLink`
   * checkbox). Anything wider went out with the template's `overrides`
   * escape hatch: an unbounded `Partial<GroupField>` merged in meant every
   * caller could reshape the stored field, so no reader of this module could
   * know what the schema actually was.
   */
  condition?: Condition
}

/**
 * Internal-or-custom link group: `reference` to a page, or a raw `url`, plus a
 * label. `CMSLink` resolves the stored value to an `<a>`.
 *
 * `appearance` is stored but unrendered — see docs/backlog.md. Kept here
 * because dropping the column costs a migration; the options are hard-coded
 * rather than parameterised because a stored enum is not a per-call-site
 * choice.
 */
export function linkField({ condition }: LinkFieldOptions = {}): GroupField {
  return {
    name: 'link',
    type: 'group',
    admin: { hideGutter: true, condition },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'type',
            type: 'radio',
            admin: { layout: 'horizontal', width: '50%' },
            defaultValue: 'reference',
            options: [
              { label: 'Internal link', value: 'reference' },
              { label: 'Custom URL', value: 'custom' },
            ],
          },
          {
            name: 'newTab',
            type: 'checkbox',
            admin: { style: { alignSelf: 'flex-end' }, width: '50%' },
            label: 'Open in new tab',
          },
        ],
      },
      {
        type: 'row',
        fields: [
          {
            name: 'reference',
            type: 'relationship',
            relationTo: 'pages',
            label: 'Document to link to',
            required: true,
            admin: {
              width: '50%',
              condition: (_data, siblingData) => siblingData?.type === 'reference',
            },
          },
          {
            name: 'url',
            type: 'text',
            label: 'Custom URL',
            required: true,
            admin: {
              width: '50%',
              condition: (_data, siblingData) => siblingData?.type === 'custom',
            },
          },
          {
            name: 'label',
            type: 'text',
            label: 'Label',
            required: true,
            admin: { width: '50%' },
          },
        ],
      },
      {
        name: 'appearance',
        type: 'select',
        defaultValue: 'default',
        admin: { description: 'Choose how the link should be rendered.' },
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Outline', value: 'outline' },
        ],
      },
    ],
  }
}
