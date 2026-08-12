import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_framed_rows_header_accent" AS ENUM('neutral', 'red', 'blue');
  CREATE TYPE "public"."enum__pages_v_blocks_framed_rows_header_accent" AS ENUM('neutral', 'red', 'blue');
  ALTER TABLE "pages_blocks_framed_rows" ADD COLUMN "header_eyebrow" varchar;
  ALTER TABLE "pages_blocks_framed_rows" ADD COLUMN "header_accent" "enum_pages_blocks_framed_rows_header_accent" DEFAULT 'neutral';
  ALTER TABLE "pages_blocks_framed_rows" ADD COLUMN "header_heading" jsonb;
  ALTER TABLE "pages_blocks_framed_rows" ADD COLUMN "header_subheading" jsonb;
  ALTER TABLE "_pages_v_blocks_framed_rows" ADD COLUMN "header_eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_framed_rows" ADD COLUMN "header_accent" "enum__pages_v_blocks_framed_rows_header_accent" DEFAULT 'neutral';
  ALTER TABLE "_pages_v_blocks_framed_rows" ADD COLUMN "header_heading" jsonb;
  ALTER TABLE "_pages_v_blocks_framed_rows" ADD COLUMN "header_subheading" jsonb;
  ALTER TABLE "pages_blocks_framed_rows" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_framed_rows" DROP COLUMN "heading";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_framed_rows" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_framed_rows" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_framed_rows" DROP COLUMN "header_eyebrow";
  ALTER TABLE "pages_blocks_framed_rows" DROP COLUMN "header_accent";
  ALTER TABLE "pages_blocks_framed_rows" DROP COLUMN "header_heading";
  ALTER TABLE "pages_blocks_framed_rows" DROP COLUMN "header_subheading";
  ALTER TABLE "_pages_v_blocks_framed_rows" DROP COLUMN "header_eyebrow";
  ALTER TABLE "_pages_v_blocks_framed_rows" DROP COLUMN "header_accent";
  ALTER TABLE "_pages_v_blocks_framed_rows" DROP COLUMN "header_heading";
  ALTER TABLE "_pages_v_blocks_framed_rows" DROP COLUMN "header_subheading";
  DROP TYPE "public"."enum_pages_blocks_framed_rows_header_accent";
  DROP TYPE "public"."enum__pages_v_blocks_framed_rows_header_accent";`)
}
