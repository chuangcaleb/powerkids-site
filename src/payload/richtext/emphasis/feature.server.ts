import { createServerFeature } from '@payloadcms/richtext-lexical'

/**
 * Hand-drawn double-underline mark for section-header heading/lead
 * fields. Lexical's TextNode format is a fixed bitmask (bold/italic/
 * underline/strikethrough/code/sub/superscript) — there's no way to add a
 * genuinely new format bit without forking TextNode, so this reuses the
 * `underline` bit and restyles it via `EmphasisFeatureClient` (toolbar) and
 * `emphasisTextConverter` (render output) instead of ever showing a plain
 * underline to an editor or a visitor.
 */
export const EmphasisFeature = createServerFeature({
  feature: {
    ClientFeature: '@/payload/richtext/emphasis/feature.client#EmphasisFeatureClient',
  },
  key: 'emphasis',
})
