import type { Block } from 'payload'
import { headerField } from '@/payload/fields/header'

/**
 * Renders the `schools` collection in full — no per-instance content
 * fields, per the "no content defaults pretending to be design" rule.
 * Primitives: `grid-auto`, `switcher`.
 */
export const SchoolsBlock: Block = {
  slug: 'schools',
  interfaceName: 'SchoolsBlock',
  labels: { singular: 'Schools', plural: 'Schools Blocks' },
  fields: [headerField()],
}
