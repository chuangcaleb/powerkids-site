import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from '@payloadcms/db-vercel-postgres'

/**
 * Icon fields move from `select` (Postgres enum) to `text` validated in code, so
 * growing the icon set stops needing a migration. Stored values become lucide
 * export names: `pen-line` → `PenLine`, `smile` → `FaceSlightlySmiling`.
 *
 * Hand-edited from the generated SQL, which dropped
 * `pages_blocks_scrapbook_items_doodle_icons` outright — the `hasMany` values
 * live in the new shared `pages_texts` table, and nothing copied them across.
 * Following the additive-first rule in `docs/ops/migrations.md`, this step only
 * adds and rewrites; `scripts/backfill-doodle-icons.ts` republishes the doodle
 * selections through the Local API (which is what knows how to build a
 * `pages_texts.path`), and a later migration drops the emptied tables.
 *
 * `zap` and `rainbow` have no replacement in the new set and become NULL.
 * `payload run scripts/audit-icon-usage.ts` reported neither in any page before
 * this ran.
 */

/** Legacy select value → lucide export name. */
const RENAMES: Record<string, string> = {
  star: 'Star',
  sun: 'Sun',
  sunrise: 'Sunrise',
  sunset: 'Sunset',
  cloud: 'Cloud',
  sparkles: 'Sparkles',
  smile: 'FaceSlightlySmiling',
  feather: 'Feather',
  flower: 'Flower',
  music: 'Music',
  palette: 'Palette',
  'pen-line': 'PenLine',
  rocket: 'Rocket',
}

const ICON_TABLES = ['pages_blocks_framed_rows_rows', '_pages_v_blocks_framed_rows_rows']

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // New home for `hasMany` text values, one shared table per collection.
  await db.execute(sql`
    CREATE TABLE "pages_texts" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer NOT NULL,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "text" varchar
    );

    CREATE TABLE "_pages_v_texts" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer NOT NULL,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "text" varchar
    );

    ALTER TABLE "pages_texts" ADD CONSTRAINT "pages_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "_pages_v_texts" ADD CONSTRAINT "_pages_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "pages_texts_order_parent" ON "pages_texts" USING btree ("order","parent_id");
    CREATE INDEX "_pages_v_texts_order_parent" ON "_pages_v_texts" USING btree ("order","parent_id");
  `)

  // Enum → varchar keeps the existing values, so they need renaming in place.
  for (const table of ICON_TABLES) {
    await db.execute(
      sql.raw(`ALTER TABLE "${table}" ALTER COLUMN "icon" SET DATA TYPE varchar;`),
    )
    for (const [legacy, next] of Object.entries(RENAMES)) {
      await db.execute(
        sql.raw(`UPDATE "${table}" SET "icon" = '${next}' WHERE "icon" = '${legacy}';`),
      )
    }
    // Cut from the set with nothing to map to. NULL is a valid empty icon.
    await db.execute(
      sql.raw(`UPDATE "${table}" SET "icon" = NULL WHERE "icon" IN ('zap', 'rainbow');`),
    )
  }

  await db.execute(sql`
    DROP TYPE "public"."enum_pages_blocks_framed_rows_rows_icon";
    DROP TYPE "public"."enum__pages_v_blocks_framed_rows_rows_icon";
  `)

  // Deliberately NOT dropped here: pages_blocks_scrapbook_items_doodle_icons,
  // _pages_v_blocks_scrapbook_items_doodle_icons, and their enum types. They
  // still hold the only copy of the doodle selections until the backfill runs.
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_pages_blocks_framed_rows_rows_icon" AS ENUM('sunrise', 'sun', 'sunset', 'star', 'cloud', 'sparkles', 'smile', 'feather', 'music', 'rocket', 'palette', 'pen-line', 'zap', 'rainbow', 'flower');
    CREATE TYPE "public"."enum__pages_v_blocks_framed_rows_rows_icon" AS ENUM('sunrise', 'sun', 'sunset', 'star', 'cloud', 'sparkles', 'smile', 'feather', 'music', 'rocket', 'palette', 'pen-line', 'zap', 'rainbow', 'flower');
  `)

  for (const table of ICON_TABLES) {
    for (const [legacy, next] of Object.entries(RENAMES)) {
      await db.execute(
        sql.raw(`UPDATE "${table}" SET "icon" = '${legacy}' WHERE "icon" = '${next}';`),
      )
    }
    // Anything picked from the widened set has no legacy equivalent to go back to.
    await db.execute(
      sql.raw(
        `UPDATE "${table}" SET "icon" = NULL WHERE "icon" IS NOT NULL AND "icon" NOT IN (${Object.keys(
          RENAMES,
        )
          .map((value) => `'${value}'`)
          .join(', ')});`,
      ),
    )
    const enumType =
      table === 'pages_blocks_framed_rows_rows'
        ? 'enum_pages_blocks_framed_rows_rows_icon'
        : 'enum__pages_v_blocks_framed_rows_rows_icon'
    await db.execute(
      sql.raw(
        `ALTER TABLE "${table}" ALTER COLUMN "icon" SET DATA TYPE "public"."${enumType}" USING "icon"::"public"."${enumType}";`,
      ),
    )
  }

  await db.execute(sql`
    ALTER TABLE "pages_texts" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "_pages_v_texts" DISABLE ROW LEVEL SECURITY;
    DROP TABLE "pages_texts" CASCADE;
    DROP TABLE "_pages_v_texts" CASCADE;
  `)
}
