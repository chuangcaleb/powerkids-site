import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_enquiries_reply_by" AS ENUM('whatsapp', 'call', 'email');
  CREATE TYPE "public"."enum_enquiries_status" AS ENUM('unread', 'closed');
  CREATE TYPE "public"."enum_cta_enquiry_header_accent" AS ENUM('neutral', 'red', 'blue');
  CREATE TABLE "enquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar,
  	"email" varchar,
  	"reply_by" "enum_enquiries_reply_by" NOT NULL,
  	"enquiry_type_id" varchar NOT NULL,
  	"enquiry_type_label" varchar NOT NULL,
  	"message" varchar,
  	"confirmation_failed" boolean DEFAULT false,
  	"admin_notification_failed" boolean DEFAULT false,
  	"status" "enum_enquiries_status" DEFAULT 'unread',
  	"closed_by_id" integer,
  	"closed_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "cta_enquiry_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"hide_from_form" boolean DEFAULT false
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "enquiries_id" integer;

  -- Nullable first, then backfilled and constrained below — an unconditional
  -- NOT NULL ADD COLUMN fails outright against the existing site-settings row.
  ALTER TABLE "site_settings" ADD COLUMN "enquiry_notification_email" varchar;
  UPDATE "site_settings" SET "enquiry_notification_email" = "email" WHERE "enquiry_notification_email" IS NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "enquiry_notification_email" SET NOT NULL;

  ALTER TABLE "cta" ADD COLUMN "enquiry_header_eyebrow" varchar;
  ALTER TABLE "cta" ADD COLUMN "enquiry_header_accent" "enum_cta_enquiry_header_accent" DEFAULT 'neutral';
  ALTER TABLE "cta" ADD COLUMN "enquiry_header_heading" jsonb;
  ALTER TABLE "cta" ADD COLUMN "enquiry_header_lead" jsonb;

  -- Carry the existing registration copy over instead of losing it, then
  -- apply the same NOT NULL the old column had (see docs/workflows/migrations.md
  -- on renames silently turning into drop+recreate).
  UPDATE "cta" SET
    "enquiry_header_eyebrow" = "registration_header_eyebrow",
    "enquiry_header_accent" = "registration_header_accent"::text::"enum_cta_enquiry_header_accent",
    "enquiry_header_heading" = "registration_header_heading",
    "enquiry_header_lead" = "registration_header_lead";
  ALTER TABLE "cta" ALTER COLUMN "enquiry_header_heading" SET NOT NULL;

  ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_closed_by_id_users_id_fk" FOREIGN KEY ("closed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cta_enquiry_types" ADD CONSTRAINT "cta_enquiry_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cta"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "enquiries_closed_by_idx" ON "enquiries" USING btree ("closed_by_id");
  CREATE INDEX "enquiries_updated_at_idx" ON "enquiries" USING btree ("updated_at");
  CREATE INDEX "enquiries_created_at_idx" ON "enquiries" USING btree ("created_at");
  CREATE INDEX "cta_enquiry_types_order_idx" ON "cta_enquiry_types" USING btree ("_order");
  CREATE INDEX "cta_enquiry_types_parent_id_idx" ON "cta_enquiry_types" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_enquiries_fk" FOREIGN KEY ("enquiries_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_enquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("enquiries_id");

  -- Seed data (spec §1) — defaultValue only applies to newly-created docs via
  -- the API, so the existing singleton cta row needs its rows inserted here.
  INSERT INTO "cta_enquiry_types" ("_order", "_parent_id", "id", "label", "hide_from_form")
  SELECT seed.ord, "cta"."id", substr(md5(random()::text || seed.label || "cta"."id"::text), 1, 24), seed.label, false
  FROM "cta", (VALUES (1, 'Enrolment'), (2, 'Fees'), (3, 'Schedule Visit'), (4, 'Programs'), (5, 'Events'), (6, 'Other')) AS seed(ord, label);

  ALTER TABLE "cta" DROP COLUMN "registration_header_eyebrow";
  ALTER TABLE "cta" DROP COLUMN "registration_header_accent";
  ALTER TABLE "cta" DROP COLUMN "registration_header_heading";
  ALTER TABLE "cta" DROP COLUMN "registration_header_lead";
  ALTER TABLE "cta" DROP COLUMN "registration_button_label";
  ALTER TABLE "cta" DROP COLUMN "registration_button_url";
  DROP TYPE "public"."enum_cta_registration_header_accent";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_cta_registration_header_accent" AS ENUM('neutral', 'red', 'blue');
  ALTER TABLE "enquiries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cta_enquiry_types" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "enquiries" CASCADE;
  DROP TABLE "cta_enquiry_types" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_enquiries_fk";
  
  DROP INDEX "payload_locked_documents_rels_enquiries_id_idx";
  ALTER TABLE "cta" ADD COLUMN "registration_header_eyebrow" varchar;
  ALTER TABLE "cta" ADD COLUMN "registration_header_accent" "enum_cta_registration_header_accent" DEFAULT 'neutral';
  ALTER TABLE "cta" ADD COLUMN "registration_header_heading" jsonb;
  ALTER TABLE "cta" ADD COLUMN "registration_header_lead" jsonb;
  ALTER TABLE "cta" ADD COLUMN "registration_button_label" varchar;
  ALTER TABLE "cta" ADD COLUMN "registration_button_url" varchar;

  UPDATE "cta" SET
    "registration_header_eyebrow" = "enquiry_header_eyebrow",
    "registration_header_accent" = "enquiry_header_accent"::text::"enum_cta_registration_header_accent",
    "registration_header_heading" = "enquiry_header_heading",
    "registration_header_lead" = "enquiry_header_lead";
  ALTER TABLE "cta" ALTER COLUMN "registration_header_heading" SET NOT NULL;

  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "enquiries_id";
  ALTER TABLE "site_settings" DROP COLUMN "enquiry_notification_email";
  ALTER TABLE "cta" DROP COLUMN "enquiry_header_eyebrow";
  ALTER TABLE "cta" DROP COLUMN "enquiry_header_accent";
  ALTER TABLE "cta" DROP COLUMN "enquiry_header_heading";
  ALTER TABLE "cta" DROP COLUMN "enquiry_header_lead";
  DROP TYPE "public"."enum_enquiries_reply_by";
  DROP TYPE "public"."enum_enquiries_status";
  DROP TYPE "public"."enum_cta_enquiry_header_accent";`)
}
