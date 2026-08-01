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
 * create links. Matches the official website template's `AdminBar`
 * component as closely as this project's stack allows (CSS Modules
 * instead of Tailwind, one collection instead of three) — no iframe
 * detection, same as upstream.
 */
export function AdminBar({ preview }: Props) {
  const router = useRouter()
  const [show, setShow] = useState(false)

  const onAuthChange = useCallback((user: PayloadMeUser) => {
    setShow(Boolean(user?.id))
  }, [])

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
  }

  return (
    <div hidden={!show}>
      <PayloadAdminBar {...adminBarProps} />
    </div>
  )
}
