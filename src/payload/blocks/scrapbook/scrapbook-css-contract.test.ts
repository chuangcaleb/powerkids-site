import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

/**
 * The layout and the CSS share one width figure — `--min-lane-width` — and CSS
 * can't compute a container-query threshold from a custom property, so the
 * tier switch spells the derived number out. These tests are what keep the
 * spelled-out number honest, and what keeps a viewport breakpoint from
 * creeping back in.
 */
const css = readFileSync(
  fileURLToPath(new URL('./scrapbook.module.css', import.meta.url)),
  'utf-8',
)

/** Whitespace-collapsed, so the formatter is free to wrap a long value. */
const flat = css.replace(/\s+/g, ' ')

/** Whitespace-stripped, for values the formatter may break across lines. */
const dense = css.replace(/\s/g, '')

/** Nominal `--gap` (`--space-l`) at its clamp midpoint, in rem. */
const NOMINAL_GAP_REM = 2.5

function customProperty(name: string): number {
  const match = css.match(new RegExp(`${name}:\\s*([\\d.]+)rem`))
  if (!match?.[1]) throw new Error(`${name} is not declared as a literal rem value`)
  return Number(match[1])
}

describe('scrapbook CSS contract', () => {
  it('declares --min-lane-width as a literal rem, so JS can resolve it', () => {
    expect(customProperty('--min-lane-width')).toBeGreaterThan(0)
  })

  it('declares --row-unit as a literal rem, so JS can resolve it', () => {
    expect(customProperty('--row-unit')).toBeGreaterThan(0)
  })

  it('switches tiers at the width that fits two minimum-width lanes', () => {
    const twoLanes = 2 * customProperty('--min-lane-width') + NOMINAL_GAP_REM
    expect(flat).toContain(`@container (width >= ${twoLanes}rem)`)
  })

  it('drops the reel gutter strictly below the tier switch, never at it', () => {
    const twoLanes = 2 * customProperty('--min-lane-width') + NOMINAL_GAP_REM
    expect(flat).toContain(`@container (width < ${twoLanes}rem)`)
    // An inclusive bound here overlaps the switch above by exactly one width,
    // where the gutter would vanish while the layout still reads two lanes.
    expect(flat).not.toContain(`@container (width <= ${twoLanes}rem)`)
  })

  it('sizes no-JS grid columns intrinsically, with no viewport breakpoint', () => {
    expect(dense).toContain(
      'repeat(auto-fit,minmax(min(100%,var(--min-lane-width)),1fr))',
    )
    // `@media (prefers-reduced-motion)` is fine; a width media query is not —
    // every width decision here belongs to the container or to `auto-fit`.
    expect(flat).not.toMatch(/@media\s*\(\s*width/)
  })
})
