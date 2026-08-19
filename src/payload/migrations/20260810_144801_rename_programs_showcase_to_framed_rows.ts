import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * `programs-showcase` renamed to `framed-rows` — a block name describes the
 * visual pattern (see `src/payload/blocks/framed-rows/config.ts`), not its
 * one current consumer. Written as a real rename per docs/ops/migrations.md
 * — the generator's interactive prompt (create vs. rename) can't run
 * non-interactively, so this mirrors what it would have produced.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_programs_showcase" RENAME TO "pages_blocks_framed_rows";
  ALTER TABLE "_pages_v_blocks_programs_showcase" RENAME TO "_pages_v_blocks_framed_rows";
  ALTER TABLE "pages_blocks_framed_rows" RENAME CONSTRAINT "pages_blocks_programs_showcase_parent_id_fk" TO "pages_blocks_framed_rows_parent_id_fk";
  ALTER TABLE "_pages_v_blocks_framed_rows" RENAME CONSTRAINT "_pages_v_blocks_programs_showcase_parent_id_fk" TO "_pages_v_blocks_framed_rows_parent_id_fk";
  ALTER INDEX "pages_blocks_programs_showcase_order_idx" RENAME TO "pages_blocks_framed_rows_order_idx";
  ALTER INDEX "pages_blocks_programs_showcase_parent_id_idx" RENAME TO "pages_blocks_framed_rows_parent_id_idx";
  ALTER INDEX "pages_blocks_programs_showcase_path_idx" RENAME TO "pages_blocks_framed_rows_path_idx";
  ALTER INDEX "_pages_v_blocks_programs_showcase_order_idx" RENAME TO "_pages_v_blocks_framed_rows_order_idx";
  ALTER INDEX "_pages_v_blocks_programs_showcase_parent_id_idx" RENAME TO "_pages_v_blocks_framed_rows_parent_id_idx";
  ALTER INDEX "_pages_v_blocks_programs_showcase_path_idx" RENAME TO "_pages_v_blocks_framed_rows_path_idx";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_framed_rows" RENAME TO "pages_blocks_programs_showcase";
  ALTER TABLE "_pages_v_blocks_framed_rows" RENAME TO "_pages_v_blocks_programs_showcase";
  ALTER TABLE "pages_blocks_programs_showcase" RENAME CONSTRAINT "pages_blocks_framed_rows_parent_id_fk" TO "pages_blocks_programs_showcase_parent_id_fk";
  ALTER TABLE "_pages_v_blocks_programs_showcase" RENAME CONSTRAINT "_pages_v_blocks_framed_rows_parent_id_fk" TO "_pages_v_blocks_programs_showcase_parent_id_fk";
  ALTER INDEX "pages_blocks_framed_rows_order_idx" RENAME TO "pages_blocks_programs_showcase_order_idx";
  ALTER INDEX "pages_blocks_framed_rows_parent_id_idx" RENAME TO "pages_blocks_programs_showcase_parent_id_idx";
  ALTER INDEX "pages_blocks_framed_rows_path_idx" RENAME TO "pages_blocks_programs_showcase_path_idx";
  ALTER INDEX "_pages_v_blocks_framed_rows_order_idx" RENAME TO "_pages_v_blocks_programs_showcase_order_idx";
  ALTER INDEX "_pages_v_blocks_framed_rows_parent_id_idx" RENAME TO "_pages_v_blocks_programs_showcase_parent_id_idx";
  ALTER INDEX "_pages_v_blocks_framed_rows_path_idx" RENAME TO "_pages_v_blocks_programs_showcase_path_idx";`)
}
