/**
 * Path generators for `SectionSeam`. Every shape emits the **cut edge only**,
 * drawn strictly left to right from `(0, 0)` to `(width, 0)`, staying within
 * `y ∈ [0, depth]` — no shape dips above its own strip. The fill polygon is
 * derived by closing the cut *upward*, off-canvas, in the same direction the
 * cut was drawn; reversing the point list would self-intersect the polygon
 * and let the band colour leak through the holes.
 *
 * `torn` and `wobble` take a `random` generator (from `createSeededRandom`)
 * so the jagged points are deterministic — same server and client render, no
 * hydration mismatch.
 */

export type SeamShape = 'arc' | 'torn' | 'wave' | 'pinking' | 'wobble' | 'flat'

const f = (n: number) => Math.round(n * 100) / 100

function cutPath(
  shape: SeamShape,
  width: number,
  depth: number,
  toothWidth: number,
  random?: () => number,
): string {
  const rand = random ?? Math.random

  if (shape === 'flat' || depth <= 0) return `M0,0 L${f(width)},0`

  if (shape === 'arc') {
    return `M0,0 Q${f(width / 2)},${f(depth * 2)} ${f(width)},0`
  }

  if (shape === 'pinking') {
    const n = Math.max(2, Math.round(width / toothWidth))
    const step = width / n
    const seg: string[] = []
    for (let i = 0; i < n; i++) {
      seg.push(`L${f((i + 0.5) * step)},${f(depth)}`)
      seg.push(`L${f((i + 1) * step)},0`)
    }
    return `M0,0 ${seg.join(' ')}`
  }

  if (shape === 'wave') {
    const n = Math.max(1, Math.round(width / (toothWidth * 2)))
    const step = width / n
    const h = step / 4
    const seg: string[] = []
    for (let i = 0; i < n; i++) {
      const a = i * step
      seg.push(
        `C${f(a + h)},${f(depth)} ${f(a + step / 2 - h)},${f(depth)} ${f(a + step / 2)},${f(depth / 2)}`,
      )
      seg.push(`C${f(a + step / 2 + h)},0 ${f(a + step - h)},0 ${f(a + step)},0`)
    }
    return `M0,0 ${seg.join(' ')}`
  }

  if (shape === 'torn') {
    const n = Math.max(4, Math.round(width / (toothWidth * 0.42)))
    const step = width / n
    const clampX = (x: number) => Math.min(width - step * 0.1, Math.max(step * 0.1, x))
    const seg: string[] = []
    for (let i = 1; i < n; i++) {
      const jitterX = (rand() - 0.5) * step * 0.5
      const y = Math.max(0, Math.min(depth, depth * (0.15 + rand() * 0.85)))
      seg.push(`L${f(clampX(i * step + jitterX))},${f(y)}`)
    }
    seg.push(`L${f(width)},0`)
    return `M0,0 ${seg.join(' ')}`
  }

  if (shape === 'wobble') {
    const n = Math.max(3, Math.round(width / (toothWidth * 1.4)))
    const step = width / n
    const mid = depth / 2
    const amp = depth / 2
    const ys = [0]
    for (let i = 1; i < n; i++) {
      ys.push(Math.max(0, Math.min(depth, mid + (rand() - 0.5) * 2 * amp * 0.7)))
    }
    ys.push(0)
    let d = 'M0,0'
    for (let i = 1; i < ys.length; i++) {
      const x = i * step
      const prevX = (i - 1) * step
      const prevY = ys[i - 1] ?? 0
      const y = ys[i] ?? 0
      d += ` Q${f((prevX + x) / 2)},${f(prevY)} ${f(x)},${f(y)}`
    }
    return d
  }

  return `M0,0 L${f(width)},0`
}

/** Half the (approximate) stroke headroom baked into the viewBox — see `SectionSeam`. */
export const SEAM_STROKE_REF = 6

export function buildSeamPath(
  shape: SeamShape,
  width: number,
  depth: number,
  toothWidth: number,
  random?: () => number,
) {
  const d = shape === 'flat' ? 0 : depth
  const cut = cutPath(shape, width, d, toothWidth, random)
  const top = -SEAM_STROKE_REF / 2
  const fill = `${cut} L${f(width)},${f(top)} L0,${f(top)} Z`
  return { cut, fill, depth: d }
}
