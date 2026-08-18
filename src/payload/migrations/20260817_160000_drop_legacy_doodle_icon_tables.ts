import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Second half of the icon enum→text change. `20260817_154407` deliberately left
 * the legacy `doodleIcons` enum tables in place so the only copy of those
 * selections survived until `scripts/backfill-doodle-icons.ts` rewrote them into
 * `pages_texts` through the Local API. With that done, the tables hold nothing
 * the app reads.
 *
 * Hand-written: from drizzle's point of view the schema already matches the
 * previous snapshot, so `migrate:create` emits nothing for this cleanup.
 *
 * Not reversible in the sense that matters — `down` restores the tables and
 * enum types, but the rows are gone; the data lives in `pages_texts` now.
 */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "pages_blocks_scrapbook_items_doodle_icons" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_scrapbook_items_doodle_icons" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_scrapbook_items_doodle_icons";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_scrapbook_items_doodle_icons";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_pages_blocks_scrapbook_items_doodle_icons" AS ENUM('star', 'sun', 'cloud', 'sparkles', 'smile', 'feather', 'music', 'rocket', 'palette', 'pen-line', 'zap', 'rainbow', 'flower');
    CREATE TYPE "public"."enum__pages_v_blocks_scrapbook_items_doodle_icons" AS ENUM('star', 'sun', 'cloud', 'sparkles', 'smile', 'feather', 'music', 'rocket', 'palette', 'pen-line', 'zap', 'rainbow', 'flower');

    CREATE TABLE "pages_blocks_scrapbook_items_doodle_icons" (
      "order" integer NOT NULL,
      "parent_id" varchar NOT NULL,
      "value" "enum_pages_blocks_scrapbook_items_doodle_icons",
      "id" serial PRIMARY KEY NOT NULL
    );

    CREATE TABLE "_pages_v_blocks_scrapbook_items_doodle_icons" (
      "order" integer NOT NULL,
      "parent_id" integer NOT NULL,
      "value" "enum__pages_v_blocks_scrapbook_items_doodle_icons",
      "id" serial PRIMARY KEY NOT NULL
    );

    ALTER TABLE "pages_blocks_scrapbook_items_doodle_icons" ADD CONSTRAINT "pages_blocks_scrapbook_items_doodle_icons_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_scrapbook_items"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "_pages_v_blocks_scrapbook_items_doodle_icons" ADD CONSTRAINT "_pages_v_blocks_scrapbook_items_doodle_icons_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_scrapbook_items"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "pages_blocks_scrapbook_items_doodle_icons_order_idx" ON "pages_blocks_scrapbook_items_doodle_icons" USING btree ("order");
    CREATE INDEX "pages_blocks_scrapbook_items_doodle_icons_parent_idx" ON "pages_blocks_scrapbook_items_doodle_icons" USING btree ("parent_id");
    CREATE INDEX "_pages_v_blocks_scrapbook_items_doodle_icons_order_idx" ON "_pages_v_blocks_scrapbook_items_doodle_icons" USING btree ("order");
    CREATE INDEX "_pages_v_blocks_scrapbook_items_doodle_icons_parent_idx" ON "_pages_v_blocks_scrapbook_items_doodle_icons" USING btree ("parent_id");
  `)
}
