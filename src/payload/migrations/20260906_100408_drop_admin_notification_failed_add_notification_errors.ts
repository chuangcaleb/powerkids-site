import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "enquiries" ADD COLUMN "notification_errors" jsonb DEFAULT '[]'::jsonb;
  ALTER TABLE "enquiries" DROP COLUMN "admin_notification_failed";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "enquiries" ADD COLUMN "admin_notification_failed" boolean DEFAULT false;
  ALTER TABLE "enquiries" DROP COLUMN "notification_errors";`)
}
