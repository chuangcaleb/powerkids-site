import type { Block } from 'payload'

/** Photo grid, any number of images — curated manually, or every Media doc carrying a tag. Primitive: `grid-auto`. */
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
      name: 'subheading',
      type: 'text',
    },
    {
      name: 'mode',
      type: 'select',
      required: true,
      defaultValue: 'manual',
      options: [
        { label: 'Manual images', value: 'manual' },
        { label: 'Every photo tagged...', value: 'tag' },
      ],
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: {
        condition: (_, { mode } = {}) => mode === 'manual',
        description: 'Drag to reorder.',
      },
    },
    {
      name: 'tag',
      type: 'relationship',
      relationTo: 'media-tags',
      admin: {
        condition: (_, { mode } = {}) => mode === 'tag',
      },
    },
    {
      name: 'sort',
      type: 'select',
      defaultValue: 'newest',
      options: [
        { label: 'Newest first', value: 'newest' },
        { label: 'Oldest first', value: 'oldest' },
        { label: 'Filename', value: 'filename' },
      ],
      admin: {
        condition: (_, { mode } = {}) => mode === 'tag',
        description: 'No per-image ordering in tag mode — pick a sort instead.',
      },
    },
  ],
}
