/**
 * Shortest-lane placement, visiting cells strictly in the order given —
 * nothing may jump backwards into an earlier hole. That locality guarantee is
 * exactly what `grid-auto-flow: dense` cannot make: dense is *defined* as
 * backfilling earlier holes with whichever later item fits, so a photo from
 * the last item landing in row one would be the algorithm working to spec,
 * not a bug. An item's photos staying near that item's own text block is a
 * hard requirement here, so dense is never used.
 */

export type PackCell = {
  id: string
  kind: 'text' | 'photo'
  /** Lanes this cell occupies. */
  span: number
  /** Height in row units. */
  rows: number
  /** Extra row offset applied on top of the shortest lane found (vertical scatter). */
  lead: number
  /** Force a specific starting lane (text rhythm); null lets the packer pick. */
  forcedStart?: number | null
}

export type PackedCell = {
  id: string
  columnStart: number
  rowStart: number
  span: number
  rows: number
}

export function packLanes(
  cells: PackCell[],
  laneCount: number,
  initialLaneHeights: number[],
): PackedCell[] {
  const heights = [...initialLaneHeights]
  const placed: PackedCell[] = []
  let lastTextStart = -1

  for (const cell of cells) {
    const span = Math.min(cell.span, laneCount)
    let start: number

    if (
      cell.kind === 'text' &&
      cell.forcedStart != null &&
      cell.forcedStart !== lastTextStart
    ) {
      start = cell.forcedStart
    } else {
      start = shortestRun(
        heights,
        span,
        laneCount,
        cell.kind === 'text' ? lastTextStart : -1,
      )
    }
    if (cell.kind === 'text') lastTextStart = start

    const rowStart = Math.max(...heights.slice(start, start + span)) + cell.lead
    for (let lane = start; lane < start + span; lane++)
      heights[lane] = rowStart + cell.rows

    placed.push({
      id: cell.id,
      columnStart: start + 1,
      rowStart: rowStart + 1,
      span,
      rows: cell.rows,
    })
  }

  return placed
}

/**
 * `avoidStart` keeps consecutive text blocks from repeating the same column
 * run — two items sharing a span back to back is what makes the section
 * read as a rigid two-column list instead of a scattered collage.
 */
function shortestRun(
  heights: number[],
  span: number,
  laneCount: number,
  avoidStart: number,
): number {
  let best = 0
  let bestHeight = Infinity
  for (let start = 0; start + span <= laneCount; start++) {
    if (start === avoidStart && laneCount - span > 0) continue
    const height = Math.max(...heights.slice(start, start + span))
    if (height < bestHeight) {
      bestHeight = height
      best = start
    }
  }
  return best
}
