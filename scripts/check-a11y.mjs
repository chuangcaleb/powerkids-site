/**
 * Accessibility smoke check — axe-core against real rendered pages.
 *
 * Needs a running server (`pnpm dev` or `pnpm build && pnpm start`) with
 * real content seeded; it doesn't start one itself, since which routes exist
 * depends on whatever's in the DB. Not wired into `pnpm verify`: that runs
 * against CI's fake-env build, which has no DB to render real pages against.
 *
 *   pnpm dev            # separate terminal
 *   node scripts/check-a11y.mjs
 *   node scripts/check-a11y.mjs http://localhost:3000 /about /careers
 */
import puppeteer from 'puppeteer'
import { readFileSync } from 'node:fs'

const [, , maybeBaseUrl, ...maybeRoutes] = process.argv
const baseUrl = maybeBaseUrl ?? 'http://localhost:3000'
const routes = maybeRoutes.length ? maybeRoutes : ['/', '/careers']

const axeSource = readFileSync(
  new URL(import.meta.resolve('axe-core/axe.min.js')),
  'utf8',
)

const browser = await puppeteer.launch({ headless: true })
let violationCount = 0

try {
  for (const route of routes) {
    const url = new URL(route, baseUrl).toString()
    const page = await browser.newPage()

    try {
      await page.goto(url, { waitUntil: 'networkidle0' })
      await page.evaluate(axeSource)
      const { violations } = await page.evaluate(() => axe.run())

      console.log(`\n${url}`)
      if (violations.length === 0) {
        console.log('  no violations')
        continue
      }

      for (const violation of violations) {
        violationCount += 1
        console.log(`  [${violation.impact}] ${violation.id}: ${violation.help}`)
        for (const node of violation.nodes) {
          console.log(`    ${node.target.join(' ')}`)
        }
      }
    } finally {
      await page.close()
    }
  }
} finally {
  await browser.close()
}

if (violationCount > 0) {
  console.error(`\n${violationCount} accessibility violation(s) found.`)
  process.exit(1)
}

console.log('\nNo accessibility violations found.')
