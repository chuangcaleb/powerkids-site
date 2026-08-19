import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { REEL_BELOW_PX } from './scrapbook-collage'

/**
 * Guards the hand-mirrored copies of `REEL_BELOW_PX` in scrapbook.module.css
 * (see the constant for why CSS can't read it): if the constant changes, this
 * fails until both `@media` queries are updated, instead of drifting silently.
 */
describe('reel breakpoint stays in sync with scrapbook.module.css', () => {
  it('CSS media queries use the rem-equivalent of REEL_BELOW_PX', () => {
    const css = readFileSync(
      fileURLToPath(new URL('./scrapbook.module.css', import.meta.url)),
      'utf-8',
    )
    const expectedRem = `${REEL_BELOW_PX / 16}rem`

    expect(css).toContain(`@media (width >= ${expectedRem})`)
    expect(css).toContain(`@media (width <= ${expectedRem})`)
  })
})
