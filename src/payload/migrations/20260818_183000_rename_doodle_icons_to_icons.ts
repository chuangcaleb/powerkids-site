import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Scrapbook's `doodleIcons` becomes `icons`, matching the `icon`/`icons` naming
 * the field factory uses everywhere else.
 *
 * No schema change: `hasMany` text lives in the shared `pages_texts` tables,
 * keyed by a `path` naming the field's position in the document
 * (`layout.2.items.0.doodleIcons`). Renaming the field means rewriting that
 * suffix, or the values stop resolving and the field reads empty.
 */

const TABLES = ['pages_texts', '_pages_v_texts']

async function renamePath(
  db: MigrateUpArgs['db'] | MigrateDownArgs['db'],
  from: string,
  to: string,
): Promise<void> {
  for (const table of TABLES) {
    await db.execute(
      sql.raw(
        `UPDATE "${table}" SET "path" = regexp_replace("path", '\\.${from}$', '.${to}') WHERE "path" LIKE '%.${from}';`,
      ),
    )
  }
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await renamePath(db, 'doodleIcons', 'icons')
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await renamePath(db, 'icons', 'doodleIcons')
}
