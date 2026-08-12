import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_cta_registration_header_accent" AS ENUM('neutral', 'red', 'blue');
  CREATE TYPE "public"."enum_cta_contact_header_accent" AS ENUM('neutral', 'red', 'blue');
  CREATE TABLE "cta" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"registration_header_eyebrow" varchar,
  	"registration_header_accent" "enum_cta_registration_header_accent" DEFAULT 'neutral',
  	"registration_header_heading" jsonb NOT NULL,
  	"registration_header_lead" jsonb,
  	"registration_button_label" varchar,
  	"registration_button_url" varchar,
  	"contact_header_eyebrow" varchar,
  	"contact_header_accent" "enum_cta_contact_header_accent" DEFAULT 'neutral',
  	"contact_header_heading" jsonb NOT NULL,
  	"contact_header_lead" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "cta" CASCADE;
  DROP TYPE "public"."enum_cta_registration_header_accent";
  DROP TYPE "public"."enum_cta_contact_header_accent";`)
}
