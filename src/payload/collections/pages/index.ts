import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

import { authenticated } from '@/payload/access/authenticated'
import { authenticatedOrPublished } from '@/payload/access/authenticated-or-published'
import { requireEnv } from '@/lib/env'
import { Content } from '@/payload/blocks/content/config'
import { FramedRowsBlock } from '@/payload/blocks/framed-rows/config'
import { Gallery } from '@/payload/blocks/gallery/config'
import { Locations } from '@/payload/blocks/locations/config'
import { MediaText } from '@/payload/blocks/media-text/config'
import { ScrapbookBlock } from '@/payload/blocks/scrapbook/config'

import { hero } from './hero'
import { populatePublishedAt } from './hooks/populate-published-at'
import { revalidateDelete, revalidatePage } from './hooks/revalidate-page'

/**
 * Shared by the "Preview" button and the Live Preview iframe. Both must route
 * through `/preview` rather than link straight to the page path — that route
 * is what calls `draftMode().enable()`, and without it the page renders
 * published data and `LivePreviewListener` (gated on `draft`) never mounts, so
 * live preview looks broken while silently serving the published page.
 *
 * Relative, no origin, matching the template's `generatePreviewPath`: an
 * absolute URL built from `NEXT_PUBLIC_SERVER_URL` silently breaks the
 * moment the admin panel is actually served from a different host/port
 * than that env var declares (auto-bumped dev port, different hostname,
 * a proxy) — the iframe's real origin and the postMessage origin check in
 * `RefreshRouteOnSave` stop matching, and updates drop with no error. A
 * relative path always resolves against whatever origin is actually
 * serving the admin panel.
 */
function previewUrl(slug: unknown) {
  const params = new URLSearchParams({
    secret: requireEnv('PREVIEW_SECRET'),
    slug: typeof slug === 'string' ? slug : '',
  })
  return `/preview?${params.toString()}`
}

/** Editor-composed routes. `layout` is the closed set — hero is not one of them, see ./hero.ts. */
export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status'],
    group: 'Content',
    preview: (doc) => previewUrl(doc?.slug),
    livePreview: {
      url: ({ data }) => previewUrl(data?.slug),
    },
  },
  // Server-side Live Preview (`RefreshRouteOnSave`) only refreshes the iframe
  // on an actual save — draft save, autosave, or publish — never on a bare
  // keystroke. Without autosave, "Live Preview isn't updating" looks
  // identical to a wiring bug: nothing ever fires the save that would
  // trigger a refresh.
  versions: {
    drafts: { autosave: true },
    maxPerDoc: 20,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        { fields: [hero], label: 'Hero' },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              required: true,
              admin: { initCollapsed: true },
              blocks: [
                Content,
                MediaText,
                Gallery,
                FramedRowsBlock,
                ScrapbookBlock,
                Locations,
              ],
            },
          ],
          label: 'Content',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({ hasGenerateFn: true }),
            MetaImageField({ relationTo: 'media' }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    afterDelete: [revalidateDelete],
    beforeChange: [populatePublishedAt],
  },
}
