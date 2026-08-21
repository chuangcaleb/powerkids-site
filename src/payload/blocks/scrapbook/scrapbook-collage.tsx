'use client'

// Client component: the collage's lane count and packing come from measured,
// rendered heights (nothing here can be computed at build/request time). This
// file only measures the DOM and applies what comes back — every decision
// lives in collage-layout.ts, which is a pure function of those measurements.

import { Button } from '@/components/button/button'
import { DoodleLayer } from '@/components/doodle-layer/doodle-layer'
import { Heading } from '@/components/heading/heading'
import { PolaroidReel } from '@/components/polaroid-reel/polaroid-reel'
import { Polaroid } from '@/components/polaroid/polaroid'
import { HeaderRichText } from '@/components/rich-text/header-rich-text'
import { cx } from '@/lib/cx'
import { ICONS, isIconName } from '@/lib/icons'
import type { CSSProperties, RefObject } from 'react'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { buildCells, cellKey, collageLayout, type Metrics } from './collage-layout'
import type { CollageItem } from './normalize-items'
import styles from './scrapbook.module.css'

export type { CollageItem }

type Mode = 'noJs' | 'collage' | 'reel'

// Tuning knobs. Only the ones the layout maths needs are converted to pixels
// and handed over as Metrics; the rest are pure render decoration.
const MIN_PHOTO_HEIGHT_REM = 13.5 // 216px — shortest a photo may render before it is promoted to a wider span
const MAX_PHOTO_HEIGHT_REM = 23 // tallest before a photo's frame width gets capped instead of growing further
const TILT_DEG = 7 // max rotation applied to a photo, scaled by its per-cell random tilt in [-1, 1]
const JITTER_REM = 0.4375 // ~7px — max random offset applied to a cell's position in any direction
const TEXT_JITTER_SCALE = 0.5 // text jitters less than photos, so it stays legible and doesn't wander from its column
const SETTLE_TILT_SCALE = 7 // starting tilt (degrees) a photo animates in from on scroll entry, scaled by the same per-cell tilt value as TILT_DEG
const TEXT_DOODLE_DENSITY = 14 // marks in a text cell's doodle layer — tuned live at /dev/doodle-tuner
const MIN_PHOTO_SCALE = 1 // smallest a photo can render at — never shrinks below its packed box
const MAX_PHOTO_SCALE = 1.2 // largest a photo can render at — the "bleed" ceiling; higher starts reading as a layout bug rather than intentional overlap

// Fallbacks for the two values CSS owns, used only if the custom property is
// missing (it never is in practice — see readMetrics).
const ROW_UNIT_FALLBACK_REM = 0.5
const MIN_LANE_WIDTH_FALLBACK_REM = 24.25

// next/image `sizes` hints. Both are viewport-based because `sizes` has no
// container-relative form — approximations for the fetch, never layout inputs:
// the real column count comes from measurement (collage) or from `auto-fit`
// (the no-JS grid), neither of which is a breakpoint.
const COLLAGE_IMG_HINT_BREAKPOINT_REM = 60
const NO_JS_GRID_THIRD_COLUMN_HINT_REM = 78

function remToPx(rem: number) {
  if (typeof document === 'undefined') return rem * 16
  return rem * (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16)
}

function pxToRem(px: number) {
  return px / remToPx(1)
}

/**
 * The one place the DOM is read.
 *
 * Every value is taken from `.collage` itself, which is the same element with
 * the same box in all three modes — the mode-specific classes only add grid
 * properties. That is what keeps the measurement independent of the mode it
 * was taken in: measuring a tree that changes when the mode changes is how a
 * collage/reel oscillation gets in. `column-gap` and `--row-unit` are read
 * rather than assumed for the same reason (CSS owns them), and
 * `--min-lane-width` is shared with the no-JS grid's `auto-fit` track sizing,
 * so both tiers switch at the same width. Those custom properties must stay
 * literal `rem` values for `parseFloat` to resolve them.
 */
