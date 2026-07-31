import localFont from 'next/font/local'

/**
 * Bounce (BNCE) and Informality (INFM) axes are kept alongside weight, for
 * future text animation — see src/fonts/shantell-sans/NOTES.md for why this
 * isn't loaded via next/font/google despite it listing the same axes.
 */
export const shantellSans = localFont({
  src: './shantell-sans/shantell-sans-variable.woff2',
  variable: '--font-shantell-sans',
  weight: '300 800',
  style: 'normal',
  display: 'swap',
})
