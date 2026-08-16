import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { REEL_BELOW_PX } from './scrapbook-collage'

/**
 * scrapbook.module.css can't read REEL_BELOW_PX (CSS media queries can't
 * consume a JS constant), so the breakpoint is hand-mirrored there in rem —
 * both `@media (width >= …)` (shows the no-JS grid) and `@media (width <=
 * …)` (zeroes the reel's text padding). This guards the one thing that
 * matters: if REEL_BELOW_PX changes, this fails until both CSS queries are
 * updated to match, instead of the two silently drifting apart.
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
