'use client'

// Client component: fetches the flagged-media count on mount, browser-only.

import { Banner, useConfig, usePayloadAPI } from '@payloadcms/ui'
import { formatAdminURL } from 'payload/shared'
import { whereQueryString } from './where-query-string'

/** Shared by the widget's own fetch and the link it renders — both must filter identically. */
const REVIEW_QUEUE_QUERY = whereQueryString([
  ['hasDuplicate', 'equals', 'true'],
  ['duplicateDismissed', 'not_equals', 'true'],
])

/** Dashboard entry point into the duplicate-review queue — user stories 11-12. */
export const DuplicateReviewWidget: React.FC = () => {
  const { config } = useConfig()

  const countURL = formatAdminURL({
    apiRoute: config.routes.api,
    path: '/media/count',
    serverURL: config.serverURL,
  })

  const [{ data }] = usePayloadAPI(countURL, {
    initialParams: {
      where: {
        and: [
          { hasDuplicate: { equals: true } },
          { duplicateDismissed: { not_equals: true } },
        ],
      },
    },
  })
  const count: number = data?.totalDocs ?? 0

  if (!count) return null

  const listURL = formatAdminURL({
    adminRoute: config.routes.admin,
    path: '/collections/media',
    serverURL: config.serverURL,
  })

  return (
    <Banner type="error">
      <p>
        <a href={`${listURL}?${REVIEW_QUEUE_QUERY}`}>
          {count} unhandled Media duplicate(s)
        </a>
      </p>
    </Banner>
  )
}
