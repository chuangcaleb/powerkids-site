import type { Block } from 'payload'

/**
 * Renders the `programs` collection as three tilted, alternating rows inside
 * a bordered band — no per-instance content fields, per the "no content
 * defaults pretending to be design" rule (see `schools` block). Colour and
 * tilt are assigned by position, not authored in the CMS. Capped at 3 items
 * (D-11: the three programs are peers, no size hierarchy). Named for the
 * visual pattern, not the content — the "framed band" layout from
 * `04-open-knobs.md` K-07 — since a block name is part of the closed set the
 * owner reviews, not a description of today's only consumer.
 */
export const FramedRowsBlock: Block = {
  slug: 'framed-rows',
  interfaceName: 'FramedRowsBlock',
  labels: { singular: 'Framed Rows', plural: 'Framed Rows Blocks' },
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
  ],
}
