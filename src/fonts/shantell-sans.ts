import localFont from 'next/font/local'

/**
 * Trimmed to the weight axis only — no Bounce, no Informality, no Spacing.
 * See src/fonts/shantell-sans/NOTES.md for how it was generated.
 */
export const shantellSans = localFont({
  src: './shantell-sans/shantell-sans-variable.woff2',
  variable: '--font-shantell-sans',
  weight: '300 800',
  style: 'normal',
  display: 'swap',
})
