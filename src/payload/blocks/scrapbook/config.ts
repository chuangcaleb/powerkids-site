import type { Block } from 'payload'
import { buttonField } from '@/payload/fields/button'
import { headerField, withHeaderTabs } from '@/payload/fields/header'
import { iconField } from '@/payload/fields/icon'

/**
 * Photo-collage recap of past activity — one "item" (an event, camp, class)
 * per entry, each with its own photos, short copy and an optional link. The
 * heavy lifting (lane count, packing, reel/stacked fallback) lives in the
 * renderer; this only shapes what an editor authors. See
 * `docs/architecture/blocks.md` for the closed-set rules this follows.
 *
 * No collection-backed `source` toggle (contrast `gallery`):
 * there's no collection of past one-off camps/showcases to pull from — each
 * item's photos are specific to that occasion and exist nowhere else.
 */
export const ScrapbookBlock: Block = {
  slug: 'scrapbook',
  interfaceName: 'ScrapbookBlock',
  labels: { singular: 'Scrapbook', plural: 'Scrapbook Blocks' },
  fields: withHeaderTabs([
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      // Soft cap — the collage stays readable well past this, but an editor
      // adding a 7th item is very likely reaching for a new instance instead.
      maxRows: 6,
      admin: {
        components: {
          RowLabel:
            '@/payload/admin/components/row-labels/scrapbook-row-label#ScrapbookRowLabel',
        },
      },
      fields: [
        {
          type: 'tabs',
          tabs: [
            {
              label: 'Content',
              fields: [
                // Eyebrow suppressed: a pill per item, repeated up to six
                // times, is noise the section-level header already covers.
                headerField({ showEyebrow: false }),
                buttonField(),
              ],
            },
            {
              label: 'Graphics',
              fields: [
                // Above the photo list on purpose: the list grows to eight rows,
                // and a field below it is easy to miss entirely.
                iconField({
                  name: 'icons',
                  hasMany: true,
                  description:
                    "Decorative doodles scattered around this item's text. Leave empty to skip.",
                }),
                {
                  name: 'media',
                  type: 'upload',
                  relationTo: 'media',
                  hasMany: true,
                  required: true,
                  minRows: 1,
                  maxRows: 8,
                  admin: {
                    description: 'Photos for this item. Drag to reorder.',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'seed',
      type: 'text',
      admin: {
        description:
          'Seeds the collage’s random arrangement (stagger, jitter, tilt, photo sizes). Shuffle to preview a different roll, then save to keep it — otherwise the layout is stable per page, not re-rolled on every visit.',
        components: { Field: '@/payload/admin/components/seed-field#SeedField' },
      },
    },
  ]),
}
