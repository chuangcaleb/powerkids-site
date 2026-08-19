import { Archivo } from 'next/font/google'

/**
 * Body face. `next/font/google` self-hosts the file at build time — no
 * runtime request to Google, same guarantee as Bricolage Grotesque's manual
 * pipeline, without needing one: Archivo ships no width axis worth pinning.
 */
export const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: 'normal',
  variable: '--font-archivo',
  display: 'swap',
})
