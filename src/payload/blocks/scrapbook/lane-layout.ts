/**
 * Lane count is derived from a photo HEIGHT band, never from a breakpoint
 * table — a breakpoint that disagrees with this can hand the packer a lane
 * count the grid never declared columns for, and the surplus collapses into
 * implicit `auto` tracks that swallow the real ones. Height is only ever
 * width ÷ aspectRatio, since nothing here crops, so the band is converted to
 * a width band via the collage's own median aspect ratio.
 */

export type LaneLayoutInput = {
  containerWidth: number
  gap: number
  aspectRatio: number
  minPhotoHeight: number
  maxPhotoHeight: number
  maxLanes: number
}

export type LaneLayout = {
  lanes: number
  laneWidth: number
}

export function deriveLaneLayout({
  containerWidth,
  gap,
  aspectRatio,
  minPhotoHeight,
  maxPhotoHeight,
  maxLanes,
}: LaneLayoutInput): LaneLayout {
  const widthAt = (lanes: number) => (containerWidth - (lanes - 1) * gap) / lanes

  let lanes = Math.max(
    1,
    Math.ceil((containerWidth + gap) / (maxPhotoHeight * aspectRatio + gap)),
  )
  lanes = Math.min(lanes, maxLanes)

  const minWidth = minPhotoHeight * aspectRatio
  while (lanes > 1 && widthAt(lanes) < minWidth) lanes--

  return { lanes, laneWidth: widthAt(lanes) }
}

/** Median, not mean — and from the live photo set, so a heavier portrait mix moves the reference with it. */
export function medianAspectRatio(ratios: number[]): number {
  if (ratios.length === 0) return 1
  const sorted = [...ratios].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)] ?? 1
}

export type PhotoBoxInput = {
  aspectRatio: number
  laneWidth: number
  laneCount: number
  gap: number
  /** Frame border + padding, measured from a real rendered `Polaroid` — see `frameChromeWidth`. */
  frameChromeWidth: number
  minPhotoHeight: number
  maxPhotoHeight: number
}

export type PhotoBox = {
  span: 1 | 2
  /** Cap on the frame's own width, or null when the lane width already keeps the photo in-band. */
  maxFrameWidth: number | null
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
export function photoBox({
  aspectRatio,
  laneWidth,
  laneCount,
  gap,
  frameChromeWidth,
  minPhotoHeight,
  maxPhotoHeight,
}: PhotoBoxInput): PhotoBox {
  let span: 1 | 2 = 1
  let frameWidth = laneWidth

  if ((frameWidth - frameChromeWidth) / aspectRatio < minPhotoHeight && laneCount >= 2) {
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
