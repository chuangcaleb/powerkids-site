'use client'

// Client component: the collage's lane count and packing come from measured,
// rendered heights (nothing here can be computed at build/request time), and
// the reel/stacked fallback decision is derived from that same measurement
// rather than a media query — see lane-layout.ts and packer.ts for why.

import type { CSSProperties, RefObject } from 'react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/button/button'
import { Heading } from '@/components/heading/heading'
import { Polaroid } from '@/components/polaroid/polaroid'
import { PolaroidReel } from '@/components/polaroid-reel/polaroid-reel'
import {
  HeaderRichText,
  type HeaderRichTextProps,
} from '@/components/rich-text/header-rich-text'
import { cx } from '@/lib/cx'
import { createSeededRandom } from '@/lib/seeded-random'
import type { Media as MediaDoc } from '@/payload-types'
import { buildCells } from './cells'
import { deriveLaneLayout, medianAspectRatio, photoBox } from './lane-layout'
import { packLanes, type PackCell } from './packer'
import styles from './scrapbook.module.css'

export type CollageItem = {
  id: string
  header: {
    heading?: HeaderRichTextProps['data'] | null
    lead?: HeaderRichTextProps['data'] | null
    accent?: 'neutral' | 'red' | 'blue' | null
  }
  button?: { label?: string | null; url?: string | null } | null
  photos: { id: string; doc: MediaDoc; aspectRatio: number }[]
}

type Mode = 'stacked' | 'collage' | 'reel'

// Tuning knobs
const MIN_PHOTO_HEIGHT_REM = 13.5 // 216px — shortest a lane-count derivation will allow before backing off to fewer, wider lanes
const MAX_PHOTO_HEIGHT_REM = 28.75 // 460px — tallest before a photo's frame width gets capped instead of growing further
const MAX_LANES = 6 // hard ceiling on lane count, regardless of how narrow that makes each one
const MIN_LANES_FOR_COLLAGE = 2 // fewer than this and the collage reads as a single column — reel wins instead
// Below this viewport width the reel wins outright, even if the lane math
// alone would still allow 2 lanes — matches the prototype's `reelBelow`.
const REEL_BELOW_PX = 850
const TEXT_SPAN_LANES = 2 // how many lanes a text block occupies
const TILT_DEG = 7 // max rotation applied to a photo, scaled by its per-cell random tilt in [-1, 1]
const JITTER_REM = 0.4375 // ~7px — max random offset applied to a cell's position in any direction
const TEXT_JITTER_SCALE = 0.5 // text jitters less than photos, so it stays legible and doesn't wander from its column
const SETTLE_TILT_SCALE = 7 // starting tilt (degrees) a photo animates in from on scroll entry, scaled by the same per-cell tilt value as TILT_DEG
const STAGGER_MAX_ROWS = 20 // max random per-lane row offset that gives the collage its staggered (not razor-aligned) top edge
const VSCATTER_MAX_ROWS = 14 // max extra vertical scatter applied on top of a photo's packed position, for texture beyond the lane stagger alone
const MIN_PHOTO_SCALE = 1 // smallest a photo can render at — never shrinks below its packed box
const MAX_PHOTO_SCALE = 1.15 // largest a photo can render at — the "bleed" ceiling; higher starts reading as a layout bug rather than intentional overlap

function remToPx(rem: number) {
  if (typeof document === 'undefined') return rem * 16
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
}

