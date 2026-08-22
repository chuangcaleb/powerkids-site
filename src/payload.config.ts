import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { seoPlugin } from '@payloadcms/plugin-seo'
import type { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Media } from '@/payload/collections/media'
import { MediaTags } from '@/payload/collections/media-tags'
import { Pages } from '@/payload/collections/pages'
import { People } from '@/payload/collections/people'
import { Schools } from '@/payload/collections/schools'
import { Users } from '@/payload/collections/users'
import { defaultLexical } from '@/payload/fields/default-lexical'
import { Cta } from '@/payload/globals/cta'
import { Navigation } from '@/payload/globals/navigation'
import { SeoDefaults } from '@/payload/globals/seo-defaults'
import { SiteSettings } from '@/payload/globals/site-settings'
import { S3_REGION, requireEnv } from '@/lib/env'
import { getServerUrl } from '@/lib/get-server-url'
import { urlForSlug } from '@/lib/page-path'
import type { Page } from '@/payload-types'

const TITLE_SUFFIX = 'PowerKids Kindergarten: The Centre With A Heart'

const generateTitle: GenerateTitle<Page> = ({ doc }) =>
  doc?.title ? `${doc.title} | ${TITLE_SUFFIX}` : TITLE_SUFFIX

const generateURL: GenerateURL<Page> = ({ doc }) => urlForSlug(getServerUrl(), doc?.slug)

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  serverURL: getServerUrl(),

  // GraphQL is unused — this is a REST/Local API project. Disabling removes
  // an otherwise-open, unauthenticated query-complexity attack surface.
  graphQL: { disable: true },

  admin: {
    user: Users.slug,
    meta: {
      title: 'PowerKids Admin',
      description: 'Content management system for PowerKids Kindergarten.',
      titleSuffix: '— PowerKids',
      // Distinct from the public site's favicon (src/app/icon.png) so the
      // admin tab is visually distinguishable from the front-end site.
      icons: [
        { type: 'image/png', rel: 'icon', sizes: '16x16', url: '/admin-icon-16.png' },
        { type: 'image/png', rel: 'icon', sizes: '32x32', url: '/admin-icon-32.png' },
        { type: 'image/png', rel: 'icon', sizes: '48x48', url: '/admin-icon-48.png' },
        { rel: 'apple-touch-icon', url: '/apple-icon.png' },
      ],
    },
    livePreview: {
      url: getServerUrl(),
      collections: ['pages'],
    },
    components: {
      beforeDashboard: [
        '@/payload/admin/components/media-duplicates/duplicate-review-widget#DuplicateReviewWidget',
      ],
      graphics: {
        Logo: '@/payload/admin/components/graphics/logo#Logo',
        Icon: '@/payload/admin/components/graphics/icon#Icon',
      },
    },
  },

  collections: [Users, Media, MediaTags, Pages, Schools, People],

  globals: [SiteSettings, Navigation, SeoDefaults, Cta],

  folders: {},

  editor: defaultLexical,

  email: resendAdapter({
    defaultFromAddress: requireEnv('RESEND_FROM_ADDRESS'),
    defaultFromName: 'PowerKids Kindergarten',
    apiKey: requireEnv('RESEND_API_KEY'),
  }),

  db: vercelPostgresAdapter({
    pool: { connectionString: requireEnv('DATABASE_URI') },
    // Unconditionally false, dev included — push resolves structural diffs by
    // dropping and recreating tables, silently. See docs/ops/migrations.md.
    push: false,
    // Defaults to `<config dir>/migrations`; migrations live under
    // src/payload/ with the rest of the Payload-only code.
    migrationDir: path.resolve(dirname, 'payload/migrations'),
  }),

  plugins: [
    s3Storage({
      collections: {
        // Literal key, not `[Media.slug]`: a computed key is typed `string`,
        // which drops the contextual typing on the options below.
        media: {
          // Media is served from R2's public URL, not proxied through Next.
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) =>
            [requireEnv('R2_PUBLIC_URL'), prefix, filename].filter(Boolean).join('/'),
        },
      },
      bucket: requireEnv('S3_BUCKET'),
      config: {
        region: S3_REGION,
        endpoint: requireEnv('S3_ENDPOINT'),
        credentials: {
          accessKeyId: requireEnv('S3_ACCESS_KEY_ID'),
          secretAccessKey: requireEnv('S3_SECRET_ACCESS_KEY'),
        },
      },
    }),

    seoPlugin({ generateTitle, generateURL }),
  ],

  // Localisation is configured now with English as the only active locale, so
  // adding Bahasa Malaysia later is a config change rather than a migration of
  // every text field. See the phase plan.
  localization: {
    locales: [{ code: 'en', label: 'English' }],
    defaultLocale: 'en',
    fallback: true,
  },

  // Image processing. Available because the app runs on Vercel's Node
  // runtime — this is the reason the project is not on Workers.
  sharp,

  secret: requireEnv('PAYLOAD_SECRET'),
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
})
