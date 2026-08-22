import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_scrapbook_items_header_accent" AS ENUM('neutral', 'red', 'blue');
  CREATE TYPE "public"."enum_pages_blocks_scrapbook_header_accent" AS ENUM('neutral', 'red', 'blue');
  CREATE TYPE "public"."enum__pages_v_blocks_scrapbook_items_header_accent" AS ENUM('neutral', 'red', 'blue');
  CREATE TYPE "public"."enum__pages_v_blocks_scrapbook_header_accent" AS ENUM('neutral', 'red', 'blue');
  CREATE TABLE "pages_blocks_scrapbook_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"header_accent" "enum_pages_blocks_scrapbook_items_header_accent" DEFAULT 'neutral',
  	"header_heading" jsonb,
  	"header_lead" jsonb,
  	"button_label" varchar,
  	"button_url" varchar
  );
  
  CREATE TABLE "pages_blocks_scrapbook" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"header_eyebrow" varchar,
  	"header_accent" "enum_pages_blocks_scrapbook_header_accent" DEFAULT 'neutral',
  	"header_heading" jsonb,
  	"header_lead" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_scrapbook_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"header_accent" "enum__pages_v_blocks_scrapbook_items_header_accent" DEFAULT 'neutral',
  	"header_heading" jsonb,
  	"header_lead" jsonb,
  	"button_label" varchar,
  	"button_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_scrapbook" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"header_eyebrow" varchar,
  	"header_accent" "enum__pages_v_blocks_scrapbook_header_accent" DEFAULT 'neutral',
  	"header_heading" jsonb,
  	"header_lead" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_scrapbook_items" ADD CONSTRAINT "pages_blocks_scrapbook_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_scrapbook"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_scrapbook" ADD CONSTRAINT "pages_blocks_scrapbook_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_scrapbook_items" ADD CONSTRAINT "_pages_v_blocks_scrapbook_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_scrapbook"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_scrapbook" ADD CONSTRAINT "_pages_v_blocks_scrapbook_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_scrapbook_items_order_idx" ON "pages_blocks_scrapbook_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_scrapbook_items_parent_id_idx" ON "pages_blocks_scrapbook_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_scrapbook_order_idx" ON "pages_blocks_scrapbook" USING btree ("_order");
  CREATE INDEX "pages_blocks_scrapbook_parent_id_idx" ON "pages_blocks_scrapbook" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_scrapbook_path_idx" ON "pages_blocks_scrapbook" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_scrapbook_items_order_idx" ON "_pages_v_blocks_scrapbook_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_scrapbook_items_parent_id_idx" ON "_pages_v_blocks_scrapbook_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_scrapbook_order_idx" ON "_pages_v_blocks_scrapbook" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_scrapbook_parent_id_idx" ON "_pages_v_blocks_scrapbook" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_scrapbook_path_idx" ON "_pages_v_blocks_scrapbook" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_scrapbook_items" CASCADE;
  DROP TABLE "pages_blocks_scrapbook" CASCADE;
  DROP TABLE "_pages_v_blocks_scrapbook_items" CASCADE;
  DROP TABLE "_pages_v_blocks_scrapbook" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_scrapbook_items_header_accent";
  DROP TYPE "public"."enum_pages_blocks_scrapbook_header_accent";
  DROP TYPE "public"."enum__pages_v_blocks_scrapbook_items_header_accent";
  DROP TYPE "public"."enum__pages_v_blocks_scrapbook_header_accent";`)
}
