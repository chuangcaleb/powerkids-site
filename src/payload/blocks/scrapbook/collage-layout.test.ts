import { describe, expect, it } from 'vitest'
import {
  buildCells,
  cellKey,
  collageLayout,
  medianAspectRatio,
  type LayoutItem,
  type Metrics,
} from './collage-layout'

/** Token values as they resolve at a 16px root — see scrapbook.module.css. */
const GAP = 39 // --gap, --space-l around its clamp midpoint
const MIN_LANE_WIDTH = 388 // --min-lane-width, 24.25rem
const ROW_UNIT = 8 // --row-unit, 0.5rem
const MIN_PHOTO_HEIGHT = 216 // 13.5rem
const MAX_PHOTO_HEIGHT = 368 // 23rem

/** Max vertical scatter a cell can carry, in row units — see collage-layout.ts. */
const VSCATTER_MAX_ROWS = 14

/** Narrowest container that still fits two minimum-width lanes. */
const TWO_LANE_WIDTH = 2 * MIN_LANE_WIDTH + GAP

function metrics(
  containerWidth: number,
  cellHeights: Record<string, number> = {},
): Metrics {
  return {
    containerWidth,
    gap: GAP,
    rowUnit: ROW_UNIT,
    minLaneWidth: MIN_LANE_WIDTH,
    minPhotoHeight: MIN_PHOTO_HEIGHT,
    maxPhotoHeight: MAX_PHOTO_HEIGHT,
    frameChromeWidth: 20,
    cellHeights,
  }
}

/** Landscape (3:2) photos, the common case. */
function landscapeItems(count = 3, photosPerItem = 3): LayoutItem[] {
  return Array.from({ length: count }, (_, itemIndex) => ({
    id: `item-${itemIndex}`,
    photos: Array.from({ length: photosPerItem }, (_, photoIndex) => ({
      id: `photo-${itemIndex}-${photoIndex}`,
      aspectRatio: 1.5,
    })),
  }))
}

function portraitItems(count = 3, photosPerItem = 3): LayoutItem[] {
  return landscapeItems(count, photosPerItem).map((item) => ({
    ...item,
    photos: item.photos.map((photo) => ({ ...photo, aspectRatio: 0.75 })),
  }))
}

describe('mode decision', () => {
  it('falls to the reel below two minimum-width lanes', () => {
    const cells = buildCells(landscapeItems(), 'seed')
    const layout = collageLayout(cells, 'seed', metrics(TWO_LANE_WIDTH - 1))
    expect(layout.mode).toBe('reel')
  })

  it('collages from exactly two minimum-width lanes upward', () => {
    const cells = buildCells(landscapeItems(), 'seed')
    const layout = collageLayout(cells, 'seed', metrics(TWO_LANE_WIDTH))
    expect(layout.mode).toBe('collage')
  })

  it('falls to the reel on a narrow container even when portrait photos would fit two lanes', () => {
    // The height band alone derives 2 lanes at this width for 3:4 photos —
    // this is the case the old viewport check existed to catch.
    const cells = buildCells(portraitItems(), 'seed')
    const narrow = metrics(700)
    expect(collageLayout(cells, 'seed', narrow).mode).toBe('reel')
  })

  it('needs no measured cell heights to decide', () => {
    const cells = buildCells(landscapeItems(), 'seed')
    const withHeights = collageLayout(cells, 'seed', metrics(1400, { 'text-0': 300 }))
    const without = collageLayout(cells, 'seed', metrics(1400))
    expect(without.mode).toBe(withHeights.mode)
    expect(without.mode === 'collage' && withHeights.mode === 'collage').toBe(true)
    if (without.mode === 'collage' && withHeights.mode === 'collage') {
      expect(without.lanes).toBe(withHeights.lanes)
    }
  })
})

describe('lane derivation', () => {
  const laneCountAt = (width: number, items: LayoutItem[]) => {
    const layout = collageLayout(buildCells(items, 'seed'), 'seed', metrics(width))
    return layout.mode === 'collage' ? layout.lanes : 0
  }

  it('widens the lane count as the container grows', () => {
    expect(laneCountAt(900, landscapeItems())).toBe(2)
    expect(laneCountAt(1400, landscapeItems())).toBe(3)
    expect(laneCountAt(2400, landscapeItems())).toBe(5)
  })

  it('caps the lane count however wide the container gets', () => {
    expect(laneCountAt(10000, landscapeItems())).toBe(6)
  })

  it('gives a portrait-heavy set more, narrower lanes than a landscape one', () => {
    expect(laneCountAt(1400, portraitItems())).toBeGreaterThan(
      laneCountAt(1400, landscapeItems()),
    )
  })
})

