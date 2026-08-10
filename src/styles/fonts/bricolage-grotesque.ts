import localFont from 'next/font/local'

/**
 * Width axis is pinned to 90 (narrow) at build time — see
 * src/styles/fonts/bricolage-grotesque/NOTES.md. `opsz` and `wght` stay
 * variable; `font-optical-sizing: auto` in global CSS picks the right `opsz`
 * cut per rendered size.
 */
export const bricolageGrotesque = localFont({
  src: './bricolage-grotesque/bricolage-grotesque-variable.woff2',
  variable: '--font-bricolage-grotesque',
  weight: '200 800',
  style: 'normal',
  display: 'swap',
})
