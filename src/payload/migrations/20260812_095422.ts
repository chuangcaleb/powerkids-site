import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from '@payloadcms/db-vercel-postgres'

/**
 * Hand-written, not generator output: `payload migrate:create`'s diff was
 * built on a stale baseline (several migrations after 20260810_141308 never
 * got a matching schema snapshot .json committed), so it proposed dropping
 * tables that no longer exist and recreating ones that already do. Verified
 * against a direct introspection of the target dev DB instead.
 *
 * Drops `prose`, `stats`, `video` blocks (retired — content/card-grid cover
 * `prose`+`stats`; video is content the team doesn't want per-instance
 * anymore) and adds the shared eyebrow/heading/subheading/accent `header`
 * group to the remaining 8 blocks that still take one.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE "public"."enum_pages_blocks_content_header_accent" AS ENUM('neutral', 'red', 'blue');
  CREATE TYPE "public"."enum_pages_blocks_card_grid_header_accent" AS ENUM('neutral', 'red', 'blue');
  CREATE TYPE "public"."enum_pages_blocks_steps_header_accent" AS ENUM('neutral', 'red', 'blue');
  CREATE TYPE "public"."enum_pages_blocks_gallery_header_accent" AS ENUM('neutral', 'red', 'blue');
  CREATE TYPE "public"."enum_pages_blocks_cta_banner_header_accent" AS ENUM('neutral', 'red', 'blue');
  CREATE TYPE "public"."enum_pages_blocks_schools_header_accent" AS ENUM('neutral', 'red', 'blue');
  CREATE TYPE "public"."enum_pages_blocks_faq_header_accent" AS ENUM('neutral', 'red', 'blue');
  CREATE TYPE "public"."enum_pages_blocks_contact_header_accent" AS ENUM('neutral', 'red', 'blue');
  CREATE TYPE "public"."enum__pages_v_blocks_content_header_accent" AS ENUM('neutral', 'red', 'blue');
  CREATE TYPE "public"."enum__pages_v_blocks_card_grid_header_accent" AS ENUM('neutral', 'red', 'blue');
  CREATE TYPE "public"."enum__pages_v_blocks_steps_header_accent" AS ENUM('neutral', 'red', 'blue');
  CREATE TYPE "public"."enum__pages_v_blocks_gallery_header_accent" AS ENUM('neutral', 'red', 'blue');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_banner_header_accent" AS ENUM('neutral', 'red', 'blue');
  CREATE TYPE "public"."enum__pages_v_blocks_schools_header_accent" AS ENUM('neutral', 'red', 'blue');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_header_accent" AS ENUM('neutral', 'red', 'blue');
  CREATE TYPE "public"."enum__pages_v_blocks_contact_header_accent" AS ENUM('neutral', 'red', 'blue');

  ALTER TABLE "pages_blocks_content" ADD COLUMN "header_eyebrow" varchar;
  ALTER TABLE "pages_blocks_content" ADD COLUMN "header_heading" jsonb;
  ALTER TABLE "pages_blocks_content" ADD COLUMN "header_subheading" jsonb;
  ALTER TABLE "pages_blocks_content" ADD COLUMN "header_accent" "enum_pages_blocks_content_header_accent" DEFAULT 'neutral';
  ALTER TABLE "pages_blocks_card_grid" ADD COLUMN "header_eyebrow" varchar;
  ALTER TABLE "pages_blocks_card_grid" ADD COLUMN "header_heading" jsonb;
  ALTER TABLE "pages_blocks_card_grid" ADD COLUMN "header_subheading" jsonb;
  ALTER TABLE "pages_blocks_card_grid" ADD COLUMN "header_accent" "enum_pages_blocks_card_grid_header_accent" DEFAULT 'neutral';
  ALTER TABLE "pages_blocks_steps" ADD COLUMN "header_eyebrow" varchar;
  ALTER TABLE "pages_blocks_steps" ADD COLUMN "header_heading" jsonb;
  ALTER TABLE "pages_blocks_steps" ADD COLUMN "header_subheading" jsonb;
  ALTER TABLE "pages_blocks_steps" ADD COLUMN "header_accent" "enum_pages_blocks_steps_header_accent" DEFAULT 'neutral';
  ALTER TABLE "pages_blocks_gallery" ADD COLUMN "header_eyebrow" varchar;
  ALTER TABLE "pages_blocks_gallery" ADD COLUMN "header_heading" jsonb;
  ALTER TABLE "pages_blocks_gallery" ADD COLUMN "header_subheading" jsonb;
  ALTER TABLE "pages_blocks_gallery" ADD COLUMN "header_accent" "enum_pages_blocks_gallery_header_accent" DEFAULT 'neutral';
  ALTER TABLE "pages_blocks_cta_banner" ADD COLUMN "header_eyebrow" varchar;
  ALTER TABLE "pages_blocks_cta_banner" ADD COLUMN "header_heading" jsonb;
  ALTER TABLE "pages_blocks_cta_banner" ADD COLUMN "header_subheading" jsonb;
  ALTER TABLE "pages_blocks_cta_banner" ADD COLUMN "header_accent" "enum_pages_blocks_cta_banner_header_accent" DEFAULT 'neutral';
  ALTER TABLE "pages_blocks_schools" ADD COLUMN "header_eyebrow" varchar;
  ALTER TABLE "pages_blocks_schools" ADD COLUMN "header_heading" jsonb;
  ALTER TABLE "pages_blocks_schools" ADD COLUMN "header_subheading" jsonb;
  ALTER TABLE "pages_blocks_schools" ADD COLUMN "header_accent" "enum_pages_blocks_schools_header_accent" DEFAULT 'neutral';
  ALTER TABLE "pages_blocks_faq" ADD COLUMN "header_eyebrow" varchar;
  ALTER TABLE "pages_blocks_faq" ADD COLUMN "header_heading" jsonb;
  ALTER TABLE "pages_blocks_faq" ADD COLUMN "header_subheading" jsonb;
  ALTER TABLE "pages_blocks_faq" ADD COLUMN "header_accent" "enum_pages_blocks_faq_header_accent" DEFAULT 'neutral';
  ALTER TABLE "pages_blocks_contact" ADD COLUMN "header_eyebrow" varchar;
  ALTER TABLE "pages_blocks_contact" ADD COLUMN "header_heading" jsonb;
  ALTER TABLE "pages_blocks_contact" ADD COLUMN "header_subheading" jsonb;
  ALTER TABLE "pages_blocks_contact" ADD COLUMN "header_accent" "enum_pages_blocks_contact_header_accent" DEFAULT 'neutral';

  ALTER TABLE "_pages_v_blocks_content" ADD COLUMN "header_eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_content" ADD COLUMN "header_heading" jsonb;
  ALTER TABLE "_pages_v_blocks_content" ADD COLUMN "header_subheading" jsonb;
  ALTER TABLE "_pages_v_blocks_content" ADD COLUMN "header_accent" "enum__pages_v_blocks_content_header_accent" DEFAULT 'neutral';
  ALTER TABLE "_pages_v_blocks_card_grid" ADD COLUMN "header_eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_card_grid" ADD COLUMN "header_heading" jsonb;
  ALTER TABLE "_pages_v_blocks_card_grid" ADD COLUMN "header_subheading" jsonb;
  ALTER TABLE "_pages_v_blocks_card_grid" ADD COLUMN "header_accent" "enum__pages_v_blocks_card_grid_header_accent" DEFAULT 'neutral';
  ALTER TABLE "_pages_v_blocks_steps" ADD COLUMN "header_eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_steps" ADD COLUMN "header_heading" jsonb;
  ALTER TABLE "_pages_v_blocks_steps" ADD COLUMN "header_subheading" jsonb;
  ALTER TABLE "_pages_v_blocks_steps" ADD COLUMN "header_accent" "enum__pages_v_blocks_steps_header_accent" DEFAULT 'neutral';
  ALTER TABLE "_pages_v_blocks_gallery" ADD COLUMN "header_eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_gallery" ADD COLUMN "header_heading" jsonb;
  ALTER TABLE "_pages_v_blocks_gallery" ADD COLUMN "header_subheading" jsonb;
  ALTER TABLE "_pages_v_blocks_gallery" ADD COLUMN "header_accent" "enum__pages_v_blocks_gallery_header_accent" DEFAULT 'neutral';
  ALTER TABLE "_pages_v_blocks_cta_banner" ADD COLUMN "header_eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_cta_banner" ADD COLUMN "header_heading" jsonb;
  ALTER TABLE "_pages_v_blocks_cta_banner" ADD COLUMN "header_subheading" jsonb;
  ALTER TABLE "_pages_v_blocks_cta_banner" ADD COLUMN "header_accent" "enum__pages_v_blocks_cta_banner_header_accent" DEFAULT 'neutral';
  ALTER TABLE "_pages_v_blocks_schools" ADD COLUMN "header_eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_schools" ADD COLUMN "header_heading" jsonb;
  ALTER TABLE "_pages_v_blocks_schools" ADD COLUMN "header_subheading" jsonb;
  ALTER TABLE "_pages_v_blocks_schools" ADD COLUMN "header_accent" "enum__pages_v_blocks_schools_header_accent" DEFAULT 'neutral';
  ALTER TABLE "_pages_v_blocks_faq" ADD COLUMN "header_eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_faq" ADD COLUMN "header_heading" jsonb;
  ALTER TABLE "_pages_v_blocks_faq" ADD COLUMN "header_subheading" jsonb;
  ALTER TABLE "_pages_v_blocks_faq" ADD COLUMN "header_accent" "enum__pages_v_blocks_faq_header_accent" DEFAULT 'neutral';
  ALTER TABLE "_pages_v_blocks_contact" ADD COLUMN "header_eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_contact" ADD COLUMN "header_heading" jsonb;
  ALTER TABLE "_pages_v_blocks_contact" ADD COLUMN "header_subheading" jsonb;
  ALTER TABLE "_pages_v_blocks_contact" ADD COLUMN "header_accent" "enum__pages_v_blocks_contact_header_accent" DEFAULT 'neutral';

  ALTER TABLE "pages_blocks_card_grid" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_steps" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_gallery" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_gallery" DROP COLUMN "subheading";
  ALTER TABLE "pages_blocks_cta_banner" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_schools" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_faq" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_contact" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_card_grid" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_steps" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_gallery" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_gallery" DROP COLUMN "subheading";
  ALTER TABLE "_pages_v_blocks_cta_banner" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_schools" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_faq" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_contact" DROP COLUMN "heading";

  DROP TABLE "pages_blocks_stats_stats" CASCADE;
  DROP TABLE "pages_blocks_stats" CASCADE;
  DROP TABLE "pages_blocks_prose" CASCADE;
  DROP TABLE "pages_blocks_video_videos" CASCADE;
  DROP TABLE "pages_blocks_video" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_prose" CASCADE;
  DROP TABLE "_pages_v_blocks_video_videos" CASCADE;
  DROP TABLE "_pages_v_blocks_video" CASCADE;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages_blocks_card_grid" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_steps" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_gallery" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_gallery" ADD COLUMN "subheading" varchar;
  ALTER TABLE "pages_blocks_cta_banner" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_schools" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_faq" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_contact" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_card_grid" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_steps" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_gallery" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_gallery" ADD COLUMN "subheading" varchar;
  ALTER TABLE "_pages_v_blocks_cta_banner" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_schools" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_faq" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_contact" ADD COLUMN "heading" varchar;

  ALTER TABLE "pages_blocks_content" DROP COLUMN "header_eyebrow";
  ALTER TABLE "pages_blocks_content" DROP COLUMN "header_heading";
  ALTER TABLE "pages_blocks_content" DROP COLUMN "header_subheading";
  ALTER TABLE "pages_blocks_content" DROP COLUMN "header_accent";
  ALTER TABLE "pages_blocks_card_grid" DROP COLUMN "header_eyebrow";
  ALTER TABLE "pages_blocks_card_grid" DROP COLUMN "header_heading";
  ALTER TABLE "pages_blocks_card_grid" DROP COLUMN "header_subheading";
  ALTER TABLE "pages_blocks_card_grid" DROP COLUMN "header_accent";
  ALTER TABLE "pages_blocks_steps" DROP COLUMN "header_eyebrow";
  ALTER TABLE "pages_blocks_steps" DROP COLUMN "header_heading";
  ALTER TABLE "pages_blocks_steps" DROP COLUMN "header_subheading";
  ALTER TABLE "pages_blocks_steps" DROP COLUMN "header_accent";
  ALTER TABLE "pages_blocks_gallery" DROP COLUMN "header_eyebrow";
  ALTER TABLE "pages_blocks_gallery" DROP COLUMN "header_heading";
  ALTER TABLE "pages_blocks_gallery" DROP COLUMN "header_subheading";
  ALTER TABLE "pages_blocks_gallery" DROP COLUMN "header_accent";
  ALTER TABLE "pages_blocks_cta_banner" DROP COLUMN "header_eyebrow";
  ALTER TABLE "pages_blocks_cta_banner" DROP COLUMN "header_heading";
  ALTER TABLE "pages_blocks_cta_banner" DROP COLUMN "header_subheading";
  ALTER TABLE "pages_blocks_cta_banner" DROP COLUMN "header_accent";
  ALTER TABLE "pages_blocks_schools" DROP COLUMN "header_eyebrow";
  ALTER TABLE "pages_blocks_schools" DROP COLUMN "header_heading";
  ALTER TABLE "pages_blocks_schools" DROP COLUMN "header_subheading";
  ALTER TABLE "pages_blocks_schools" DROP COLUMN "header_accent";
  ALTER TABLE "pages_blocks_faq" DROP COLUMN "header_eyebrow";
  ALTER TABLE "pages_blocks_faq" DROP COLUMN "header_heading";
  ALTER TABLE "pages_blocks_faq" DROP COLUMN "header_subheading";
  ALTER TABLE "pages_blocks_faq" DROP COLUMN "header_accent";
  ALTER TABLE "pages_blocks_contact" DROP COLUMN "header_eyebrow";
  ALTER TABLE "pages_blocks_contact" DROP COLUMN "header_heading";
  ALTER TABLE "pages_blocks_contact" DROP COLUMN "header_subheading";
  ALTER TABLE "pages_blocks_contact" DROP COLUMN "header_accent";

  ALTER TABLE "_pages_v_blocks_content" DROP COLUMN "header_eyebrow";
  ALTER TABLE "_pages_v_blocks_content" DROP COLUMN "header_heading";
  ALTER TABLE "_pages_v_blocks_content" DROP COLUMN "header_subheading";
  ALTER TABLE "_pages_v_blocks_content" DROP COLUMN "header_accent";
  ALTER TABLE "_pages_v_blocks_card_grid" DROP COLUMN "header_eyebrow";
  ALTER TABLE "_pages_v_blocks_card_grid" DROP COLUMN "header_heading";
  ALTER TABLE "_pages_v_blocks_card_grid" DROP COLUMN "header_subheading";
  ALTER TABLE "_pages_v_blocks_card_grid" DROP COLUMN "header_accent";
  ALTER TABLE "_pages_v_blocks_steps" DROP COLUMN "header_eyebrow";
  ALTER TABLE "_pages_v_blocks_steps" DROP COLUMN "header_heading";
  ALTER TABLE "_pages_v_blocks_steps" DROP COLUMN "header_subheading";
  ALTER TABLE "_pages_v_blocks_steps" DROP COLUMN "header_accent";
  ALTER TABLE "_pages_v_blocks_gallery" DROP COLUMN "header_eyebrow";
  ALTER TABLE "_pages_v_blocks_gallery" DROP COLUMN "header_heading";
  ALTER TABLE "_pages_v_blocks_gallery" DROP COLUMN "header_subheading";
  ALTER TABLE "_pages_v_blocks_gallery" DROP COLUMN "header_accent";
  ALTER TABLE "_pages_v_blocks_cta_banner" DROP COLUMN "header_eyebrow";
  ALTER TABLE "_pages_v_blocks_cta_banner" DROP COLUMN "header_heading";
  ALTER TABLE "_pages_v_blocks_cta_banner" DROP COLUMN "header_subheading";
  ALTER TABLE "_pages_v_blocks_cta_banner" DROP COLUMN "header_accent";
  ALTER TABLE "_pages_v_blocks_schools" DROP COLUMN "header_eyebrow";
  ALTER TABLE "_pages_v_blocks_schools" DROP COLUMN "header_heading";
  ALTER TABLE "_pages_v_blocks_schools" DROP COLUMN "header_subheading";
  ALTER TABLE "_pages_v_blocks_schools" DROP COLUMN "header_accent";
  ALTER TABLE "_pages_v_blocks_faq" DROP COLUMN "header_eyebrow";
  ALTER TABLE "_pages_v_blocks_faq" DROP COLUMN "header_heading";
  ALTER TABLE "_pages_v_blocks_faq" DROP COLUMN "header_subheading";
  ALTER TABLE "_pages_v_blocks_faq" DROP COLUMN "header_accent";
  ALTER TABLE "_pages_v_blocks_contact" DROP COLUMN "header_eyebrow";
  ALTER TABLE "_pages_v_blocks_contact" DROP COLUMN "header_heading";
  ALTER TABLE "_pages_v_blocks_contact" DROP COLUMN "header_subheading";
  ALTER TABLE "_pages_v_blocks_contact" DROP COLUMN "header_accent";

  DROP TYPE "public"."enum_pages_blocks_content_header_accent";
  DROP TYPE "public"."enum_pages_blocks_card_grid_header_accent";
  DROP TYPE "public"."enum_pages_blocks_steps_header_accent";
  DROP TYPE "public"."enum_pages_blocks_gallery_header_accent";
  DROP TYPE "public"."enum_pages_blocks_cta_banner_header_accent";
  DROP TYPE "public"."enum_pages_blocks_schools_header_accent";
  DROP TYPE "public"."enum_pages_blocks_faq_header_accent";
  DROP TYPE "public"."enum_pages_blocks_contact_header_accent";
  DROP TYPE "public"."enum__pages_v_blocks_content_header_accent";
  DROP TYPE "public"."enum__pages_v_blocks_card_grid_header_accent";
  DROP TYPE "public"."enum__pages_v_blocks_steps_header_accent";
  DROP TYPE "public"."enum__pages_v_blocks_gallery_header_accent";
  DROP TYPE "public"."enum__pages_v_blocks_cta_banner_header_accent";
  DROP TYPE "public"."enum__pages_v_blocks_schools_header_accent";
  DROP TYPE "public"."enum__pages_v_blocks_faq_header_accent";
  DROP TYPE "public"."enum__pages_v_blocks_contact_header_accent";

  CREATE TABLE "pages_blocks_prose" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"block_name" varchar
  );
  CREATE TABLE "_pages_v_blocks_prose" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE "pages_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  CREATE TABLE "pages_blocks_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"use_founded_year" boolean DEFAULT false,
  	"value" varchar,
  	"label" varchar
  );
  CREATE TABLE "_pages_v_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE "_pages_v_blocks_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"use_founded_year" boolean DEFAULT false,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  CREATE TABLE "pages_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subheading" varchar,
  	"poster_id" integer,
  	"block_name" varchar
  );
  CREATE TABLE "_pages_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subheading" varchar,
  	"poster_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE "pages_blocks_video_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"embed_id" varchar
  );
  CREATE TABLE "_pages_v_blocks_video_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"embed_id" varchar,
  	"_uuid" varchar
  );

  ALTER TABLE "pages_blocks_prose" ADD CONSTRAINT "pages_blocks_prose_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_prose" ADD CONSTRAINT "_pages_v_blocks_prose_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats" ADD CONSTRAINT "pages_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_stats" ADD CONSTRAINT "pages_blocks_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats" ADD CONSTRAINT "_pages_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_stats" ADD CONSTRAINT "_pages_v_blocks_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video_videos" ADD CONSTRAINT "pages_blocks_video_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video_videos" ADD CONSTRAINT "_pages_v_blocks_video_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_video"("id") ON DELETE cascade ON UPDATE no action;

  CREATE INDEX "pages_blocks_prose_order_idx" ON "pages_blocks_prose" USING btree ("_order");
  CREATE INDEX "pages_blocks_prose_parent_id_idx" ON "pages_blocks_prose" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_prose_path_idx" ON "pages_blocks_prose" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_prose_order_idx" ON "_pages_v_blocks_prose" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_prose_parent_id_idx" ON "_pages_v_blocks_prose" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_prose_path_idx" ON "_pages_v_blocks_prose" USING btree ("_path");
  CREATE INDEX "pages_blocks_stats_order_idx" ON "pages_blocks_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_parent_id_idx" ON "pages_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_path_idx" ON "pages_blocks_stats" USING btree ("_path");
  CREATE INDEX "pages_blocks_stats_stats_order_idx" ON "pages_blocks_stats_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_stats_parent_id_idx" ON "pages_blocks_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_order_idx" ON "_pages_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_parent_id_idx" ON "_pages_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_path_idx" ON "_pages_v_blocks_stats" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_stats_stats_order_idx" ON "_pages_v_blocks_stats_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_stats_parent_id_idx" ON "_pages_v_blocks_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_order_idx" ON "pages_blocks_video" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_parent_id_idx" ON "pages_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_path_idx" ON "pages_blocks_video" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_poster_idx" ON "pages_blocks_video" USING btree ("poster_id");
  CREATE INDEX "_pages_v_blocks_video_order_idx" ON "_pages_v_blocks_video" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_parent_id_idx" ON "_pages_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_path_idx" ON "_pages_v_blocks_video" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_poster_idx" ON "_pages_v_blocks_video" USING btree ("poster_id");
  CREATE INDEX "pages_blocks_video_videos_order_idx" ON "pages_blocks_video_videos" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_videos_parent_id_idx" ON "pages_blocks_video_videos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_videos_order_idx" ON "_pages_v_blocks_video_videos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_videos_parent_id_idx" ON "_pages_v_blocks_video_videos" USING btree ("_parent_id");`)
}
