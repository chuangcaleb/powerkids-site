import type { Block } from 'payload'

/** Photo grid, any number of images. Primitive: `grid-auto`. */
export const Gallery: Block = {
  slug: 'gallery',
  interfaceName: 'GalleryBlock',
  labels: { singular: 'Gallery', plural: 'Gallery Blocks' },
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
        { label: 'Manual images', value: 'manual' },
        { label: "An event's gallery", value: 'event' },
      ],
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: {
        condition: (_, { source } = {}) => source === 'manual',
      },
    },
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      admin: {
        condition: (_, { source } = {}) => source === 'event',
        description: "Renders that event's own gallery field.",
      },
    },
  ],
}
