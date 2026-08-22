'use client'

// Client component: reads live admin form state and fetches sibling docs on
// mount — both only make sense in the browser.

import { Banner, useConfig, useDocumentInfo, useFormFields } from '@payloadcms/ui'
import { useEffect, useState } from 'react'
import type { Media } from '@/payload-types'
import { whereQueryString } from './where-query-string'

/**
 * Above-the-fold notice for a flagged doc, plus the live list of every doc
 * sharing its checksum. Not a schema-level `virtual` field on purpose — that
 * would run this query on every read of the doc anywhere in the app. This
 * fetch only fires while this exact admin view is mounted. See ADR 0005.
 */
export const DuplicateReviewBanner: React.FC = () => {
  const { id } = useDocumentInfo()
  const { config } = useConfig()
  const hasDuplicate = useFormFields(([fields]) => fields.hasDuplicate?.value)
  const duplicateDismissed = useFormFields(([fields]) => fields.duplicateDismissed?.value)
  const checksum = useFormFields(([fields]) => fields.checksum?.value)
  const [siblings, setSiblings] = useState<Media[] | null>(null)

  const flagged = Boolean(hasDuplicate) && !duplicateDismissed

  useEffect(() => {
    // Nothing to reset when unflagged: the component renders nothing below,
    // so a stale `siblings` value from a previous flagged state is unused.
    if (!flagged || !checksum) return

    const query = whereQueryString([
      ['checksum', 'equals', String(checksum)],
      ['id', 'not_equals', String(id)],
    ])

    let cancelled = false

    fetch(`${config.serverURL}${config.routes.api}/media?depth=0&limit=0&${query}`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((body: { docs?: Media[] }) => {
        if (!cancelled) setSiblings(body.docs ?? [])
      })
      .catch(() => {
        if (!cancelled) setSiblings([])
      })

    return () => {
      cancelled = true
    }
  }, [flagged, checksum, id, config.serverURL, config.routes.api])

  if (!flagged) return null

  return (
    <Banner type="error">
      <strong>Possible duplicate.</strong> Another Media doc has identical file content.{' '}
      {siblings === null
        ? 'Checking for matching docs…'
        : siblings.length === 0
          ? 'No other matching doc found — it may have just been deleted.'
          : `Reuse instead: ${siblings.map((doc) => doc.filename ?? `#${doc.id}`).join(', ')}.`}
    </Banner>
  )
}
