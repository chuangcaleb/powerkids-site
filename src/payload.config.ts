import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Events } from '@/collections/events'
import { Media } from '@/collections/media'
import { Pages } from '@/collections/pages'
import { People } from '@/collections/people'
import { Programs } from '@/collections/programs'
import { Schools } from '@/collections/schools'
import { Users } from '@/collections/users'
import { Navigation } from '@/globals/navigation'
import { SeoDefaults } from '@/globals/seo-defaults'
import { SiteSettings } from '@/globals/site-settings'
import { S3_REGION, isProduction, requireEnv } from '@/lib/env'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— PowerKids',
    },
  },

  collections: [Users, Media, Pages, Schools, Programs, Events, People],

  globals: [SiteSettings, Navigation, SeoDefaults],

  editor: lexicalEditor(),

  db: postgresAdapter({
    pool: { connectionString: requireEnv('DATABASE_URI') },
    // Production applies committed migrations only. Dev pushes schema
    // automatically so iterating on fields does not need a migration each
    // time — see docs/ops/migrations.md.
    push: !isProduction,
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
