import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   UPDATE "enquiries" SET "status" = 'unread' WHERE "status" IS NULL;
  ALTER TABLE "enquiries" ALTER COLUMN "status" SET NOT NULL;
  ALTER TABLE "enquiries" ADD COLUMN "admin_title" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "enquiries" ALTER COLUMN "status" DROP NOT NULL;
  ALTER TABLE "enquiries" DROP COLUMN "admin_title";`)
}
