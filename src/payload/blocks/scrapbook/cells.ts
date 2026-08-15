import { createSeededRandom } from '@/lib/seeded-random'

// Below 0.5 a photo could never cross into a neighbouring item's block —
// above it, items visibly interleave without losing locality.
const INTERLEAVE_SPREAD = 0.95

export type ScrapbookPhoto = {
  id: string
  aspectRatio: number
}

export type ScrapbookItem = {
  id: string
  photos: ScrapbookPhoto[]
}

export type TextCell = {
  kind: 'text'
  itemIndex: number
  order: number
  jitterY: number
}

export type PhotoCell = {
  kind: 'photo'
  itemIndex: number
  photoId: string
  order: number
  aspectRatio: number
  tilt: number
  jitterX: number
  jitterY: number
  lead: number
}

export type ScrapbookCell = TextCell | PhotoCell

/**
 * One flat, seeded-random ordering of every text and photo cell — no
 * per-item container for photos to be trapped inside, so the packer (which
 * visits cells strictly in this order) can place an item's photos in a tight
 * band around its own text block without ever grouping them into a rigid
 * sub-grid. `tilt`/`jitterX`/`jitterY`/`lead` are normalized to [-1, 1] or
 * [0, 1) — the renderer scales them to actual units.
 */
export function buildCells(items: ScrapbookItem[], seed: string): ScrapbookCell[] {
  const random = createSeededRandom(seed)
  const cells: ScrapbookCell[] = []

  items.forEach((item, itemIndex) => {
    cells.push({ kind: 'text', itemIndex, order: itemIndex, jitterY: random() * 2 - 1 })

    for (const photo of item.photos) {
      cells.push({
        kind: 'photo',
        itemIndex,
        photoId: photo.id,
        order: itemIndex + (random() - 0.5) * INTERLEAVE_SPREAD,
        aspectRatio: photo.aspectRatio,
        tilt: random() * 2 - 1,
        jitterX: random() * 2 - 1,
        jitterY: random() * 2 - 1,
        lead: random(),
      })
    }
  })

  return cells.sort((a, b) => a.order - b.order)
}
