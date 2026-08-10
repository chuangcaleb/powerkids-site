import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds `sunrise`/`sunset` to the `programs.icon` enum (see
 * `src/payload/collections/programs/index.ts`) — Morning School / Evening
 * Daycare now use literal time-of-day icons per owner instruction. Written
 * by hand: `migrate:create`'s interactive rename-vs-create prompt can't run
 * non-interactively, and this change needs none of that machinery, just
 * `ADD VALUE`.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_programs_icon" ADD VALUE 'sunrise';
  ALTER TYPE "public"."enum_programs_icon" ADD VALUE 'sunset';
  ALTER TYPE "public"."enum__programs_v_version_icon" ADD VALUE 'sunrise';
  ALTER TYPE "public"."enum__programs_v_version_icon" ADD VALUE 'sunset';`)
}

// Postgres has no DROP VALUE for enums — irreversible by design, same as any
// enum-value addition. No-op down; rolling back means a new forward migration.
export async function down(_args: MigrateDownArgs): Promise<void> {}
