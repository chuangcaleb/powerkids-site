import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_settings_locations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"address" varchar NOT NULL,
  	"latitude" numeric NOT NULL,
  	"longitude" numeric NOT NULL
  );
  
  ALTER TABLE "site_settings" ADD COLUMN "locations_map_poster_id" integer;
  ALTER TABLE "site_settings_locations" ADD CONSTRAINT "site_settings_locations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_settings_locations_order_idx" ON "site_settings_locations" USING btree ("_order");
  CREATE INDEX "site_settings_locations_parent_id_idx" ON "site_settings_locations" USING btree ("_parent_id");
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_locations_map_poster_id_media_id_fk" FOREIGN KEY ("locations_map_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_settings_locations_map_poster_idx" ON "site_settings" USING btree ("locations_map_poster_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings_locations" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "site_settings_locations" CASCADE;
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_locations_map_poster_id_media_id_fk";
  
  DROP INDEX "site_settings_locations_map_poster_idx";
  ALTER TABLE "site_settings" DROP COLUMN "locations_map_poster_id";`)
}
