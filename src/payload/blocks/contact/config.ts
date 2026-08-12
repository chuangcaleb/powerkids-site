import type { Block } from 'payload'
import { headerField } from '@/payload/fields/header'

/**
 * Hours, email, phones, socials — all from `site-settings`/`navigation`
 * globals, no per-instance content fields. Primitive: `switcher`.
 */
export const Contact: Block = {
  slug: 'contact',
  interfaceName: 'ContactBlock',
  labels: { singular: 'Contact', plural: 'Contact Blocks' },
  fields: [headerField()],
}
