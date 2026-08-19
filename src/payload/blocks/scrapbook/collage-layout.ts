/**
 * Everything about *where* a scrapbook cell goes, behind one interface.
 *
 * The component measures the DOM and applies the result; every decision — how
 * many lanes fit, whether the collage is viable at all, which photos get a
 * width cap, and each cell's grid placement — happens here, from numbers. That
 * split is deliberate: the arithmetic was already testable when it lived in
 * three modules, but the parts that actually broke (unit conversions, the
 * reel/collage flip, measuring a tree that changes when the mode changes) sat
 * in the caller where no test could reach them. Pass `Metrics` from a fixture
 * and this whole module is a pure function.
 *
 * No viewport breakpoint anywhere: lane count comes from a minimum lane width
 * (`--min-lane-width`, declared in CSS and read back at runtime), and the reel
 * wins exactly when fewer than two lanes fit. One rule, one place.
 */

import { createSeededRandom } from '@/lib/seeded-random'
import { packLanes, type PackCell } from './packer'

// Below 0.5 a photo could never cross into a neighbouring item's block —
// above it, items visibly interleave without losing locality.
const INTERLEAVE_SPREAD = 0.95

/** Hard ceiling on lane count, regardless of how narrow that makes each one. */
const MAX_LANES = 6

/** Fewer than this and the collage reads as a single column — reel wins instead. */
const MIN_LANES_FOR_COLLAGE = 2

/** How many lanes a text block occupies. */
const TEXT_SPAN_LANES = 2

/** Max random per-lane row offset that gives the collage its staggered (not razor-aligned) top edge. */
const STAGGER_MAX_ROWS = 40

/** Max extra vertical scatter applied on top of a photo's packed position. */
const VSCATTER_MAX_ROWS = 14

export type LayoutPhoto = {
  id: string
  aspectRatio: number
}

export type LayoutItem = {
  id: string
  photos: LayoutPhoto[]
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
  photoIndex: number
  photoId: string
  order: number
  aspectRatio: number
  tilt: number
  jitterX: number
  jitterY: number
  lead: number
  upscale: number
}

export type ScrapbookCell = TextCell | PhotoCell

/**
 * Everything the layout needs to know about the rendered page, in pixels.
 *
 * `cellHeights` may be empty: before the collage tree exists there is nothing
 * to measure, and the mode decision doesn't depend on it. Cells with no
 * measured height fall back to one row.
 */
export type Metrics = {
  /** Container content box — its own inline padding already subtracted. */
  containerWidth: number
  /** Resolved column gap between lanes. */
  gap: number
  /** Height of one grid row. */
  rowUnit: number
  /** Narrowest a lane may be. Fewer lanes than fit at this width is what triggers the reel. */
  minLaneWidth: number
  /** Shortest a photo may render before it is promoted to a wider span. */
  minPhotoHeight: number
  /** Tallest a photo may render before its frame width is capped. */
  maxPhotoHeight: number
  /** A frame's border + padding, measured from a real rendered `Polaroid`. */
  frameChromeWidth: number
  /** Measured cell heights in px, keyed by {@link cellKey}. */
  cellHeights: Record<string, number>
}

export type Placement = {
  key: string
  columnStart: number
  rowStart: number
  span: number
  rows: number
  /** Cap on the frame's own width in px, or null when the lane width already keeps the photo in-band. */
  maxFrameWidth: number | null
}

export type CollageLayout =
  { mode: 'reel' } | { mode: 'collage'; lanes: number; placements: Placement[] }

/**
 * One flat, seeded-random ordering of every text and photo cell — no per-item
 * container for photos to be trapped inside, so the packer (which visits cells
 * strictly in this order) can place an item's photos in a tight band around
 * its own text block without ever grouping them into a rigid sub-grid.
 * `tilt`/`jitterX`/`jitterY`/`lead`/`upscale` are normalized to [-1, 1] or
 * [0, 1) — the renderer scales them to actual units.
 */
export function buildCells(items: LayoutItem[], seed: string): ScrapbookCell[] {
  const random = createSeededRandom(seed)
  const cells: ScrapbookCell[] = []

  items.forEach((item, itemIndex) => {
    cells.push({ kind: 'text', itemIndex, order: itemIndex, jitterY: random() * 2 - 1 })

    item.photos.forEach((photo, photoIndex) => {
      cells.push({
        kind: 'photo',
        itemIndex,
        photoIndex,
        photoId: photo.id,
        order: itemIndex + (random() - 0.5) * INTERLEAVE_SPREAD,
        aspectRatio: photo.aspectRatio,
        tilt: random() * 2 - 1,
        jitterX: random() * 2 - 1,
        jitterY: random() * 2 - 1,
        lead: random(),
        upscale: random(),
      })
    })
  })

  return cells.sort((a, b) => a.order - b.order)
}

/** Stable identity for a cell — the key the component files its refs and measured heights under. */
export function cellKey(cell: ScrapbookCell): string {
  return cell.kind === 'text'
    ? `text-${cell.itemIndex}`
    : `photo-${cell.itemIndex}-${cell.photoIndex}`
}

/** Median, not mean — and from the live photo set, so a heavier portrait mix moves the reference with it. */
export function medianAspectRatio(ratios: number[]): number {
  if (ratios.length === 0) return 1
  const sorted = [...ratios].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)] ?? 1
}

/**
 * How many lanes fit, and how wide each one lands.
 *
 * Derived from a photo HEIGHT band, never from a breakpoint table — a
 * breakpoint that disagrees with this can hand the packer a lane count the
 * grid never declared columns for, and the surplus collapses into implicit
 * `auto` tracks that swallow the real ones. Height is only ever width ÷
 * aspectRatio, since nothing here crops, so the band is converted to a width
 * band via the collage's own median aspect ratio.
 *
 * Note this deliberately does *not* apply `minLaneWidth`: a portrait-heavy set
 * is legitimately served by more, narrower lanes than a landscape one, and a
 * fixed floor would instead give it wide lanes with width-capped photos
 * floating in them. `minLaneWidth` decides whether a collage happens at all —
 * see `fitsTwoLanes`.
 */
