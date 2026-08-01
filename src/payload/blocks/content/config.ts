import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { link } from '@/fields/link'

/** Flexible multi-column rich text/media/link layout. Bespoke grid — no primitive covers fixed 12-col spans, see content.module.css. */
export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  labels: { singular: 'Content', plural: 'Content Blocks' },
  fields: [
    {
      name: 'columns',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'size',
              type: 'select',
              defaultValue: 'full',
              admin: { width: '50%' },
              options: [
                { label: 'Full', value: 'full' },
                { label: 'One-Half Wide', value: 'oneHalfWide' },
                { label: 'One-Third', value: 'oneThird' },
                { label: 'Two-Thirds', value: 'twoThirds' },
                { label: 'One-Half Narrow', value: 'oneHalfNarrow' },
              ],
            },
            {
              name: 'variant',
              type: 'select',
              defaultValue: 'align-start',
              admin: { width: '50%' },
              options: [
                { label: 'Align: Start', value: 'align-start' },
                { label: 'Align: Center', value: 'align-center' },
                { label: 'Card', value: 'card' },
              ],
            },
          ],
        },
        {
          name: 'richText',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
          label: false,
        },
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          label: 'Image (optional)',
        },
        {
          name: 'enableLink',
          type: 'checkbox',
        },
        link({
          overrides: {
            admin: {
              condition: (_data, siblingData) => Boolean(siblingData?.enableLink),
            },
          },
        }),
      ],
    },
  ],
}
