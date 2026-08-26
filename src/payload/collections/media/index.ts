import type { CollectionConfig } from 'payload'

import { anyone } from '@/payload/access/anyone'
import { authenticated, authenticatedFieldAccess } from '@/payload/access/authenticated'
import { hashedFilename } from '@/lib/media-filename'

import { computeChecksum } from './hooks/compute-checksum'
import { flagOwnDuplicate } from './hooks/flag-own-duplicate'
import {
  flagDuplicateAfterChange,
  flagDuplicateAfterDelete,
} from './hooks/flag-duplicate'

/** Quality 80 is the usual sweet spot: no visible artefacts, big size win. */
const WEBP = { format: 'webp', options: { quality: 80 } } as const

/**
 * Uploaded images and files. Stored in Cloudflare R2; `sharp` generates the
 * sizes below at upload time on the Node runtime.
 *
 * `alt` is required at the schema level, so it cannot be skipped from the
 * panel, the API, or a seed script.
 *
 * `folders: true` turns on Payload's built-in folder browser for this
 * collection (checked against the installed 3.86 API — the newer
 * `createFolderField()` helper isn't in this version yet).
 */
export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Content',
    defaultColumns: ['filename', 'alt', 'duplicateStatus'],
    components: {
      edit: {
        // Above-the-fold notice — reasoning in ADR 0005.
        beforeDocumentControls: [
          '@/payload/admin/components/media-duplicates/has-duplicate-pill#HasDuplicatePill',
        ],
      },
    },
  },
  folders: true,
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },

  hooks: {
    // Content-hash the name before Payload derives the size variants' names
    // from it — rationale in `hashedFilename`.
    beforeOperation: [
      ({ operation, req }) => {
        if (operation !== 'create' && operation !== 'update') return
        if (!req.file) return

        req.file.name = hashedFilename(req.file.name, req.file.data)
      },
      computeChecksum,
    ],
    beforeChange: [flagOwnDuplicate],
    afterChange: [flagDuplicateAfterChange],
    afterDelete: [flagDuplicateAfterDelete],
  },
  upload: {
    mimeTypes: ['image/*', 'application/pdf'],
    focalPoint: true,

    // Everything becomes WebP, whatever was uploaded. Without this Payload
    // preserves the source format, and a photo saved as PNG produced a 4.7 MB
    // "wide" variant in testing. Staff upload whatever their phone or camera
    // produced; the format decision cannot be left to them.
    //
    // Note this option is NOT inherited — it applies to the original only, so
    // every entry in `imageSizes` has to repeat it.
    formatOptions: WEBP,

    // Widths step roughly 2x so `srcset` has meaningful choices: card-sized,
    // half-width, and full-bleed. Heights are unset so aspect ratio is kept —
    // cropping is the focal point's job, not the resize's.
    // Payload skips any size larger than the original rather than upscaling.
    imageSizes: [
      { name: 'thumbnail', width: 400, position: 'centre', formatOptions: WEBP },
      { name: 'card', width: 800, position: 'centre', formatOptions: WEBP },
      { name: 'wide', width: 1600, position: 'centre', formatOptions: WEBP },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'alt',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
            // Doubles as the caption where a block renders one — one text
            // field, not two to keep in sync. See ADR 0005 addendum.
            description:
              'Describe the image for someone who cannot see it — also shown as the caption where a block supports one. If purely decorative, write "Decorative".',
          },
        },
        {
          name: 'tags',
          type: 'relationship',
          relationTo: 'media-tags',
          hasMany: true,
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'checksum',
      type: 'text',
      index: true,
      // Authenticated-only: sole ground truth for duplicate grouping, no
      // reason for it to appear in a public API response.
      access: { read: authenticatedFieldAccess },
      admin: { hidden: true },
    },
    {
      type: 'ui',
      name: 'duplicateStatus',
      admin: {
        condition: (data) => Boolean(data?.hasDuplicate),
        components: {
          Cell: '@/payload/admin/components/media-duplicates/has-duplicate-cell#HasDuplicateCell',
        },
      },
    },
    {
      name: 'hasDuplicate',
      type: 'checkbox',
      label: 'Has Duplicate(s)?',
      defaultValue: false,
      index: true,
      access: { read: authenticatedFieldAccess },
      admin: {
        condition: (data) => Boolean(data?.hasDuplicate),
        readOnly: true,
        components: {
          Field:
            '@/payload/admin/components/media-duplicates/list-duplicate-media#ListDuplicateMedia',
        },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'duplicateDismissed',
          type: 'checkbox',
          label: 'Dismiss Duplicate(s)?',
          defaultValue: false,
          access: { read: authenticatedFieldAccess },
          admin: {
            condition: (data) => Boolean(data?.hasDuplicate),
            width: '50%',
            description:
              'Check once reviewed and confirmed this is not actually a duplicate. Clears the flag for this asset only, not the duplicate siblings.',
          },
        },
      ],
    },
  ],
}
