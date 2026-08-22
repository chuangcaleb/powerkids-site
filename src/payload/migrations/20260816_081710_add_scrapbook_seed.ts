import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_scrapbook" ADD COLUMN "seed" varchar;
  ALTER TABLE "_pages_v_blocks_scrapbook" ADD COLUMN "seed" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_scrapbook" DROP COLUMN "seed";
  ALTER TABLE "_pages_v_blocks_scrapbook" DROP COLUMN "seed";`)
}