function pxToRem(px: number) {
  return px / remToPx(1)
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
  const [mode, setMode] = useState<Mode>('stacked')
  const [lanes, setLanes] = useState(1)

  const cells = useMemo(
    () =>
      buildCells(
        items.map((item) => ({
          id: item.id,
          photos: item.photos.map((p) => ({ id: p.id, aspectRatio: p.aspectRatio })),
        })),
        seed,
      ),
    [items, seed],
  )

  const cellKey = (cell: (typeof cells)[number]) =>
    cell.kind === 'text'
      ? `text-${cell.itemIndex}`
      : `photo-${cell.itemIndex}-${cell.photoIndex}`

  const photosByItem = useMemo(
    () => items.map((item) => new Map(item.photos.map((p) => [p.id, p]))),
    [items],
  )

  const medianRatio = useMemo(
    () =>
      medianAspectRatio(items.flatMap((item) => item.photos.map((p) => p.aspectRatio))),
    [items],
  )

  /**
   * One owner for the lane count math, shared by the mode decision and the
   * packer below — two places independently deriving it is exactly the bug
   * the prototype hit (a mismatch surfaced as implicit grid tracks that
   * swallowed the width). Both measurements exclude the container's own
   * inline padding, so they always agree.
   */
  function measureLaneLayout(container: HTMLDivElement) {
    const cs = getComputedStyle(container)
    const gap = parseFloat(cs.columnGap) || 0
    const width =
      container.clientWidth -
      parseFloat(cs.paddingLeft || '0') -
      parseFloat(cs.paddingRight || '0')
    const layout = deriveLaneLayout({
      containerWidth: width,
      gap,
      aspectRatio: medianRatio,
      minPhotoHeight: remToPx(MIN_PHOTO_HEIGHT_REM),
      maxPhotoHeight: remToPx(MAX_PHOTO_HEIGHT_REM),
      maxLanes: MAX_LANES,
    })
    return { layout, gap, cs }
  }

  /**
   * Decide stacked/reel/collage from the container's measured width. Never a
   * media query — see displayMode() in the prototype for the bug this
   * avoids. Reel wins below `REEL_BELOW_PX` *or* when the lane math alone
   * can't form at least two lanes — either condition alone can miss a case
   * the other catches (e.g. a portrait-heavy photo set can still derive 2
   * lanes on a narrow phone).
   */
  function recomputeMode() {
    const container = containerRef.current
    if (!container || !container.clientWidth) return

    const { layout } = measureLaneLayout(container)
    setLanes(layout.lanes)
    const tooNarrow = window.innerWidth < REEL_BELOW_PX
    setMode(tooNarrow || layout.lanes < MIN_LANES_FOR_COLLAGE ? 'reel' : 'collage')
  }

  useEffect(() => {
    recomputeMode()
    const container = containerRef.current
    if (!container) return
    const ro = new ResizeObserver(recomputeMode)
    ro.observe(container)
    window.addEventListener('resize', recomputeMode)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', recomputeMode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, mode])

  /**
   * Packs once the collage's own cells exist in the DOM. Reads real
   * (transform-free) rendered heights via `.pad` — offsetHeight, never
   * getBoundingClientRect, which folds in the jitter/tilt transform and
   * reports a distorted box. This is the single owner of `--lanes` and of
   * every cell's grid placement — see packer.ts.
   */
  useLayoutEffect(() => {
    if (mode !== 'collage') return
    const container = containerRef.current
    if (!container) return

    function pack() {
      if (!container) return
      const { layout, gap, cs } = measureLaneLayout(container)
      const rowUnitRem = parseFloat(cs.getPropertyValue('--row-unit')) || 0.5
      const rowUnitPx = remToPx(rowUnitRem)

      if (window.innerWidth < REEL_BELOW_PX || layout.lanes < MIN_LANES_FOR_COLLAGE) {
        setMode('reel')
        return
      }
      if (layout.lanes !== lanes) setLanes(layout.lanes)
      container.style.setProperty('--lanes', String(layout.lanes))

      // Measured from a real rendered frame, not recomputed from tokens — a
      // frame's border/padding is otherwise easy to lose track of once the
      // width cap is applied (see photoBox's own note). offsetWidth, not
      // clientWidth, so the frame's border is counted as chrome too —
      // `.polaroid` is a <figure>; its own offsetWidth minus its <img>'s is
      // the total border + padding either side.
      const img = container.querySelector('img')
      const frameEl = img?.closest('figure')
      const chromeWidth =
        frameEl && img ? Math.max(0, frameEl.offsetWidth - img.offsetWidth) : 0

      const packCells: PackCell[] = cells.map((cell) => {
        const key = cellKey(cell)
        const pad = padRefs.current.get(key)
        const rows = pad ? Math.max(1, Math.ceil(pad.offsetHeight / rowUnitPx)) : 1

        if (cell.kind === 'text') {
          return {
            id: key,
            kind: 'text',
            span: Math.min(TEXT_SPAN_LANES, layout.lanes),
            rows,
            lead: 0,
          }
        }

        const box = photoBox({
          aspectRatio: cell.aspectRatio,
          laneWidth: layout.laneWidth,
          laneCount: layout.lanes,
          gap,
          frameChromeWidth: chromeWidth,
          minPhotoHeight: remToPx(MIN_PHOTO_HEIGHT_REM),
          maxPhotoHeight: remToPx(MAX_PHOTO_HEIGHT_REM),
        })

        const cellEl = cellRefs.current.get(key)
        if (cellEl) {
          if (box.maxFrameWidth) {
            cellEl.style.setProperty('--photo-max-w', `${pxToRem(box.maxFrameWidth)}rem`)
          } else {
            cellEl.style.removeProperty('--photo-max-w')
          }
        }

        return {
          id: key,
          kind: 'photo',
          span: box.span,
          rows,
          lead: Math.round(cell.lead * VSCATTER_MAX_ROWS),
        }
      })

      // Relative stagger between lanes, not an absolute offset: subtracting
      // the minimum keeps at least one lane starting at row 0, so the whole
      // collage doesn't sit behind a common empty band before any content —
      // only the *difference* between lanes is the intended stagger.
      const stagger = createSeededRandom(`${seed}-stagger-${layout.lanes}`)
      const rawHeights = Array.from({ length: layout.lanes }, () =>
        Math.round(stagger() * STAGGER_MAX_ROWS),
      )
      const baseline = Math.min(...rawHeights)
      const initialHeights = rawHeights.map((h) => h - baseline)

      const textKeys = new Set(
        packCells.filter((c) => c.kind === 'text').map((c) => c.id),
      )
      const placed = packLanes(packCells, layout.lanes, initialHeights)
      for (const cell of placed) {
        const el = cellRefs.current.get(cell.id)
        if (!el) continue
        el.style.gridColumn = `${cell.columnStart} / span ${cell.span}`
        el.style.gridRow = `${cell.rowStart} / span ${cell.rows}`
        // Extra inset for a text block that doesn't start in the first lane
        // — at higher lane counts it can land mid-grid, and the base gutter
        // alone reads as misaligned floating against the photos either side.
        if (textKeys.has(cell.id)) {
          el.style.setProperty('--text-lane-offset', cell.columnStart > 1 ? '1' : '0')
        }
      }
    }

    pack()
    const ro = new ResizeObserver(pack)
    padRefs.current.forEach((pad) => ro.observe(pad))
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, lanes, cells])

  if (mode === 'stacked') return <StackedList items={items} containerRef={containerRef} />
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
          return (
            <div
              key={key}
              className={cx(styles.cell, styles.cellText)}
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
                    sizes={`(min-width: 60rem) ${Math.round(100 / lanes)}vw, 50vw`}
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
    <div className={cx('flow-s', styles.itemText)}>
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
        <Button href={button.url} size="sm" className={styles.itemButton}>
          {button.label}
        </Button>
      ) : null}
    </div>
  )
}

/** No-JS fallback and initial SSR render: pure CSS tilt, no measurement of any kind. */
function StackedList({
  items,
  containerRef,
}: {
  items: CollageItem[]
  containerRef: RefObject<HTMLDivElement | null>
}) {
  return (
    <div ref={containerRef} className={styles.collage}>
      <ul role="list" className={styles.stackedList}>
        {items.map((item) => (
          <li key={item.id} className={cx('flow-l', styles.stackedItem)}>
            <ItemText item={item} />
            <div className={cx('cluster', styles.stackedPhotos)}>
              {item.photos.map((photo, index) => (
                <Polaroid
                  key={photo.id}
                  doc={photo.doc}
                  tilt={index % 2 === 0 ? -4 : 3}
                  className={styles.stackedPhoto}
                  sizes="80vw"
                />
              ))}
            </div>
          </li>
        ))}
      </ul>
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
        {items.map((item) => (
          <li key={item.id} className={styles.reelItem}>
            <ItemText item={item} />
            <PolaroidReel photos={item.photos.map((p) => p.doc)} />
          </li>
        ))}
      </ul>
    </div>
  )
}
