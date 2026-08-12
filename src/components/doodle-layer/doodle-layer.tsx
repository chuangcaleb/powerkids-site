import type { ComponentType, CSSProperties } from 'react'
import {
  Cloud,
  Feather,
  Flower,
  Music,
  Palette,
  PenLine,
  Rainbow,
  Rocket,
  Smile,
  Sparkles,
  Star,
  Sun,
  Zap,
} from 'lucide-react'
import { createSeededRandom } from '@/lib/seeded-random'
import styles from './doodle-layer.module.css'

/** lucide-react — line icons at the same 24x24/stroke shape the prototype's hand-rolled paths used. */
const DEFAULT_ICONS = [
  Star,
  Sun,
  Cloud,
  Sparkles,
  Smile,
  Feather,
  Music,
  Rocket,
  Palette,
  PenLine,
  Zap,
  Rainbow,
  Flower,
]

const DEPTH_COUNT = 3
const MAX_MARKS = 18

export type DoodleLayerProps = {
  /** Seeds placement — pass the section's own id so it's stable across renders. */
  zoneId: string
  /** Marks generated for this zone, hard-capped so no zone runs away with node count. */
  density?: number
  /** Icon set to draw from — defaults to the full decorative set. */
  icons?: ComponentType<{ size?: string | number; strokeWidth?: number }>[]
}

/**
 * Purely decorative background marks. Placement comes from a PRNG seeded on
 * `zoneId`, not `Math.random` — same output on server and client, so no
 * hydration mismatch. Grid-plus-jitter placement and size-tertile depth
 * buckets are ported from `_reference/design-exploration/proto/panel3.html`'s
 * `paintDoodles`, minus its `getBoundingClientRect` sizing step — that reads
 * real layout at runtime, which is exactly the kind of client/server
 * disagreement this component exists to avoid, so cols/rows come from
 * `density` alone. Parallax is three depth-wrapper divs (near/mid/far),
 * never a transform per mark — animating ~100+ individual nodes blew up the
 * compositor in prototyping. See DESIGN.md's Doodle layer section.
 */
export function DoodleLayer({
  zoneId,
  density = 10,
  icons = DEFAULT_ICONS,
}: DoodleLayerProps) {
  const count = Math.min(density, MAX_MARKS)
  const random = createSeededRandom(zoneId)

  const cols = Math.max(1, Math.round(Math.sqrt(count)))
  const rows = Math.max(1, Math.ceil(count / cols))

  const marks = Array.from({ length: count }, (_, index) => {
    const row = Math.floor(index / cols)
    const col = index % cols
    const t = random()
    const depth = Math.min(DEPTH_COUNT - 1, Math.floor(t * DEPTH_COUNT))
    const left = clamp(
      0,
      94,
      ((col + 0.5) * 100) / cols + (random() - 0.5) * (100 / cols) * 0.7,
    )
    const top = clamp(
      0,
      90,
      ((row + 0.5) * 100) / rows + (random() - 0.5) * (100 / rows) * 0.7,
    )
    return {
      id: index,
      depth,
      t,
      Icon: icons[Math.floor(random() * icons.length)] ?? Star,
      left,
      top,
      rotate: random() * 70 - 35,
    }
  })

  const layers = Array.from({ length: DEPTH_COUNT }, (_, depth) =>
    marks.filter((mark) => mark.depth === depth),
  )

  return (
    <div className={styles.zone} aria-hidden="true">
      {layers.map((layerMarks, depth) => (
        <div className={styles.layer} data-depth={depth} key={depth}>
          {layerMarks.map(({ id, t, Icon, left, top, rotate }) => (
            <div
              key={id}
              className={styles.mark}
              style={
                {
                  left: `${left}%`,
                  top: `${top}%`,
                  transform: `rotate(${rotate}deg)`,
                  '--doodle-t': t,
                } as CSSProperties
              }
            >
              <Icon size="100%" strokeWidth={1.8} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function clamp(min: number, max: number, value: number) {
  return Math.min(max, Math.max(min, value))
}
