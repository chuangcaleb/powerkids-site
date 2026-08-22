#!/usr/bin/env node
/**
 * Repair the import line Payload's migration generator emits.
 *
 * The generator writes:
 *
 *   import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'
 *
 * but `MigrateUpArgs` and `MigrateDownArgs` are type-only exports. Under ESM
 * that import fails at runtime — `does not provide an export named
 * 'MigrateDownArgs'` — and `pnpm migrate` dies before applying anything.
 *
 * This runs automatically after `migrate:create`. It exists as a script rather
 * than a line in the docs because a manual step that is needed every single
 * time is a step that will eventually be forgotten, and the resulting error
 * points at the module system rather than at the real cause.
 *
 * Remove this once a Payload release fixes the generator.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const MIGRATIONS_DIR = path.join(process.cwd(), 'src/payload/migrations')

const BROKEN =
  /^import \{ MigrateUpArgs, MigrateDownArgs, sql \} from '@payloadcms\/db-postgres'$/m

const FIXED =
  "import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'"

const files = await readdir(MIGRATIONS_DIR).catch(() => [])
const migrations = files.filter((f) => f.endsWith('.ts') && f !== 'index.ts')

let fixed = 0

for (const file of migrations) {
  const filePath = path.join(MIGRATIONS_DIR, file)
  const source = await readFile(filePath, 'utf8')

  if (!BROKEN.test(source)) continue

  await writeFile(filePath, source.replace(BROKEN, FIXED))
  console.log(`fixed type-only import: src/payload/migrations/${file}`)
  fixed += 1
}

if (fixed === 0 && migrations.length > 0) {
  console.log('migration imports already correct')
}
