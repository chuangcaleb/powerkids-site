import type { Block } from 'payload'

/**
 * Embedded video with a tab heading — either one manual video, or an
 * event's own `videos` array rendered as tabs (e.g. Graduation, one tab
 * per year). Primitive: `flow`.
 */
export const VideoBlock: Block = {
  slug: 'video',
  labels: { singular: 'Video', plural: 'Video Blocks' },
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'source',
      type: 'select',
      required: true,
      defaultValue: 'manual',
      options: [
        { label: 'Manual video', value: 'manual' },
        { label: "An event's videos, as tabs", value: 'event' },
      ],
    },
    {
      name: 'embedId',
      type: 'text',
      admin: {
        condition: (_, { source } = {}) => source === 'manual',
        description: 'Video platform embed/video ID.',
      },
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, { source } = {}) => source === 'manual',
        description: 'Shown before the editor presses play.',
      },
    },
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      admin: {
        condition: (_, { source } = {}) => source === 'event',
        description: "Each entry in that event's `videos` array becomes one tab.",
      },
    },
  ],
}
