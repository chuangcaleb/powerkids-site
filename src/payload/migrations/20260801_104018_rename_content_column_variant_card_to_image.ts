import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * The `content` block's variant enum dropped `card` and added `image`
 * (see `src/payload/blocks/content/config.ts`) without a migration — the
 * generator's default drop-and-recreate would have destroyed any row
 * already set to `card`. Rewritten as a real rename per
 * docs/ops/migrations.md; no data loss either way.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_blocks_content_columns_variant" RENAME VALUE 'card' TO 'image';
  ALTER TYPE "public"."enum__pages_v_blocks_content_columns_variant" RENAME VALUE 'card' TO 'image';`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_blocks_content_columns_variant" RENAME VALUE 'image' TO 'card';
  ALTER TYPE "public"."enum__pages_v_blocks_content_columns_variant" RENAME VALUE 'image' TO 'card';`)
}