describe('placements', () => {
  const layoutAt = (width: number, cellHeights: Record<string, number> = {}) => {
    const items = landscapeItems()
    const cells = buildCells(items, 'seed')
    const layout = collageLayout(cells, 'seed', metrics(width, cellHeights))
    if (layout.mode !== 'collage') throw new Error('expected a collage')
    return { layout, cells }
  }

  const layoutOf = (photos: { id: string; aspectRatio: number }[]) => {
    const cells = buildCells([{ id: 'item-0', photos }], 'seed')
    const layout = collageLayout(cells, 'seed', metrics(1400))
    if (layout.mode !== 'collage') throw new Error('expected a collage')
    return layout
  }

  it('never places a cell past the declared lane count', () => {
    const { layout } = layoutAt(1400)
    for (const placement of layout.placements) {
      expect(placement.columnStart).toBeGreaterThanOrEqual(1)
      expect(placement.columnStart + placement.span - 1).toBeLessThanOrEqual(layout.lanes)
    }
  })

  it('places every cell exactly once', () => {
    const { layout, cells } = layoutAt(1400)
    expect(layout.placements.map((placement) => placement.key).sort()).toEqual(
      cells.map(cellKey).sort(),
    )
  })

  it('keeps the top edge within one scatter offset of the first row', () => {
    // The lane stagger is relative — one lane always starts at height 0 — so
    // the only thing above the first cell is its own vertical scatter, never a
    // common empty band across every lane.
    const { layout } = layoutAt(1400)
    const top = Math.min(...layout.placements.map((placement) => placement.rowStart))
    expect(top).toBeGreaterThanOrEqual(1)
    expect(top).toBeLessThanOrEqual(1 + VSCATTER_MAX_ROWS)
  })

  it('converts a measured height into row units', () => {
    const { layout } = layoutAt(1400, { 'text-0': ROW_UNIT * 12 })
    const text = layout.placements.find((placement) => placement.key === 'text-0')!
    expect(text.rows).toBe(12)
  })

  it('falls back to one row for an unmeasured cell', () => {
    const { layout } = layoutAt(1400)
    expect(layout.placements.every((placement) => placement.rows === 1)).toBe(true)
  })

  it('promotes a panorama to two lanes rather than letting it render short', () => {
    // Three photos, so the median stays 1.5 — a two-photo set would put the
    // median on the panorama itself and one lane would be the right answer.
    const layout = layoutOf([
      { id: 'panorama', aspectRatio: 4 },
      { id: 'normal', aspectRatio: 1.5 },
      { id: 'also-normal', aspectRatio: 1.5 },
    ])

    const byKey = new Map(
      layout.placements.map((placement) => [placement.key, placement]),
    )
    expect(byKey.get('photo-0-0')!.span).toBe(2)
    // Two lanes wide already puts it inside the band, so no width cap.
    expect(byKey.get('photo-0-0')!.maxFrameWidth).toBeNull()
    expect(byKey.get('photo-0-1')!.span).toBe(1)
  })

  it('caps a portrait frame that a wide lane would push past the height band', () => {
    const layout = layoutOf([
      { id: 'portrait', aspectRatio: 0.6 },
      { id: 'normal', aspectRatio: 1.5 },
      { id: 'also-normal', aspectRatio: 1.5 },
    ])

    const byKey = new Map(
      layout.placements.map((placement) => [placement.key, placement]),
    )
    // Capped to the frame width that lands exactly on the band's ceiling —
    // height is never capped, since that would crop or squash the photo.
    expect(byKey.get('photo-0-0')!.maxFrameWidth).toBe(
      Math.round(MAX_PHOTO_HEIGHT * 0.6 + 20),
    )
    expect(byKey.get('photo-0-1')!.maxFrameWidth).toBeNull()
  })
})

describe('determinism', () => {
  it('is a pure function of cells, seed and metrics', () => {
    const cells = buildCells(landscapeItems(), 'seed')
    const first = collageLayout(cells, 'seed', metrics(1400, { 'text-0': 96 }))
    const second = collageLayout(cells, 'seed', metrics(1400, { 'text-0': 96 }))
    expect(second).toEqual(first)
  })

  it('rebuilds the same cells for the same seed, and different ones for another', () => {
    const items = landscapeItems()
    expect(buildCells(items, 'seed')).toEqual(buildCells(items, 'seed'))
    expect(buildCells(items, 'other')).not.toEqual(buildCells(items, 'seed'))
  })

  it("keeps an item's photos near its own text block", () => {
    const cells = buildCells(landscapeItems(4, 2), 'seed')
    for (const cell of cells) {
      expect(Math.abs(cell.order - cell.itemIndex)).toBeLessThan(1)
    }
  })

  it('re-measuring an unchanged container returns an identical layout', () => {
    // The oscillation guard: the same container width must always yield the
    // same mode and lane count, whichever mode the measurement was taken in.
    const cells = buildCells(landscapeItems(), 'seed')
    const heights = { 'text-0': 240, 'photo-0-0': 320 }
    expect(collageLayout(cells, 'seed', metrics(1000, heights))).toEqual(
      collageLayout(cells, 'seed', metrics(1000, heights)),
    )
  })
})

describe('medianAspectRatio', () => {
  it('takes the median, not the mean, so one panorama cannot move the reference', () => {
    expect(medianAspectRatio([0.75, 1.5, 1.5, 1.5, 12])).toBe(1.5)
  })

  it('falls back to square for an empty set', () => {
    expect(medianAspectRatio([])).toBe(1)
  })
})
