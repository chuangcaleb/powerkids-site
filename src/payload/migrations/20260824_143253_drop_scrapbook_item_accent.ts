import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_scrapbook_items" DROP COLUMN "header_accent";
  ALTER TABLE "_pages_v_blocks_scrapbook_items" DROP COLUMN "header_accent";
  DROP TYPE "public"."enum_pages_blocks_scrapbook_items_header_accent";
  DROP TYPE "public"."enum__pages_v_blocks_scrapbook_items_header_accent";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_scrapbook_items_header_accent" AS ENUM('neutral', 'red', 'blue');
  CREATE TYPE "public"."enum__pages_v_blocks_scrapbook_items_header_accent" AS ENUM('neutral', 'red', 'blue');
  ALTER TABLE "pages_blocks_scrapbook_items" ADD COLUMN "header_accent" "enum_pages_blocks_scrapbook_items_header_accent" DEFAULT 'neutral';
  ALTER TABLE "_pages_v_blocks_scrapbook_items" ADD COLUMN "header_accent" "enum__pages_v_blocks_scrapbook_items_header_accent" DEFAULT 'neutral';`)
}
