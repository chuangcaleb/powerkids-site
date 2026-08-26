import config from '@payload-config'
import { getPayload } from 'payload'
import { isIconName } from '@/lib/icons'

/**
 * Reports every icon value stored in page content and whether the registry
 * still knows it. Run before cutting an icon from `src/lib/icons.ts` — a name
 * that live pages reference cannot just be deleted, it needs a migration that
 * remaps or clears those rows (`docs/workflows/migrations.md`).
 *
 * Walks the document tree by field name rather than by block path, so a new
 * block with an icon field is covered without editing this script.
 *
 *   payload run scripts/audit-icon-usage.ts
 */

const ICON_FIELDS = new Set(['icon', 'icons'])

type Usage = { page: string; path: string; value: string; known: boolean }

function walk(node: unknown, path: string, into: Usage[], page: string) {
  if (Array.isArray(node)) {
    node.forEach((item, index) => walk(item, `${path}[${index}]`, into, page))
    return
  }
  if (node === null || typeof node !== 'object') return

  for (const [key, value] of Object.entries(node)) {
    const next = path ? `${path}.${key}` : key
    if (ICON_FIELDS.has(key)) {
      for (const name of Array.isArray(value) ? value : [value]) {
        if (typeof name !== 'string' || name === '') continue
        into.push({ page, path: next, value: name, known: isIconName(name) })
      }
      continue
    }
    walk(value, next, into, page)
  }
}

const payload = await getPayload({ config })

// Drafts included on purpose: an unpublished page is still content that breaks
// on the next save if its icon value no longer resolves.
const { docs } = await payload.find({
  collection: 'pages',
  depth: 0,
  limit: 0,
  draft: true,
  pagination: false,
})

const usages: Usage[] = []
for (const doc of docs) {
  walk(doc.layout, 'layout', usages, String(doc.slug ?? doc.id))
}

const counts = new Map<string, number>()
for (const { value } of usages) counts.set(value, (counts.get(value) ?? 0) + 1)

const unknown = usages.filter((u) => !u.known)

payload.logger.info(
  `${usages.length} icon value(s) across ${docs.length} page(s), ${counts.size} distinct`,
)

for (const [value, count] of [...counts].sort((a, b) => b[1] - a[1])) {
  payload.logger.info(
    `  ${isIconName(value) ? 'ok     ' : 'UNKNOWN'}  ${value} × ${count}`,
  )
}

if (unknown.length) {
  payload.logger.warn(
    `${unknown.length} value(s) the registry does not know — these break on next save:`,
  )
  for (const { page, path, value } of unknown) {
    payload.logger.warn(`  ${page}  ${path}  ${value}`)
  }
}

process.exit(unknown.length ? 1 : 0)
