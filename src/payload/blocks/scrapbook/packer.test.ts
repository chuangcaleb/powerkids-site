import { describe, expect, it } from 'vitest'
import { packLanes, type PackCell } from './packer'

describe('packLanes', () => {
  it('places a single cell at the shortest lane', () => {
    const cells: PackCell[] = [{ id: 'a', kind: 'photo', span: 1, rows: 10, lead: 0 }]
    const placed = packLanes(cells, 3, [5, 0, 8])
    expect(placed[0]).toMatchObject({ id: 'a', columnStart: 2, rowStart: 1 })
  })

  it('never places a cell spanning past the declared lane count', () => {
    const cells: PackCell[] = [{ id: 'a', kind: 'photo', span: 5, rows: 10, lead: 0 }]
    const placed = packLanes(cells, 3, [0, 0, 0])
    const first = placed[0]!
    expect(first.columnStart + first.span - 1).toBeLessThanOrEqual(3)
  })

  it('never places a later cell above an earlier one in the same lane (locality)', () => {
    const cells: PackCell[] = [
      { id: 'a', kind: 'photo', span: 1, rows: 20, lead: 0 },
      { id: 'b', kind: 'photo', span: 1, rows: 5, lead: 0 },
      { id: 'c', kind: 'photo', span: 1, rows: 5, lead: 0 },
    ]
    const placed = packLanes(cells, 1, [0])
    // All three share the single lane — each must start at or after the previous cell's end.
    for (let i = 1; i < placed.length; i++) {
      const current = placed[i]!
      const previous = placed[i - 1]!
      expect(current.rowStart).toBeGreaterThanOrEqual(previous.rowStart + previous.rows)
    }
  })

  it('never repeats the previous text block start when packer picks freely', () => {
    const cells: PackCell[] = [
      { id: 'text-1', kind: 'text', span: 1, rows: 10, lead: 0 },
      { id: 'text-2', kind: 'text', span: 1, rows: 10, lead: 0 },
    ]
    const placed = packLanes(cells, 2, [0, 0])
    expect(placed[1]!.columnStart).not.toBe(placed[0]!.columnStart)
  })

  it('applies lead as an extra row offset on top of the shortest lane', () => {
    const cells: PackCell[] = [{ id: 'a', kind: 'photo', span: 1, rows: 5, lead: 3 }]
    const placed = packLanes(cells, 1, [10])
    expect(placed[0]!.rowStart).toBe(14)
  })
})
