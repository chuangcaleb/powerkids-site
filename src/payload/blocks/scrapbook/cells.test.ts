import { describe, expect, it } from 'vitest'
import { buildCells, type ScrapbookItem } from './cells'

const ITEMS: ScrapbookItem[] = [
  {
    id: 'a',
    photos: [
      { id: 'a-1', aspectRatio: 1.5 },
      { id: 'a-2', aspectRatio: 1.5 },
    ],
  },
  { id: 'b', photos: [{ id: 'b-1', aspectRatio: 1.5 }] },
]

describe('buildCells', () => {
  it('produces one text cell plus one photo cell per photo', () => {
    const cells = buildCells(ITEMS, 'seed-a')
    expect(cells.filter((c) => c.kind === 'text')).toHaveLength(2)
    expect(cells.filter((c) => c.kind === 'photo')).toHaveLength(3)
  })

  it('is deterministic for the same seed', () => {
    const a = buildCells(ITEMS, 'seed-a')
    const b = buildCells(ITEMS, 'seed-a')
    expect(a).toEqual(b)
  })

  it('differs for a different seed', () => {
    const a = buildCells(ITEMS, 'seed-a')
    const b = buildCells(ITEMS, 'seed-b')
    expect(a).not.toEqual(b)
  })

  it("keeps a photo within its own item's interleave spread — never crosses a whole neighbouring item", () => {
    const cells = buildCells(ITEMS, 'seed-a')
    for (const cell of cells) {
      if (cell.kind === 'photo') {
        expect(Math.abs(cell.order - cell.itemIndex)).toBeLessThan(1)
      }
    }
  })

  it('sorts the flat list by order', () => {
    const cells = buildCells(ITEMS, 'seed-a')
    for (let i = 1; i < cells.length; i++) {
      expect(cells[i]!.order).toBeGreaterThanOrEqual(cells[i - 1]!.order)
    }
  })
})