function readMetrics(
  container: HTMLDivElement,
  cellHeights: Record<string, number>,
): Metrics | null {
  const cs = getComputedStyle(container)
  const containerWidth =
    container.clientWidth -
    parseFloat(cs.paddingLeft || '0') -
    parseFloat(cs.paddingRight || '0')

  if (!containerWidth) return null

  const remProp = (name: string, fallbackRem: number) =>
    remToPx(parseFloat(cs.getPropertyValue(name)) || fallbackRem)

  // Measured from a real rendered frame, not recomputed from tokens — a
  // frame's border/padding is otherwise easy to lose track of once the width
  // cap is applied (see photoBox's own note). offsetWidth, not clientWidth, so
  // the frame's border is counted as chrome too — `.polaroid` is a <figure>;
  // its own offsetWidth minus its <img>'s is the total border + padding either
  // side.
  const img = container.querySelector('img')
  const frameEl = img?.closest('figure')
  const frameChromeWidth =
    frameEl && img ? Math.max(0, frameEl.offsetWidth - img.offsetWidth) : 0

  return {
    containerWidth,
    gap: parseFloat(cs.columnGap) || 0,
    rowUnit: remProp('--row-unit', ROW_UNIT_FALLBACK_REM),
    minLaneWidth: remProp('--min-lane-width', MIN_LANE_WIDTH_FALLBACK_REM),
    minPhotoHeight: remToPx(MIN_PHOTO_HEIGHT_REM),
    maxPhotoHeight: remToPx(MAX_PHOTO_HEIGHT_REM),
    frameChromeWidth,
    cellHeights,
  }
}

/**
 * Rendered cell heights, transform-free: `.pad` is measured with
 * `offsetHeight`, never `getBoundingClientRect`, which folds in the
 * jitter/tilt transform and reports a distorted box.
 */
function readCellHeights(pads: Map<string, HTMLDivElement>): Record<string, number> {
  const heights: Record<string, number> = {}
  pads.forEach((pad, key) => {
    heights[key] = pad.offsetHeight
  })
  return heights
}

