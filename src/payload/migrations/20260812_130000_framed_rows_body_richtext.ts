import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_framed_rows_rows" DROP COLUMN "body";
  ALTER TABLE "pages_blocks_framed_rows_rows" ADD COLUMN "body" jsonb;
  ALTER TABLE "_pages_v_blocks_framed_rows_rows" DROP COLUMN "body";
  ALTER TABLE "_pages_v_blocks_framed_rows_rows" ADD COLUMN "body" jsonb;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_framed_rows_rows" DROP COLUMN "body";
  ALTER TABLE "pages_blocks_framed_rows_rows" ADD COLUMN "body" varchar;
  ALTER TABLE "_pages_v_blocks_framed_rows_rows" DROP COLUMN "body";
  ALTER TABLE "_pages_v_blocks_framed_rows_rows" ADD COLUMN "body" varchar;`)
}
