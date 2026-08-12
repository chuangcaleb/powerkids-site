import type { Block } from 'payload'
import { withHeaderTabs } from '@/payload/fields/header'

/**
 * Alternating, tilted rows inside a bordered band — no per-instance content
 * defaults pretending to be design (see `schools` block). Colour and tilt
 * are assigned by position, not authored in the CMS. Named for the visual
 * pattern, not the content — the "framed band" layout from
 * `04-open-knobs.md` K-07 — since a block name is part of the closed set the
 * owner reviews, not a description of any one page's content.
 */
export const FramedRowsBlock: Block = {
  slug: 'framed-rows',
  interfaceName: 'FramedRowsBlock',
  labels: { singular: 'Framed Rows', plural: 'Framed Rows Blocks' },
  fields: withHeaderTabs([
    {
      name: 'rows',
      type: 'array',
      admin: {
        components: { RowLabel: '@/payload/admin/components/row-label#RowLabel' },
      },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'richText' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'icon',
          type: 'select',
          admin: {
            description: 'Icon shown above the eyebrow.',
          },
          options: [
            'sunrise',
            'sun',
            'sunset',
            'star',
            'cloud',
            'sparkles',
            'smile',
            'feather',
            'music',
            'rocket',
            'palette',
            'pen-line',
            'zap',
            'rainbow',
            'flower',
          ],
        },
        {
          name: 'eyebrow',
          type: 'text',
          admin: {
            description: 'Short label shown above the title, e.g. hours or a tagline.',
          },
        },
      ],
    },
  ]),
}
