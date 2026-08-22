import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_programs_icon" AS ENUM('star', 'sun', 'cloud', 'sparkles', 'smile', 'feather', 'music', 'rocket', 'palette', 'pen-line', 'zap', 'rainbow', 'flower');
  CREATE TYPE "public"."enum__programs_v_version_icon" AS ENUM('star', 'sun', 'cloud', 'sparkles', 'smile', 'feather', 'music', 'rocket', 'palette', 'pen-line', 'zap', 'rainbow', 'flower');
  ALTER TABLE "programs" ADD COLUMN "icon" "enum_programs_icon";
  ALTER TABLE "_programs_v" ADD COLUMN "version_icon" "enum__programs_v_version_icon";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "programs" DROP COLUMN "icon";
  ALTER TABLE "_programs_v" DROP COLUMN "version_icon";
  DROP TYPE "public"."enum_programs_icon";
  DROP TYPE "public"."enum__programs_v_version_icon";`)
}
