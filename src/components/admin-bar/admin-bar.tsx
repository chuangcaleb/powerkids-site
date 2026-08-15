'use client'

import type { PayloadAdminBarProps, PayloadMeUser } from '@payloadcms/admin-bar'
import { PayloadAdminBar } from '@payloadcms/admin-bar'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

import { getClientSideUrl } from '@/lib/get-client-side-url'

type Props = { preview?: boolean }

/**
 * Site-wide editor toolbar: shows only once `PayloadAdminBar` confirms an
 * authenticated session (via `onAuthChange`), independent of draft mode —
 * an editor browsing the published site while logged in still gets edit/
 * create links. Otherwise matches the official website template's
 * `AdminBar` as closely as this project's stack allows (CSS Modules
 * instead of Tailwind, one collection instead of three).
 *
 * Suppressed inside the CMS's own Live Preview iframe (`window.self !==
 * window.top`) — the template doesn't handle this, but the editor there is
 * already looking at the doc one frame out, so the bar is redundant chrome
 * eating iframe height. Read directly during render, not stashed in state
 * via an effect — it can't change after mount, so there's nothing to
 * synchronize.
 */
export function AdminBar({ preview }: Props) {
  const router = useRouter()
  const [show, setShow] = useState(false)
  const isEmbedded = typeof window !== 'undefined' && window.self !== window.top

  const onAuthChange = useCallback((user: PayloadMeUser) => {
    setShow(Boolean(user?.id))
  }, [])

  if (isEmbedded) return null

  const adminBarProps: PayloadAdminBarProps = {
    cmsURL: getClientSideUrl(),
    collectionLabels: { plural: 'Pages', singular: 'Page' },
    collectionSlug: 'pages',
    onAuthChange,
    onPreviewExit: () => {
      fetch('/exit-preview').then(() => {
        router.push('/')
        router.refresh()
      })
    },
    preview,
    // Package default is `position: fixed`, which overlaps the header. Static
    // positioning puts it in normal flow, so it stacks above the header and
    // pushes the page down instead.
    style: { position: 'static' },
  }

  return (
    <div hidden={!show}>
      <PayloadAdminBar {...adminBarProps} />
    </div>
  )
}
