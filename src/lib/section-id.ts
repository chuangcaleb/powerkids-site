import { slugify } from 'payload/shared'
import type { SectionHeaderData } from '@/components/section-header/section-header'
import { lexicalToPlainText } from '@/lib/lexical-to-plain-text'

/**
 * Derives a section's html `id` from its header: eyebrow first, falling back
 * to the heading text when eyebrow is absent or slugifies to nothing (e.g.
 * emoji-only). Returns undefined rather than a meaningless id when neither
 * yields usable text — the section then renders with no `id` at all.
 */
export function sectionId(header?: SectionHeaderData | null): string | undefined {
  if (!header) return undefined

  const eyebrowSlug = header.eyebrow ? slugify(header.eyebrow) : ''
  if (eyebrowSlug) return eyebrowSlug

  const headingText = lexicalToPlainText(header.heading)
  const headingSlug = headingText ? slugify(headingText) : ''
  return headingSlug || undefined
}
