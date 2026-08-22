'use client'

// Client component: fetches the flagged-media count on mount, browser-only.

import { useConfig } from '@payloadcms/ui'
import { useEffect, useState } from 'react'
import { whereQueryString } from './where-query-string'

/** Shared by the widget's own fetch and the link it renders — both must filter identically. */
const REVIEW_QUEUE_QUERY = whereQueryString([
  ['hasDuplicate', 'equals', 'true'],
  ['duplicateDismissed', 'not_equals', 'true'],
])

/** Dashboard entry point into the duplicate-review queue — user stories 11-12. */
export const DuplicateReviewWidget: React.FC = () => {
  const { config } = useConfig()
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    fetch(`${config.serverURL}${config.routes.api}/media/count?${REVIEW_QUEUE_QUERY}`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((body: { totalDocs?: number }) => setCount(body.totalDocs ?? 0))
      .catch(() => setCount(null))
  }, [config.serverURL, config.routes.api])

  if (!count) return null

  return (
    <div className="dashboard__group">
      <a href={`${config.routes.admin}/collections/media?${REVIEW_QUEUE_QUERY}`}>
        {count} media doc{count === 1 ? '' : 's'} flagged as possible duplicates
      </a>
    </div>
  )
}
