import type { Block } from 'payload'

/**
 * Embedded video(s) rendered as tabs — one entry, or several (e.g.
 * Graduation, one tab per year). Primitive: `flow`.
 */
export const VideoBlock: Block = {
  slug: 'video',
  interfaceName: 'VideoBlock',
  labels: { singular: 'Video', plural: 'Video Blocks' },
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'subheading',
      type: 'text',
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Shown before the editor presses play.',
      },
    },
    {
      name: 'videos',
      type: 'array',
      admin: {
        description: 'One tab per entry.',
        components: { RowLabel: '@/payload/admin/components/row-label#RowLabel' },
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: { description: 'e.g. "Graduation 2026".' },
        },
        {
          name: 'embedId',
          type: 'text',
          required: true,
          admin: { description: 'Video platform embed/video ID.' },
        },
      ],
    },
  ],
}
