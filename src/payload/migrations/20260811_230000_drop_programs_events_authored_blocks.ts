import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from '@payloadcms/db-vercel-postgres'

/**
 * Drops `programs` and `events` collections (seed dummy data only, nothing
 * migrated) and their route-facing coupling in three blocks. Written by hand
 * per docs/ops/migrations.md — the generator's interactive create-vs-rename
 * prompt for the touched enums can't run non-interactively in this
 * environment, so this mirrors what it would have produced, confirmed
 * against the live schema.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_gallery" DROP COLUMN "source";
  ALTER TABLE "pages_blocks_gallery" DROP COLUMN "event_id";
  ALTER TABLE "_pages_v_blocks_gallery" DROP COLUMN "source";
  ALTER TABLE "_pages_v_blocks_gallery" DROP COLUMN "event_id";
  ALTER TABLE "pages_blocks_video" DROP COLUMN "source";
  ALTER TABLE "pages_blocks_video" DROP COLUMN "embed_id";
  ALTER TABLE "pages_blocks_video" DROP COLUMN "event_id";
  ALTER TABLE "_pages_v_blocks_video" DROP COLUMN "source";
  ALTER TABLE "_pages_v_blocks_video" DROP COLUMN "embed_id";
  ALTER TABLE "_pages_v_blocks_video" DROP COLUMN "event_id";
  ALTER TABLE "pages_blocks_card_grid" DROP COLUMN "source";
  ALTER TABLE "_pages_v_blocks_card_grid" DROP COLUMN "source";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "programs_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "events_id";

  DROP TABLE "_events_v_rels";
  DROP TABLE "_events_v_version_videos";
  DROP TABLE "_events_v";
  DROP TABLE "events_rels";
  DROP TABLE "events_videos";
  DROP TABLE "events";
  DROP TABLE "_programs_v";
  DROP TABLE "programs";

  DROP TYPE "enum_pages_blocks_card_grid_source";
  DROP TYPE "enum__pages_v_blocks_card_grid_source";
  DROP TYPE "enum_pages_blocks_gallery_source";
  DROP TYPE "enum__pages_v_blocks_gallery_source";
  DROP TYPE "enum_pages_blocks_video_source";
  DROP TYPE "enum__pages_v_blocks_video_source";
  DROP TYPE "enum_programs_icon";
  DROP TYPE "enum_programs_status";
  DROP TYPE "enum__programs_v_version_icon";
  DROP TYPE "enum__programs_v_version_status";
  DROP TYPE "enum__programs_v_published_locale";
  DROP TYPE "enum_events_status";
  DROP TYPE "enum__events_v_version_status";
  DROP TYPE "enum__events_v_published_locale";

  CREATE TABLE "media_tags" (
   "id" serial PRIMARY KEY NOT NULL,
   "name" varchar NOT NULL,
   "generate_slug" boolean,
   "slug" varchar,
   "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
   "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  CREATE INDEX "media_tags_slug_idx" ON "media_tags" USING btree ("slug");
  CREATE INDEX "media_tags_updated_at_idx" ON "media_tags" USING btree ("updated_at");
  CREATE INDEX "media_tags_created_at_idx" ON "media_tags" USING btree ("created_at");

  CREATE TABLE "media_rels" (
   "id" serial PRIMARY KEY NOT NULL,
   "order" integer,
   "parent_id" integer NOT NULL,
   "path" varchar NOT NULL,
   "media_tags_id" integer
  );
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_media_tags_fk" FOREIGN KEY ("media_tags_id") REFERENCES "media_tags"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "media_rels_order_idx" ON "media_rels" USING btree ("order");
  CREATE INDEX "media_rels_parent_idx" ON "media_rels" USING btree ("parent_id");
  CREATE INDEX "media_rels_path_idx" ON "media_rels" USING btree ("path");
  CREATE INDEX "media_rels_media_tags_id_idx" ON "media_rels" USING btree ("media_tags_id");

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "media_tags_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_tags_fk" FOREIGN KEY ("media_tags_id") REFERENCES "media_tags"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_media_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("media_tags_id");

  CREATE TYPE "enum_pages_blocks_gallery_mode" AS ENUM ('manual', 'tag');
  CREATE TYPE "enum__pages_v_blocks_gallery_mode" AS ENUM ('manual', 'tag');
  CREATE TYPE "enum_pages_blocks_gallery_sort" AS ENUM ('newest', 'oldest', 'filename');
  CREATE TYPE "enum__pages_v_blocks_gallery_sort" AS ENUM ('newest', 'oldest', 'filename');

  ALTER TABLE "pages_blocks_gallery" ADD COLUMN "subheading" varchar;
  ALTER TABLE "pages_blocks_gallery" ADD COLUMN "mode" "enum_pages_blocks_gallery_mode" DEFAULT 'manual';
  ALTER TABLE "pages_blocks_gallery" ADD COLUMN "tag_id" integer;
  ALTER TABLE "pages_blocks_gallery" ADD COLUMN "sort" "enum_pages_blocks_gallery_sort" DEFAULT 'newest';
  ALTER TABLE "pages_blocks_gallery" ADD CONSTRAINT "pages_blocks_gallery_tag_id_media_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "media_tags"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_gallery_tag_idx" ON "pages_blocks_gallery" USING btree ("tag_id");

  ALTER TABLE "_pages_v_blocks_gallery" ADD COLUMN "subheading" varchar;
  ALTER TABLE "_pages_v_blocks_gallery" ADD COLUMN "mode" "enum__pages_v_blocks_gallery_mode" DEFAULT 'manual';
  ALTER TABLE "_pages_v_blocks_gallery" ADD COLUMN "tag_id" integer;
  ALTER TABLE "_pages_v_blocks_gallery" ADD COLUMN "sort" "enum__pages_v_blocks_gallery_sort" DEFAULT 'newest';
  ALTER TABLE "_pages_v_blocks_gallery" ADD CONSTRAINT "_pages_v_blocks_gallery_tag_id_media_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "media_tags"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "_pages_v_blocks_gallery_tag_idx" ON "_pages_v_blocks_gallery" USING btree ("tag_id");

  ALTER TABLE "pages_blocks_video" ADD COLUMN "subheading" varchar;
  ALTER TABLE "_pages_v_blocks_video" ADD COLUMN "subheading" varchar;

  CREATE TABLE "pages_blocks_video_videos" (
   "_order" integer NOT NULL,
   "_parent_id" varchar NOT NULL,
   "id" varchar PRIMARY KEY NOT NULL,
   "label" varchar NOT NULL,
   "embed_id" varchar NOT NULL
  );
  ALTER TABLE "pages_blocks_video_videos" ADD CONSTRAINT "pages_blocks_video_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "pages_blocks_video"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_video_videos_order_idx" ON "pages_blocks_video_videos" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_videos_parent_id_idx" ON "pages_blocks_video_videos" USING btree ("_parent_id");

  CREATE TABLE "_pages_v_blocks_video_videos" (
   "_order" integer NOT NULL,
   "_parent_id" integer NOT NULL,
   "id" serial PRIMARY KEY NOT NULL,
   "label" varchar,
   "embed_id" varchar,
   "_uuid" varchar
  );
  ALTER TABLE "_pages_v_blocks_video_videos" ADD CONSTRAINT "_pages_v_blocks_video_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "_pages_v_blocks_video"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "_pages_v_blocks_video_videos_order_idx" ON "_pages_v_blocks_video_videos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_videos_parent_id_idx" ON "_pages_v_blocks_video_videos" USING btree ("_parent_id");

  CREATE TYPE "enum_pages_blocks_framed_rows_rows_icon" AS ENUM ('sunrise', 'sun', 'sunset', 'star', 'cloud', 'sparkles', 'smile', 'feather', 'music', 'rocket', 'palette', 'pen-line', 'zap', 'rainbow', 'flower');
  CREATE TYPE "enum__pages_v_blocks_framed_rows_rows_icon" AS ENUM ('sunrise', 'sun', 'sunset', 'star', 'cloud', 'sparkles', 'smile', 'feather', 'music', 'rocket', 'palette', 'pen-line', 'zap', 'rainbow', 'flower');

  CREATE TABLE "pages_blocks_framed_rows_rows" (
   "_order" integer NOT NULL,
   "_parent_id" varchar NOT NULL,
   "id" varchar PRIMARY KEY NOT NULL,
   "title" varchar NOT NULL,
   "body" varchar,
   "image_id" integer,
   "icon" "enum_pages_blocks_framed_rows_rows_icon",
   "eyebrow" varchar
  );
  ALTER TABLE "pages_blocks_framed_rows_rows" ADD CONSTRAINT "pages_blocks_framed_rows_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "pages_blocks_framed_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_framed_rows_rows" ADD CONSTRAINT "pages_blocks_framed_rows_rows_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_framed_rows_rows_order_idx" ON "pages_blocks_framed_rows_rows" USING btree ("_order");
  CREATE INDEX "pages_blocks_framed_rows_rows_parent_id_idx" ON "pages_blocks_framed_rows_rows" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_framed_rows_rows_image_idx" ON "pages_blocks_framed_rows_rows" USING btree ("image_id");

  CREATE TABLE "_pages_v_blocks_framed_rows_rows" (
   "_order" integer NOT NULL,
   "_parent_id" integer NOT NULL,
   "id" serial PRIMARY KEY NOT NULL,
   "title" varchar,
   "body" varchar,
   "image_id" integer,
   "icon" "enum__pages_v_blocks_framed_rows_rows_icon",
   "eyebrow" varchar,
   "_uuid" varchar
  );
  ALTER TABLE "_pages_v_blocks_framed_rows_rows" ADD CONSTRAINT "_pages_v_blocks_framed_rows_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "_pages_v_blocks_framed_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_framed_rows_rows" ADD CONSTRAINT "_pages_v_blocks_framed_rows_rows_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "_pages_v_blocks_framed_rows_rows_order_idx" ON "_pages_v_blocks_framed_rows_rows" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_framed_rows_rows_parent_id_idx" ON "_pages_v_blocks_framed_rows_rows" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_framed_rows_rows_image_idx" ON "_pages_v_blocks_framed_rows_rows" USING btree ("image_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "_pages_v_blocks_framed_rows_rows";
  DROP TABLE "pages_blocks_framed_rows_rows";
  DROP TYPE "enum__pages_v_blocks_framed_rows_rows_icon";
  DROP TYPE "enum_pages_blocks_framed_rows_rows_icon";

  DROP TABLE "_pages_v_blocks_video_videos";
  DROP TABLE "pages_blocks_video_videos";
  ALTER TABLE "_pages_v_blocks_video" DROP COLUMN "subheading";
  ALTER TABLE "pages_blocks_video" DROP COLUMN "subheading";

  ALTER TABLE "_pages_v_blocks_gallery" DROP COLUMN "sort";
  ALTER TABLE "_pages_v_blocks_gallery" DROP COLUMN "tag_id";
  ALTER TABLE "_pages_v_blocks_gallery" DROP COLUMN "mode";
  ALTER TABLE "_pages_v_blocks_gallery" DROP COLUMN "subheading";
  ALTER TABLE "pages_blocks_gallery" DROP COLUMN "sort";
  ALTER TABLE "pages_blocks_gallery" DROP COLUMN "tag_id";
  ALTER TABLE "pages_blocks_gallery" DROP COLUMN "mode";
  ALTER TABLE "pages_blocks_gallery" DROP COLUMN "subheading";
  DROP TYPE "enum__pages_v_blocks_gallery_sort";
  DROP TYPE "enum_pages_blocks_gallery_sort";
  DROP TYPE "enum__pages_v_blocks_gallery_mode";
  DROP TYPE "enum_pages_blocks_gallery_mode";

  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "media_tags_id";
  DROP TABLE "media_rels";
  DROP TABLE "media_tags";

  CREATE TYPE "enum__events_v_published_locale" AS ENUM ('en');
  CREATE TYPE "enum__events_v_version_status" AS ENUM ('draft', 'published');
  CREATE TYPE "enum_events_status" AS ENUM ('draft', 'published');
  CREATE TYPE "enum__programs_v_published_locale" AS ENUM ('en');
  CREATE TYPE "enum__programs_v_version_status" AS ENUM ('draft', 'published');
  CREATE TYPE "enum__programs_v_version_icon" AS ENUM ('star', 'sun', 'cloud', 'sparkles', 'smile', 'feather', 'music', 'rocket', 'palette', 'pen-line', 'zap', 'rainbow', 'flower', 'sunrise', 'sunset');
  CREATE TYPE "enum_programs_status" AS ENUM ('draft', 'published');
  CREATE TYPE "enum_programs_icon" AS ENUM ('star', 'sun', 'cloud', 'sparkles', 'smile', 'feather', 'music', 'rocket', 'palette', 'pen-line', 'zap', 'rainbow', 'flower', 'sunrise', 'sunset');
  CREATE TYPE "enum__pages_v_blocks_video_source" AS ENUM ('manual', 'event');
  CREATE TYPE "enum_pages_blocks_video_source" AS ENUM ('manual', 'event');
  CREATE TYPE "enum__pages_v_blocks_gallery_source" AS ENUM ('manual', 'event');
  CREATE TYPE "enum_pages_blocks_gallery_source" AS ENUM ('manual', 'event');
  CREATE TYPE "enum__pages_v_blocks_card_grid_source" AS ENUM ('manual', 'programs', 'events');
  CREATE TYPE "enum_pages_blocks_card_grid_source" AS ENUM ('manual', 'programs', 'events');

  CREATE TABLE "programs" (
   "id" serial PRIMARY KEY NOT NULL,
   "name" varchar,
   "generate_slug" boolean,
   "slug" varchar,
   "hours" varchar,
   "age_range" varchar,
   "strapline" varchar,
   "summary" varchar,
   "body" jsonb,
   "image_id" integer,
   "order" numeric,
   "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
   "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
   "_status" "enum_programs_status",
   "icon" "enum_programs_icon"
  );
  ALTER TABLE "programs" ADD CONSTRAINT "programs_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "programs_slug_idx" ON "programs" USING btree ("slug");
  CREATE INDEX "programs_image_idx" ON "programs" USING btree ("image_id");
  CREATE INDEX "programs_updated_at_idx" ON "programs" USING btree ("updated_at");
  CREATE INDEX "programs_created_at_idx" ON "programs" USING btree ("created_at");
  CREATE INDEX "programs__status_idx" ON "programs" USING btree ("_status");

  CREATE TABLE "_programs_v" (
   "id" serial PRIMARY KEY NOT NULL,
   "parent_id" integer,
   "version_name" varchar,
   "version_generate_slug" boolean,
   "version_slug" varchar,
   "version_hours" varchar,
   "version_age_range" varchar,
   "version_strapline" varchar,
   "version_summary" varchar,
   "version_body" jsonb,
   "version_image_id" integer,
   "version_order" numeric,
   "version_updated_at" timestamp(3) with time zone,
   "version_created_at" timestamp(3) with time zone,
   "version__status" "enum__programs_v_version_status",
   "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
   "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
   "snapshot" boolean,
   "published_locale" "enum__programs_v_published_locale",
   "latest" boolean,
   "version_icon" "enum__programs_v_version_icon"
  );
  ALTER TABLE "_programs_v" ADD CONSTRAINT "_programs_v_parent_id_programs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "programs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v" ADD CONSTRAINT "_programs_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "_programs_v_parent_idx" ON "_programs_v" USING btree ("parent_id");
  CREATE INDEX "_programs_v_version_version_slug_idx" ON "_programs_v" USING btree ("version_slug");
  CREATE INDEX "_programs_v_version_version_image_idx" ON "_programs_v" USING btree ("version_image_id");
  CREATE INDEX "_programs_v_version_version_updated_at_idx" ON "_programs_v" USING btree ("version_updated_at");
  CREATE INDEX "_programs_v_version_version_created_at_idx" ON "_programs_v" USING btree ("version_created_at");
  CREATE INDEX "_programs_v_version_version__status_idx" ON "_programs_v" USING btree ("version__status");
  CREATE INDEX "_programs_v_created_at_idx" ON "_programs_v" USING btree ("created_at");
  CREATE INDEX "_programs_v_updated_at_idx" ON "_programs_v" USING btree ("updated_at");
  CREATE INDEX "_programs_v_snapshot_idx" ON "_programs_v" USING btree ("snapshot");
  CREATE INDEX "_programs_v_published_locale_idx" ON "_programs_v" USING btree ("published_locale");
  CREATE INDEX "_programs_v_latest_idx" ON "_programs_v" USING btree ("latest");

  CREATE TABLE "events" (
   "id" serial PRIMARY KEY NOT NULL,
   "name" varchar,
   "generate_slug" boolean,
   "slug" varchar,
   "summary" varchar,
   "body" jsonb,
   "order" numeric,
   "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
   "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
   "_status" "enum_events_status"
  );
  CREATE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "events" USING btree ("_status");

  CREATE TABLE "events_rels" (
   "id" serial PRIMARY KEY NOT NULL,
   "order" integer,
   "parent_id" integer NOT NULL,
   "path" varchar NOT NULL,
   "media_id" integer
  );
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "events_rels_order_idx" ON "events_rels" USING btree ("order");
  CREATE INDEX "events_rels_parent_idx" ON "events_rels" USING btree ("parent_id");
  CREATE INDEX "events_rels_path_idx" ON "events_rels" USING btree ("path");
  CREATE INDEX "events_rels_media_id_idx" ON "events_rels" USING btree ("media_id");

  CREATE TABLE "events_videos" (
   "_order" integer NOT NULL,
   "_parent_id" integer NOT NULL,
   "id" varchar PRIMARY KEY NOT NULL,
   "label" varchar,
   "embed_id" varchar
  );
  ALTER TABLE "events_videos" ADD CONSTRAINT "events_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "events"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "events_videos_order_idx" ON "events_videos" USING btree ("_order");
  CREATE INDEX "events_videos_parent_id_idx" ON "events_videos" USING btree ("_parent_id");

  CREATE TABLE "_events_v" (
   "id" serial PRIMARY KEY NOT NULL,
   "parent_id" integer,
   "version_name" varchar,
   "version_generate_slug" boolean,
   "version_slug" varchar,
   "version_summary" varchar,
   "version_body" jsonb,
   "version_order" numeric,
   "version_updated_at" timestamp(3) with time zone,
   "version_created_at" timestamp(3) with time zone,
   "version__status" "enum__events_v_version_status",
   "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
   "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
   "snapshot" boolean,
   "published_locale" "enum__events_v_published_locale",
   "latest" boolean
  );
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "events"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_snapshot_idx" ON "_events_v" USING btree ("snapshot");
  CREATE INDEX "_events_v_published_locale_idx" ON "_events_v" USING btree ("published_locale");
  CREATE INDEX "_events_v_latest_idx" ON "_events_v" USING btree ("latest");

  CREATE TABLE "_events_v_rels" (
   "id" serial PRIMARY KEY NOT NULL,
   "order" integer,
   "parent_id" integer NOT NULL,
   "path" varchar NOT NULL,
   "media_id" integer
  );
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "_events_v_rels_order_idx" ON "_events_v_rels" USING btree ("order");
  CREATE INDEX "_events_v_rels_parent_idx" ON "_events_v_rels" USING btree ("parent_id");
  CREATE INDEX "_events_v_rels_path_idx" ON "_events_v_rels" USING btree ("path");
  CREATE INDEX "_events_v_rels_media_id_idx" ON "_events_v_rels" USING btree ("media_id");

  CREATE TABLE "_events_v_version_videos" (
   "_order" integer NOT NULL,
   "_parent_id" integer NOT NULL,
   "id" integer PRIMARY KEY NOT NULL,
   "label" varchar,
   "embed_id" varchar,
   "_uuid" varchar
  );
  ALTER TABLE "_events_v_version_videos" ADD CONSTRAINT "_events_v_version_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "_events_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "_events_v_version_videos_order_idx" ON "_events_v_version_videos" USING btree ("_order");
  CREATE INDEX "_events_v_version_videos_parent_id_idx" ON "_events_v_version_videos" USING btree ("_parent_id");

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "programs_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "events_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_programs_fk" FOREIGN KEY ("programs_id") REFERENCES "programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "events"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_programs_id_idx" ON "payload_locked_documents_rels" USING btree ("programs_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");

  ALTER TABLE "pages_blocks_card_grid" ADD COLUMN "source" "enum_pages_blocks_card_grid_source" DEFAULT 'manual';
  ALTER TABLE "_pages_v_blocks_card_grid" ADD COLUMN "source" "enum__pages_v_blocks_card_grid_source" DEFAULT 'manual';

  ALTER TABLE "pages_blocks_gallery" ADD COLUMN "source" "enum_pages_blocks_gallery_source" DEFAULT 'manual';
  ALTER TABLE "pages_blocks_gallery" ADD COLUMN "event_id" integer;
  ALTER TABLE "pages_blocks_gallery" ADD CONSTRAINT "pages_blocks_gallery_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_gallery_event_idx" ON "pages_blocks_gallery" USING btree ("event_id");
  ALTER TABLE "_pages_v_blocks_gallery" ADD COLUMN "source" "enum__pages_v_blocks_gallery_source" DEFAULT 'manual';
  ALTER TABLE "_pages_v_blocks_gallery" ADD COLUMN "event_id" integer;
  ALTER TABLE "_pages_v_blocks_gallery" ADD CONSTRAINT "_pages_v_blocks_gallery_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "_pages_v_blocks_gallery_event_idx" ON "_pages_v_blocks_gallery" USING btree ("event_id");

  ALTER TABLE "pages_blocks_video" ADD COLUMN "source" "enum_pages_blocks_video_source" DEFAULT 'manual';
  ALTER TABLE "pages_blocks_video" ADD COLUMN "embed_id" varchar;
  ALTER TABLE "pages_blocks_video" ADD COLUMN "event_id" integer;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_video_event_idx" ON "pages_blocks_video" USING btree ("event_id");
  ALTER TABLE "_pages_v_blocks_video" ADD COLUMN "source" "enum__pages_v_blocks_video_source" DEFAULT 'manual';
  ALTER TABLE "_pages_v_blocks_video" ADD COLUMN "embed_id" varchar;
  ALTER TABLE "_pages_v_blocks_video" ADD COLUMN "event_id" integer;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "_pages_v_blocks_video_event_idx" ON "_pages_v_blocks_video" USING btree ("event_id");`)
}
