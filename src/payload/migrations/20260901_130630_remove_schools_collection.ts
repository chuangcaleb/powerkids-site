import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_schools" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_schools" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "schools_phones" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "schools" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_schools_v_version_phones" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_schools_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_schools" CASCADE;
  DROP TABLE "_pages_v_blocks_schools" CASCADE;
  DROP TABLE "schools_phones" CASCADE;
  DROP TABLE "schools" CASCADE;
  DROP TABLE "_schools_v_version_phones" CASCADE;
  DROP TABLE "_schools_v" CASCADE;
  DROP INDEX "people_school_idx";
  DROP INDEX "_people_v_version_version_school_idx";
  DROP INDEX "payload_locked_documents_rels_schools_id_idx";
  ALTER TABLE "people" DROP COLUMN "school_id";
  ALTER TABLE "_people_v" DROP COLUMN "version_school_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "schools_id";
  DROP TYPE "public"."enum_pages_blocks_schools_header_accent";
  DROP TYPE "public"."enum__pages_v_blocks_schools_header_accent";
  DROP TYPE "public"."enum_schools_status";
  DROP TYPE "public"."enum__schools_v_version_status";
  DROP TYPE "public"."enum__schools_v_published_locale";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_schools_header_accent" AS ENUM('neutral', 'red', 'blue');
  CREATE TYPE "public"."enum__pages_v_blocks_schools_header_accent" AS ENUM('neutral', 'red', 'blue');
  CREATE TYPE "public"."enum_schools_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__schools_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__schools_v_published_locale" AS ENUM('en');
  CREATE TABLE "pages_blocks_schools" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"header_eyebrow" varchar,
  	"header_accent" "enum_pages_blocks_schools_header_accent" DEFAULT 'neutral',
  	"header_heading" jsonb,
  	"header_lead" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_schools" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"header_eyebrow" varchar,
  	"header_accent" "enum__pages_v_blocks_schools_header_accent" DEFAULT 'neutral',
  	"header_heading" jsonb,
  	"header_lead" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "schools_phones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "schools" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"address" varchar,
  	"map_url" varchar,
  	"photo_id" integer,
  	"principal_id" integer,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_schools_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_schools_v_version_phones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_schools_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_address" varchar,
  	"version_map_url" varchar,
  	"version_photo_id" integer,
  	"version_principal_id" integer,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__schools_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__schools_v_published_locale",
  	"latest" boolean
  );
  
  ALTER TABLE "people" ADD COLUMN "school_id" integer;
  ALTER TABLE "_people_v" ADD COLUMN "version_school_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "schools_id" integer;
  ALTER TABLE "pages_blocks_schools" ADD CONSTRAINT "pages_blocks_schools_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_schools" ADD CONSTRAINT "_pages_v_blocks_schools_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "schools_phones" ADD CONSTRAINT "schools_phones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "schools" ADD CONSTRAINT "schools_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "schools" ADD CONSTRAINT "schools_principal_id_people_id_fk" FOREIGN KEY ("principal_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_schools_v_version_phones" ADD CONSTRAINT "_schools_v_version_phones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_schools_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_schools_v" ADD CONSTRAINT "_schools_v_parent_id_schools_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_schools_v" ADD CONSTRAINT "_schools_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_schools_v" ADD CONSTRAINT "_schools_v_version_principal_id_people_id_fk" FOREIGN KEY ("version_principal_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_schools_order_idx" ON "pages_blocks_schools" USING btree ("_order");
  CREATE INDEX "pages_blocks_schools_parent_id_idx" ON "pages_blocks_schools" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_schools_path_idx" ON "pages_blocks_schools" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_schools_order_idx" ON "_pages_v_blocks_schools" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_schools_parent_id_idx" ON "_pages_v_blocks_schools" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_schools_path_idx" ON "_pages_v_blocks_schools" USING btree ("_path");
  CREATE INDEX "schools_phones_order_idx" ON "schools_phones" USING btree ("_order");
  CREATE INDEX "schools_phones_parent_id_idx" ON "schools_phones" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "schools_slug_idx" ON "schools" USING btree ("slug");
  CREATE INDEX "schools_photo_idx" ON "schools" USING btree ("photo_id");
  CREATE INDEX "schools_principal_idx" ON "schools" USING btree ("principal_id");
  CREATE INDEX "schools_updated_at_idx" ON "schools" USING btree ("updated_at");
  CREATE INDEX "schools_created_at_idx" ON "schools" USING btree ("created_at");
  CREATE INDEX "schools__status_idx" ON "schools" USING btree ("_status");
  CREATE INDEX "_schools_v_version_phones_order_idx" ON "_schools_v_version_phones" USING btree ("_order");
  CREATE INDEX "_schools_v_version_phones_parent_id_idx" ON "_schools_v_version_phones" USING btree ("_parent_id");
  CREATE INDEX "_schools_v_parent_idx" ON "_schools_v" USING btree ("parent_id");
  CREATE INDEX "_schools_v_version_version_slug_idx" ON "_schools_v" USING btree ("version_slug");
  CREATE INDEX "_schools_v_version_version_photo_idx" ON "_schools_v" USING btree ("version_photo_id");
  CREATE INDEX "_schools_v_version_version_principal_idx" ON "_schools_v" USING btree ("version_principal_id");
  CREATE INDEX "_schools_v_version_version_updated_at_idx" ON "_schools_v" USING btree ("version_updated_at");
  CREATE INDEX "_schools_v_version_version_created_at_idx" ON "_schools_v" USING btree ("version_created_at");
  CREATE INDEX "_schools_v_version_version__status_idx" ON "_schools_v" USING btree ("version__status");
  CREATE INDEX "_schools_v_created_at_idx" ON "_schools_v" USING btree ("created_at");
  CREATE INDEX "_schools_v_updated_at_idx" ON "_schools_v" USING btree ("updated_at");
  CREATE INDEX "_schools_v_snapshot_idx" ON "_schools_v" USING btree ("snapshot");
  CREATE INDEX "_schools_v_published_locale_idx" ON "_schools_v" USING btree ("published_locale");
  CREATE INDEX "_schools_v_latest_idx" ON "_schools_v" USING btree ("latest");
  ALTER TABLE "people" ADD CONSTRAINT "people_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_people_v" ADD CONSTRAINT "_people_v_version_school_id_schools_id_fk" FOREIGN KEY ("version_school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_schools_fk" FOREIGN KEY ("schools_id") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "people_school_idx" ON "people" USING btree ("school_id");
  CREATE INDEX "_people_v_version_version_school_idx" ON "_people_v" USING btree ("version_school_id");
  CREATE INDEX "payload_locked_documents_rels_schools_id_idx" ON "payload_locked_documents_rels" USING btree ("schools_id");`)
}
