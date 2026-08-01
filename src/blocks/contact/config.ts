import type { Block } from 'payload'

/**
 * Hours, email, phones, socials — all from `site-settings`/`navigation`
 * globals, no per-instance content fields. Primitive: `switcher`.
 */
export const Contact: Block = {
  slug: 'contact',
  labels: { singular: 'Contact', plural: 'Contact Blocks' },
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
  ],
}
