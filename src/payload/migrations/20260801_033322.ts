import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ADD COLUMN "checksum" varchar;
  ALTER TABLE "media" ADD COLUMN "possible_duplicate_of_id" integer;
  ALTER TABLE "media" ADD CONSTRAINT "media_possible_duplicate_of_id_media_id_fk" FOREIGN KEY ("possible_duplicate_of_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "media_checksum_idx" ON "media" USING btree ("checksum");
  CREATE INDEX "media_possible_duplicate_of_idx" ON "media" USING btree ("possible_duplicate_of_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" DROP CONSTRAINT "media_possible_duplicate_of_id_media_id_fk";
  
  DROP INDEX "media_checksum_idx";
  DROP INDEX "media_possible_duplicate_of_idx";
  ALTER TABLE "media" DROP COLUMN "checksum";
  ALTER TABLE "media" DROP COLUMN "possible_duplicate_of_id";`)
}
