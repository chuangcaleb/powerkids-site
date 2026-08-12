import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_steps" CASCADE;
  DROP TABLE "pages_blocks_cta_banner" CASCADE;
  DROP TABLE "pages_blocks_contact" CASCADE;
  DROP TABLE "_pages_v_blocks_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_banner" CASCADE;
  DROP TABLE "_pages_v_blocks_contact" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_steps_header_accent";
  DROP TYPE "public"."enum_pages_blocks_cta_banner_header_accent";
  DROP TYPE "public"."enum_pages_blocks_contact_header_accent";
  DROP TYPE "public"."enum__pages_v_blocks_steps_header_accent";
  DROP TYPE "public"."enum__pages_v_blocks_cta_banner_header_accent";
  DROP TYPE "public"."enum__pages_v_blocks_contact_header_accent";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_steps_header_accent" AS ENUM('neutral', 'red', 'blue');
  CREATE TYPE "public"."enum_pages_blocks_cta_banner_header_accent" AS ENUM('neutral', 'red', 'blue');
  CREATE TYPE "public"."enum_pages_blocks_contact_header_accent" AS ENUM('neutral', 'red', 'blue');
  CREATE TYPE "public"."enum__pages_v_blocks_steps_header_accent" AS ENUM('neutral', 'red', 'blue');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_banner_header_accent" AS ENUM('neutral', 'red', 'blue');
  CREATE TYPE "public"."enum__pages_v_blocks_contact_header_accent" AS ENUM('neutral', 'red', 'blue');
  CREATE TABLE "pages_blocks_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"body" jsonb,
  	"cta_label" varchar,
  	"cta_url" varchar,
  	"header_eyebrow" varchar,
  	"header_accent" "enum_pages_blocks_steps_header_accent" DEFAULT 'neutral',
  	"header_heading" jsonb,
  	"header_lead" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_url" varchar,
  	"header_eyebrow" varchar,
  	"header_accent" "enum_pages_blocks_cta_banner_header_accent" DEFAULT 'neutral',
  	"header_heading" jsonb,
  	"header_lead" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"header_eyebrow" varchar,
  	"header_accent" "enum_pages_blocks_contact_header_accent" DEFAULT 'neutral',
  	"header_heading" jsonb,
  	"header_lead" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"body" jsonb,
  	"cta_label" varchar,
  	"cta_url" varchar,
  	"header_eyebrow" varchar,
  	"header_accent" "enum__pages_v_blocks_steps_header_accent" DEFAULT 'neutral',
  	"header_heading" jsonb,
  	"header_lead" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_url" varchar,
  	"header_eyebrow" varchar,
  	"header_accent" "enum__pages_v_blocks_cta_banner_header_accent" DEFAULT 'neutral',
  	"header_heading" jsonb,
  	"header_lead" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"header_eyebrow" varchar,
  	"header_accent" "enum__pages_v_blocks_contact_header_accent" DEFAULT 'neutral',
  	"header_heading" jsonb,
  	"header_lead" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_steps" ADD CONSTRAINT "pages_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_banner" ADD CONSTRAINT "pages_blocks_cta_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact" ADD CONSTRAINT "pages_blocks_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_steps" ADD CONSTRAINT "_pages_v_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_banner" ADD CONSTRAINT "_pages_v_blocks_cta_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact" ADD CONSTRAINT "_pages_v_blocks_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_steps_order_idx" ON "pages_blocks_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_steps_parent_id_idx" ON "pages_blocks_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_steps_path_idx" ON "pages_blocks_steps" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_banner_order_idx" ON "pages_blocks_cta_banner" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_banner_parent_id_idx" ON "pages_blocks_cta_banner" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_banner_path_idx" ON "pages_blocks_cta_banner" USING btree ("_path");
  CREATE INDEX "pages_blocks_contact_order_idx" ON "pages_blocks_contact" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_parent_id_idx" ON "pages_blocks_contact" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_path_idx" ON "pages_blocks_contact" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_steps_order_idx" ON "_pages_v_blocks_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_steps_parent_id_idx" ON "_pages_v_blocks_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_steps_path_idx" ON "_pages_v_blocks_steps" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_banner_order_idx" ON "_pages_v_blocks_cta_banner" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_banner_parent_id_idx" ON "_pages_v_blocks_cta_banner" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_banner_path_idx" ON "_pages_v_blocks_cta_banner" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_contact_order_idx" ON "_pages_v_blocks_contact" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_parent_id_idx" ON "_pages_v_blocks_contact" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_path_idx" ON "_pages_v_blocks_contact" USING btree ("_path");`)
}
