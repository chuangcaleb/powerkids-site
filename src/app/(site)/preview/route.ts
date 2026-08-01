import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'

import { requireEnv } from '@/lib/env'

/**
 * Enables Next.js draft mode and redirects to the page, so an editor can view
 * an unpublished `pages` document. Guarded by a shared secret — anyone who
 * knows it can read draft content, but not write it (draft mode carries no
 * elevated Payload access; `getPage` only bypasses the published filter).
 */
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  const slug = request.nextUrl.searchParams.get('slug')

  if (secret !== requireEnv('PREVIEW_SECRET')) {
    return new Response('Invalid preview secret', { status: 401 })
  }

  if (!slug) {
    return new Response('Missing slug', { status: 400 })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(slug === 'index' ? '/' : `/${slug}`)
}
