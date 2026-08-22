import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from '@payloadcms/db-vercel-postgres'

/**
 * Replaces the single-relationship `possibleDuplicateOf` field with the
 * checksum-group model — reasoning in ADR 0005. `checksum` itself is
 * unchanged; only the derived/editable fields on top of it move.
 *
 * No `pnpm migrate:create` run here: this touches no enum, so nothing forces
 * hand-writing, but `payload migrate:create`'s create-vs-rename TUI prompt
 * for `has_duplicate` (it can't tell "rename `possible_duplicate_of_id`"
 * from "new column" on its own) still can't run non-interactively in this
 * environment — see docs/gotchas.md. Written by hand instead, matching what
 * the generator would have produced for a plain create.
 *
 * No backfill: issue #12's "No backfill migration" decision — the Media
 * library was empty at spec time. Re-check that assumption before replaying
 * this against a populated library (also true of this dev database, which
 * already has 8 seeded docs — safe here only because they're disposable
 * kitchen-sink fixtures, not real content).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" DROP CONSTRAINT "media_possible_duplicate_of_id_media_id_fk";
  DROP INDEX "media_possible_duplicate_of_idx";
  ALTER TABLE "media" DROP COLUMN "possible_duplicate_of_id";
  ALTER TABLE "media" ADD COLUMN "has_duplicate" boolean DEFAULT false;
  ALTER TABLE "media" ADD COLUMN "duplicate_dismissed" boolean DEFAULT false;
  CREATE INDEX "media_has_duplicate_idx" ON "media" USING btree ("has_duplicate");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "media_has_duplicate_idx";
  ALTER TABLE "media" DROP COLUMN "duplicate_dismissed";
  ALTER TABLE "media" DROP COLUMN "has_duplicate";
  ALTER TABLE "media" ADD COLUMN "possible_duplicate_of_id" integer;
  ALTER TABLE "media" ADD CONSTRAINT "media_possible_duplicate_of_id_media_id_fk" FOREIGN KEY ("possible_duplicate_of_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "media_possible_duplicate_of_idx" ON "media" USING btree ("possible_duplicate_of_id");`)
}
