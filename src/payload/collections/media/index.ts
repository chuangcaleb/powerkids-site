import type { CollectionConfig } from 'payload'

import { anyone } from '@/payload/access/anyone'
import { authenticated } from '@/payload/access/authenticated'
import { hashedFilename } from '@/lib/media-filename'

/** Quality 80 is the usual sweet spot: no visible artefacts, big size win. */
const WEBP = { format: 'webp', options: { quality: 80 } } as const

/**
 * Uploaded images and files. Stored in Cloudflare R2; `sharp` generates the
 * sizes below at upload time on the Node runtime.
 *
 * `alt` is required at the schema level, so it cannot be skipped from the
 * panel, the API, or a seed script. The v3 site shipped image-only brochure
 * scans with empty alt text — see docs/reference/content-inventory.md. That
 * class of defect is not possible here.
 *
 * `folders: true` turns on Payload's built-in folder browser for this
 * collection (checked against the installed 3.86 API — the newer
 * `createFolderField()` helper isn't in this version yet).
 */
export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Content',
    description: 'Photos and files used across the site.',
  },
  folders: true,
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },

  hooks: {
    // Rename every upload to include a hash of its content, before Payload
    // derives the size variants' names from it.
    //
    // Media is served from a long-cached CDN domain. Without this, replacing a
    // photo reuses the filename, the edge keeps serving the old bytes, and the
    // editor sees their change do nothing. Content-addressed names make a
    // replacement a different URL, so it appears immediately.
    beforeOperation: [
      ({ operation, req }) => {
        if (operation !== 'create' && operation !== 'update') return
        if (!req.file) return

        req.file.name = hashedFilename(req.file.name, req.file.data)
      },
    ],
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
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description:
          'Describe the image for someone who cannot see it. If the image is purely decorative, write "Decorative".',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Optional. Shown beneath the image where a block supports it.',
      },
    },
  ],
}
