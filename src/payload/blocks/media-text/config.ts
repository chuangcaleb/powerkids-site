import type { Block } from 'payload'

/** Image beside text, side selectable. Primitive: `switcher`. */
export const MediaText: Block = {
  slug: 'media-text',
  interfaceName: 'MediaTextBlock',
  labels: { singular: 'Media + Text', plural: 'Media + Text Blocks' },
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'mediaSide',
      type: 'select',
      defaultValue: 'left',
      options: ['left', 'right'],
      admin: {
        description:
          'Which side the image sits on at wide viewports. Stacks on narrow ones.',
      },
    },
  ],
}
