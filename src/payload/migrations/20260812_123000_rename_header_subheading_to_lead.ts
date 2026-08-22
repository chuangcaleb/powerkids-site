import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from '@payloadcms/db-vercel-postgres'

const blocks = [
  'card_grid',
  'contact',
  'content',
  'cta_banner',
  'faq',
  'framed_rows',
  'gallery',
  'schools',
  'steps',
]

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const block of blocks) {
    await db.execute(
      sql.raw(
        `ALTER TABLE "pages_blocks_${block}" RENAME COLUMN "header_subheading" TO "header_lead";`,
      ),
    )
    await db.execute(
      sql.raw(
        `ALTER TABLE "_pages_v_blocks_${block}" RENAME COLUMN "header_subheading" TO "header_lead";`,
      ),
    )
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const block of blocks) {
    await db.execute(
      sql.raw(
        `ALTER TABLE "pages_blocks_${block}" RENAME COLUMN "header_lead" TO "header_subheading";`,
      ),
    )
    await db.execute(
      sql.raw(
        `ALTER TABLE "_pages_v_blocks_${block}" RENAME COLUMN "header_lead" TO "header_subheading";`,
      ),
    )
  }
}