export function ScrapbookCollage({
  items,
  seed,
}: {
  items: CollageItem[]
  seed: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cellRefs = useRef(new Map<string, HTMLDivElement>())
  const padRefs = useRef(new Map<string, HTMLDivElement>())
  const [mode, setMode] = useState<Mode>('noJs')
  const [lanes, setLanes] = useState(1)

  const cells = useMemo(
    () =>
      buildCells(
        items.map((item) => ({
          id: item.id,
          photos: item.photos.map((photo) => ({
            id: photo.id,
            aspectRatio: photo.aspectRatio,
          })),
        })),
        seed,
      ),
    [items, seed],
  )

  const photosByItem = useMemo(
    () => items.map((item) => new Map(item.photos.map((photo) => [photo.id, photo]))),
    [items],
  )

  /**
   * `withHeights: false` skips the cell measurement — before the collage tree
   * exists there is nothing to measure, and neither the mode nor the lane
   * count depends on it. Both callers go through this one function, so they
   * can never disagree about which mode currently applies.
   */
  const computeLayout = useCallback(
    (withHeights: boolean) => {
      const container = containerRef.current
      if (!container) return null

      const metrics = readMetrics(
        container,
        withHeights ? readCellHeights(padRefs.current) : {},
      )
      return metrics ? collageLayout(cells, seed, metrics) : null
    },
    [cells, seed],
  )

  const syncMode = useCallback(() => {
    const layout = computeLayout(false)
    if (!layout) return
    setMode(layout.mode)
    if (layout.mode === 'collage') setLanes(layout.lanes)
  }, [computeLayout])

  // Re-subscribes on every mode change: each mode renders its own DOM tree
  // (noJs / reel / collage), so the node `containerRef` points at is replaced
  // — an observer bound once at mount would keep watching a detached node and
  // only the window listener would still fire.
  //
  // Three triggers, deliberately overlapping. `ResizeObserver` is the real
  // one. The `requestAnimationFrame` is the first measurement: `observe()` is
  // documented to deliver the current size, but that delivery is not
  // guaranteed to land, and when it doesn't the block is stranded in its no-JS
  // fallback — observed happening in Chrome, so it is not hypothetical. The
  // window listener costs nothing and covers a viewport change an observer
  // misses. Measuring twice is free; measuring never is a broken block.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const frame = requestAnimationFrame(syncMode)
    const observer = new ResizeObserver(syncMode)
    observer.observe(container)
    window.addEventListener('resize', syncMode)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', syncMode)
    }
  }, [syncMode, mode])

  /**
   * Applies the layout once the collage's own cells exist in the DOM. Sole
   * owner of `--lanes` and of every cell's grid placement.
   */
  useLayoutEffect(() => {
    if (mode !== 'collage') return
    const container = containerRef.current
    if (!container) return

    function apply() {
      const layout = computeLayout(true)
      if (!layout || !container) return

      if (layout.mode === 'reel') {
        setMode('reel')
        return
      }

      if (layout.lanes !== lanes) setLanes(layout.lanes)
      container.style.setProperty('--lanes', String(layout.lanes))

      for (const placement of layout.placements) {
        const el = cellRefs.current.get(placement.key)
        if (!el) continue

        el.style.gridColumn = `${placement.columnStart} / span ${placement.span}`
        el.style.gridRow = `${placement.rowStart} / span ${placement.rows}`

        if (placement.maxFrameWidth) {
          el.style.setProperty('--photo-max-w', `${pxToRem(placement.maxFrameWidth)}rem`)
        } else {
          el.style.removeProperty('--photo-max-w')
        }
      }
    }

    apply()
    const observer = new ResizeObserver(apply)
    padRefs.current.forEach((pad) => observer.observe(pad))
    return () => observer.disconnect()
  }, [computeLayout, mode, lanes])

  if (mode === 'noJs') return <NoJsFallback items={items} containerRef={containerRef} />
  if (mode === 'reel') return <ReelList items={items} containerRef={containerRef} />

  return (
    <div ref={containerRef} className={cx(styles.collage, styles.collageGrid)}>
      {cells.map((cell) => {
        const key = cellKey(cell)
        const item = items[cell.itemIndex]
        if (!item) return null

        if (cell.kind === 'photo' && !photosByItem[cell.itemIndex]?.has(cell.photoId))
          return null

        if (cell.kind === 'text') {
          // An unknown name means a registry cut whose migration hasn't run;
          // drop it rather than render a stand-in an editor never chose.
          const icons = item.icons.filter(isIconName).map((name) => ICONS[name])

          return (
            <div
              key={key}
              className={cx(styles.cell, styles.cellText)}
              ref={(el) => {
                if (el) cellRefs.current.set(key, el)
              }}
            >
              {icons.length > 0 ? (
                <div className={styles.cellDoodle}>
                  <DoodleLayer
                    zoneId={`${seed}-doodle-${item.id}`}
                    icons={icons}
                    density={TEXT_DOODLE_DENSITY}
                    fit="spill"
                    parallax
                  />
                </div>
              ) : null}
              <div
                className={styles.pad}
                ref={(el) => {
                  if (el) padRefs.current.set(key, el)
                }}
              >
                <div
                  className={styles.tf}
                  style={
                    {
                      '--jy': `${(cell.jitterY * JITTER_REM * TEXT_JITTER_SCALE).toFixed(3)}rem`,
                    } as CSSProperties
                  }
                >
                  <ItemText item={item} />
                </div>
              </div>
            </div>
          )
        }

        return (
          <div
            key={key}
            className={cx(styles.cell, styles.cellPhoto)}
            ref={(el) => {
              if (el) cellRefs.current.set(key, el)
            }}
          >
            <div
              className={styles.pad}
              ref={(el) => {
                if (el) padRefs.current.set(key, el)
              }}
            >
              <div
                className={styles.tf}
                style={
                  {
                    '--jx': `${(cell.jitterX * JITTER_REM).toFixed(3)}rem`,
                    '--jy': `${(cell.jitterY * JITTER_REM).toFixed(3)}rem`,
                    '--photo-scale': (
                      MIN_PHOTO_SCALE +
                      cell.upscale * (MAX_PHOTO_SCALE - MIN_PHOTO_SCALE)
                    ).toFixed(3),
                  } as CSSProperties
                }
              >
                <div
                  className={styles.settle}
                  style={
                    {
                      '--settle-from': `${(cell.tilt * SETTLE_TILT_SCALE).toFixed(1)}deg`,
                    } as CSSProperties
                  }
                >
                  <Polaroid
                    doc={photosByItem[cell.itemIndex]!.get(cell.photoId)!.doc}
                    tilt={cell.tilt * TILT_DEG}
                    className={styles.photoFrame}
                    sizes={`(min-width: ${COLLAGE_IMG_HINT_BREAKPOINT_REM}rem) ${Math.round(100 / lanes)}vw, 50vw`}
                  />
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ItemText({ item }: { item: CollageItem }) {
  const { heading, lead, accent = 'neutral' } = item.header
  const button = item.button

  return (
    <div className={cx('flow-s max-lead', styles.itemText)}>
      {heading ? (
        <Heading level={3}>
          <HeaderRichText data={heading} accent={accent} />
        </Heading>
      ) : null}
      {lead ? (
        <p className={styles.itemLead}>
          <HeaderRichText data={lead} accent={accent} />
        </p>
      ) : null}
      {button?.label && button.url ? (
        <Button href={button.url} className={styles.itemButton}>
          {button.label}
        </Button>
      ) : null}
    </div>
  )
}

/**
 * No-JS fallback and initial SSR paint. Renders both tiers unconditionally —
 * the pure-CSS container query that picks one, and why it isn't an
 * approximation of the JS collage, lives in scrapbook.module.css.
 */
function NoJsFallback({
  items,
  containerRef,
}: {
  items: CollageItem[]
  containerRef: RefObject<HTMLDivElement | null>
}) {
  return (
    <div ref={containerRef} className={styles.collage}>
      <ul role="list" className={cx(styles.reelList, styles.noJsReel)}>
        {items.map((item, itemIndex) => (
          <li key={`${item.id}-${itemIndex}`} className={styles.reelItem}>
            <ItemText item={item} />
            <PolaroidReel photos={item.photos.map((photo) => photo.doc)} />
          </li>
        ))}
      </ul>
      <div className={styles.noJsGrid}>
        {items.flatMap((item, itemIndex) => [
          <div key={`text-${itemIndex}`} className={styles.noJsText}>
            <ItemText item={item} />
          </div>,
          ...item.photos.map((photo, index) => (
            <Polaroid
              key={`${itemIndex}-${index}`}
              doc={photo.doc}
              tilt={index % 2 === 0 ? -4 : 3}
              sizes={`(min-width: ${NO_JS_GRID_THIRD_COLUMN_HINT_REM}rem) 33vw, 50vw`}
            />
          )),
        ])}
      </div>
    </div>
  )
}

/** Reel: its own DOM tree, never the collage's — see PolaroidReel, which already is the ~12-line native scroll-snap strip this needs, no carousel library. */
function ReelList({
  items,
  containerRef,
}: {
  items: CollageItem[]
  containerRef: RefObject<HTMLDivElement | null>
}) {
  return (
    <div ref={containerRef} className={styles.collage}>
      <ul role="list" className={styles.reelList}>
        {items.map((item, itemIndex) => (
          <li key={`${item.id}-${itemIndex}`} className={styles.reelItem}>
            <ItemText item={item} />
            <PolaroidReel photos={item.photos.map((photo) => photo.doc)} />
          </li>
        ))}
      </ul>
    </div>
  )
}
