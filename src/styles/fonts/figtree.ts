import { Figtree } from 'next/font/google'

/**
 * Body face. `next/font/google` self-hosts the file at build time — no
 * runtime request to Google. No axis worth pinning.
 */
export const figtree = Figtree({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: 'normal',
  variable: '--font-figtree',
  display: 'swap',
})
