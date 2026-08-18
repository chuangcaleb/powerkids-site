import config from '@payload-config'
import { sql } from '@payloadcms/db-postgres'
import { getPayload } from 'payload'
import { isIconName } from '@/lib/icons'

/**
 * One-shot data step between the two halves of the icon enum→text change.
 *
 * `doodleIcons` is `hasMany`, so its values moved from a dedicated enum table to
 * the shared `pages_texts` table, where each row's `path` encodes the field's
 * position in the document (`layout.2.items.0.doodleIcons`). Rebuilding those
 * paths in SQL means hand-reimplementing Payload's own path construction, so
 * this reads the legacy rows directly and writes them back through the Local
 * API, which builds the paths itself.
 *
 * Idempotent: rows already carrying an export name are left alone, and a page
 * whose items all match is skipped. Safe to re-run; a no-op once the legacy
 * table is dropped.
 *
 *   payload run scripts/backfill-doodle-icons.ts
 */

const RENAMES: Record<string, string> = {
  star: 'Star',
  sun: 'Sun',
  cloud: 'Cloud',
  sparkles: 'Sparkles',
  smile: 'FaceSlightlySmiling',
  feather: 'Feather',
  flower: 'Flower',
  music: 'Music',
  palette: 'Palette',
  'pen-line': 'PenLine',
  rocket: 'Rocket',
}

const LEGACY_TABLE = 'pages_blocks_scrapbook_items_doodle_icons'

const payload = await getPayload({ config })

const tableExists = await payload.db.drizzle.execute(sql`
  SELECT to_regclass(${LEGACY_TABLE}) IS NOT NULL AS present;
`)

if (!tableExists.rows[0]?.present) {
  payload.logger.info(`${LEGACY_TABLE} is gone — nothing to backfill.`)
  process.exit(0)
}

const legacy = await payload.db.drizzle.execute(sql`
  SELECT "parent_id" AS item_id, "order", "value"
  FROM "pages_blocks_scrapbook_items_doodle_icons"
  ORDER BY "parent_id", "order";
`)

/** Item row id → its doodle names, in authored order, renamed to the new set. */
const byItem = new Map<string, string[]>()
let dropped = 0

for (const row of legacy.rows as { item_id: string; value: string | null }[]) {
  if (!row.value) continue
  const name = RENAMES[row.value] ?? row.value
  if (!isIconName(name)) {
    // `zap`/`rainbow` — cut from the set, so there is nothing to carry over.
    dropped += 1
    continue
  }
  const list = byItem.get(String(row.item_id)) ?? []
  list.push(name)
  byItem.set(String(row.item_id), list)
}

payload.logger.info(
  `${byItem.size} scrapbook item(s) with doodles to restore${dropped ? `, ${dropped} value(s) with no replacement skipped` : ''}`,
)

const { docs } = await payload.find({
  collection: 'pages',
  depth: 0,
  limit: 0,
  draft: true,
  pagination: false,
})

let pagesUpdated = 0

for (const doc of docs) {
  let changed = false

  const layout = (doc.layout ?? []).map((block) => {
    if (block.blockType !== 'scrapbook') return block

    let blockChanged = false

    const items = (block.items ?? []).map((item) => {
      const restored = item.id ? byItem.get(String(item.id)) : undefined
      if (!restored?.length) return item
      const current = item.icons ?? []
      if (
        current.length === restored.length &&
        current.every((v, i) => v === restored[i])
      ) {
        return item
      }
      blockChanged = true
      changed = true
      return { ...item, icons: restored }
    })

    return blockChanged ? { ...block, items } : block
  })

  if (!changed) continue

  await payload.update({
    collection: 'pages',
    id: doc.id,
    data: { layout },
    // Published state — a draft-only write would leave the live page empty.
    draft: false,
    overrideAccess: true,
  })
  pagesUpdated += 1
  payload.logger.info(`  restored doodles on "${doc.slug ?? doc.id}"`)
}

payload.logger.info(`${pagesUpdated} page(s) updated.`)
process.exit(0)
