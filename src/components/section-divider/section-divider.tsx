import type { CSSProperties, ReactNode } from 'react'
import { cx } from '@/lib/cx'
import { createSeededRandom } from '@/lib/seeded-random'
import {
  buildDividerPath,
  DIVIDER_STROKE_REF,
  type DividerShape,
} from '@/lib/divider-shapes'
import styles from './section-divider.module.css'

export type { DividerShape }

export type SectionDividerProps = {
  shape: DividerShape
  /** Tooth width in rem — the period of one repeat. Ignored by `arc`/`flat`. */
  width?: number
  /** Tooth depth in rem — vertical extent of the cut. Ignored by `flat`. */
  depth?: number
  /**
   * Nominal design canvas width in rem, used only to work out how many teeth
   * fit (no client JS measures the real container). Defaults to a full-bleed
   * viewport (`--max-viewport`-scale, 90rem / 1440px); narrower contexts
   * (e.g. a divider inside prose) can pass a smaller value so tooth density
   * reads right before the stretch.
   */
  referenceWidth?: number
  /**
   * Colour painted into the cut shape. Must be a solid value — an SVG `fill`
   * can't take a gradient. If the complex/two-tone colour lives on this side,
   * set `flip` instead so it lands in `below` (a plain CSS `background`,
   * which handles gradients fine).
   */
  above: string
  /** Colour behind the cut — the divider element's own `background`. Gradients are fine here. */
  below: string
  /** Mirrors the cut about the strip's midline, handing the shape to the lower band instead of the upper one. */
  flip?: boolean
  /** Seeds `torn`/`wobble` jitter — required for those shapes. Must be stable across server/client renders. */
  seed?: string
  className?: string
  /** Overlaid content — e.g. the registration sticker straddling a divider. */
  children?: ReactNode
  /** Set for a content-level divider (e.g. `<hr>` replacement); omit between full sections. */
  role?: string
}

/**
 * Internal SVG userSpace scale, not a rendered pixel size — keeps the
 * generator maths identical to the shape-assignment table's tuned values
 * (144, 18, …) while the component's public API stays in rem. Actual on-screen
 * size comes entirely from CSS (`--divider-depth`, `var(--border-width)`).
 */
const REM_TO_UNIT = 16

/** 1440px at the 16px root DESIGN.md's type scale treats as the wide end. */
const DEFAULT_REFERENCE_WIDTH = 90

/**
 * Shaped divider between two full-bleed colour bands. Inline SVG, stretched
 * with `preserveAspectRatio="none"` — CSS masks only cover periodic shapes,
 * and three of the four in use are irregular. No client JS measures the
 * container: the path is generated once against a nominal width and left to
 * stretch, so teeth read wider on wide viewports and narrower on mobile by
 * design. A divider is a standalone element between sections, never a
 * pseudo-element or child of one — that's what keeps `overflow: clip` on the
 * sections themselves a non-issue.
 */
export function SectionDivider({
  shape,
  width = 0,
  depth = 0,
  referenceWidth = DEFAULT_REFERENCE_WIDTH,
  above,
  below,
  flip,
  seed,
  className,
  children,
  role,
}: SectionDividerProps) {
  const w = Math.max(1, referenceWidth * REM_TO_UNIT)
  const toothWidth = Math.max(1, width * REM_TO_UNIT)
  const random = seed ? createSeededRandom(seed) : undefined
  const {
    cut,
    fill,
    depth: d,
  } = buildDividerPath(shape, w, depth * REM_TO_UNIT, toothWidth, random)

  const paint = flip ? below : above
  const backdrop = flip ? above : below
  const top = -DIVIDER_STROKE_REF / 2
  const viewBoxHeight = d + DIVIDER_STROKE_REF

  return (
    <div
      className={cx(styles.divider, className)}
      role={role}
      style={{ background: backdrop, '--divider-depth': `${depth}rem` } as CSSProperties}
    >
      <svg
        viewBox={`0 ${top} ${w} ${viewBoxHeight}`}
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
        className={styles.svg}
      >
        <g transform={flip ? `translate(0 ${d}) scale(1 -1)` : undefined}>
          <path d={fill} fill={paint} />
          <path
            d={cut}
            fill="none"
            stroke="var(--border-strong)"
            className={styles.stroke}
            strokeLinejoin="round"
            strokeLinecap="butt"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>
      {children}
    </div>
  )
}