function deriveLanes(metrics: Metrics, aspectRatio: number) {
  const { containerWidth, gap, minPhotoHeight, maxPhotoHeight } = metrics
  const widthAt = (lanes: number) => (containerWidth - (lanes - 1) * gap) / lanes

  let lanes = Math.min(
    MAX_LANES,
    Math.max(1, Math.ceil((containerWidth + gap) / (maxPhotoHeight * aspectRatio + gap))),
  )

  const minWidth = minPhotoHeight * aspectRatio
  while (lanes > 1 && widthAt(lanes) < minWidth) lanes--

  return { lanes, laneWidth: widthAt(lanes) }
}

/**
 * Whether the container is wide enough for a collage to be the right answer,
 * independent of aspect ratio.
 *
 * This is the rule that replaced a hard-coded 850px viewport check. Two lanes
 * at the minimum lane width is the same threshold the no-JS grid's tier switch
 * uses, expressed in the same units and read from the same custom property —
 * so the CSS-only paint and the measured layout agree instead of mirroring a
 * number at each other. Without it, a narrow phone holding portrait photos
 * derives two lanes from the height band alone and gets a cramped two-column
 * collage where the reel reads far better.
 */
function fitsTwoLanes(metrics: Metrics) {
  return (
    metrics.containerWidth >= MIN_LANES_FOR_COLLAGE * metrics.minLaneWidth + metrics.gap
  )
}

/**
 * One lane width can't satisfy a height band for every aspect ratio at once.
 * Too short (a tall photo) promotes it to two lanes — wider is taller. Too
 * tall (a wide photo) caps the FRAME's width at height × aspectRatio instead
 * — capping height would crop or squash the photo, and nothing here is
 * allowed to do either. The cap is on the frame, not the photo, so the
 * frame's own chrome must be added back or every capped photo lands a few
 * percent over the band.
 */
function photoBox(
  cell: PhotoCell,
  laneWidth: number,
  lanes: number,
  metrics: Metrics,
): { span: 1 | 2; maxFrameWidth: number | null } {
  const { gap, frameChromeWidth, minPhotoHeight, maxPhotoHeight } = metrics
  const { aspectRatio } = cell

  let span: 1 | 2 = 1
  let frameWidth = laneWidth

  if ((frameWidth - frameChromeWidth) / aspectRatio < minPhotoHeight && lanes >= 2) {
    span = 2
    frameWidth = laneWidth * 2 + gap
  }

  const heightAtFrameWidth = (frameWidth - frameChromeWidth) / aspectRatio
  const maxFrameWidth =
    heightAtFrameWidth > maxPhotoHeight
      ? Math.round(maxPhotoHeight * aspectRatio + frameChromeWidth)
      : null

  return { span, maxFrameWidth }
}

/**
 * The whole layout decision, from measured numbers to grid placements.
 *
 * Safe to call in any mode: with an empty `cellHeights` the placements are
 * meaningless but `mode` and `lanes` are not, which is how the component
 * decides what to render before there is anything to measure. Deterministic —
 * same cells, same seed, same metrics, same output.
 */
export function collageLayout(
  cells: ScrapbookCell[],
  seed: string,
  metrics: Metrics,
): CollageLayout {
  const photoCells = cells.filter((cell): cell is PhotoCell => cell.kind === 'photo')
  const aspectRatio = medianAspectRatio(photoCells.map((cell) => cell.aspectRatio))
  const { lanes, laneWidth } = deriveLanes(metrics, aspectRatio)

  if (!fitsTwoLanes(metrics) || lanes < MIN_LANES_FOR_COLLAGE) return { mode: 'reel' }

  const caps = new Map<string, number | null>()
  const packCells: PackCell[] = cells.map((cell) => {
    const key = cellKey(cell)
    const measured = metrics.cellHeights[key]
    const rows = measured ? Math.max(1, Math.ceil(measured / metrics.rowUnit)) : 1

    if (cell.kind === 'text') {
      return {
        id: key,
        kind: 'text',
        span: Math.min(TEXT_SPAN_LANES, lanes),
        rows,
        lead: 0,
      }
    }

    const box = photoBox(cell, laneWidth, lanes, metrics)
    caps.set(key, box.maxFrameWidth)

    return {
      id: key,
      kind: 'photo',
      span: box.span,
      rows,
      lead: Math.round(cell.lead * VSCATTER_MAX_ROWS),
    }
  })

  // Relative stagger between lanes, not an absolute offset: subtracting the
  // minimum keeps at least one lane starting at row 0, so the whole collage
  // doesn't sit behind a common empty band before any content — only the
  // *difference* between lanes is the intended stagger. Keyed on lane count as
  // well as seed, so a given width always produces the same arrangement.
  const stagger = createSeededRandom(`${seed}-stagger-${lanes}`)
  const rawHeights = Array.from({ length: lanes }, () =>
    Math.round(stagger() * STAGGER_MAX_ROWS),
  )
  const baseline = Math.min(...rawHeights)
  const initialHeights = rawHeights.map((height) => height - baseline)

  const placements = packLanes(packCells, lanes, initialHeights).map((placed) => ({
    key: placed.id,
    columnStart: placed.columnStart,
    rowStart: placed.rowStart,
    span: placed.span,
    rows: placed.rows,
    maxFrameWidth: caps.get(placed.id) ?? null,
  }))

  return { mode: 'collage', lanes, placements }
}
