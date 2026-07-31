# Database and storage adapters

How `@payloadcms/db-postgres` and `@payloadcms/storage-s3` are configured, and how schema changes and transactions behave.

## Postgres adapter

```ts
import { postgresAdapter } from '@payloadcms/db-postgres'

export default buildConfig({
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI },
    push: process.env.NODE_ENV === 'development',
    migrationDir: './migrations',
  }),
})
```

Env var names and where each environment's `DATABASE_URI` points: see [environments.md](../ops/environments.md).

## Push vs. migrations

- `push: true` (dev only) lets Payload diff the schema and apply it directly — fast iteration, no migration files.
- Production must run committed migrations, never push. Set `push` off (or gate it on `NODE_ENV`) so a stray dev run against a shared database can't silently alter it.
- Migration authoring, the `migrate:create` / `migrate` command loop, and rename-safety rules: see [migrations.md](../ops/migrations.md).

## Transactions

Payload wraps each request in a Postgres transaction automatically. Any nested Local API call inside a hook must thread `req` through, or it runs outside the parent transaction and breaks atomicity:

```ts
import type { CollectionAfterChangeHook } from 'payload'

const afterChange: CollectionAfterChangeHook = async ({ doc, req }) => {
  await req.payload.create({
    collection: 'audit-log',
    data: { action: 'created', docId: doc.id },
    req, // required — keeps this in the same transaction
  })
}
```

Manual control (rarely needed):

```ts
const transactionID = await payload.db.beginTransaction()
try {
  await payload.update({ collection: 'orders', id, data, req: { transactionID } })
  await payload.db.commitTransaction(transactionID)
} catch (e) {
  await payload.db.rollbackTransaction(transactionID)
  throw e
}
```

Omitting `req` in a hook is safe only for read-only lookups or operations explicitly run with `overrideAccess: true` outside any request context (seeds, cron).

## S3-compatible storage (R2)

`@payloadcms/storage-s3` works against any S3-compatible endpoint, including Cloudflare R2 — set `endpoint` and use `region: 'auto'`.

```ts
import { s3Storage } from '@payloadcms/storage-s3'

export default buildConfig({
  plugins: [
    s3Storage({
      collections: { media: true },
      bucket: process.env.S3_BUCKET,
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
        region: process.env.S3_REGION, // 'auto' for R2, not a location hint
        endpoint: process.env.S3_ENDPOINT,
      },
    }),
  ],
})
```

Bucket names, credentials, and the public URL variable are owned by [environments.md](../ops/environments.md) — don't restate values here.

Other adapters (MongoDB, SQLite, Azure, GCS, Vercel Blob, Uploadthing) are unused here; see https://payloadcms.com/docs if that changes.
