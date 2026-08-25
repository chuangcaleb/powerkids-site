'use client'

// Client component: reads `rowData` from the list-view table, which only
// exists in the browser.

import type { Media } from '@/payload-types'
import {
  Banner,
  Link,
  Pill,
  useConfig,
  useDocumentInfo,
  useFormFields,
  usePayloadAPI,
} from '@payloadcms/ui'
import type { DefaultCellComponentProps } from 'payload'
import { formatAdminURL } from 'payload/shared'

/** List-view marker for user story 3 — plus the live list of every doc
 * sharing its checksum. Not a schema-level `virtual` field on purpose — that
 * would run this query on every read of the doc anywhere in the app. This
 * fetch only fires while this exact admin view is mounted. See ADR 0005. */
export const ListDuplicateMedia: React.FC<DefaultCellComponentProps> = ({}) => {
  const { id, data } = useDocumentInfo()
  const { config } = useConfig()
  const hasDuplicate = useFormFields(([fields]) => fields.hasDuplicate?.value)
  const duplicateDismissed = useFormFields(([fields]) => fields.duplicateDismissed?.value)
  const checksum = useFormFields(([fields]) => fields.checksum?.value)
  const createdAt = data?.createdAt as string | undefined

  const mediaURL = formatAdminURL({
    apiRoute: config.routes.api,
    path: '/media',
    serverURL: config.serverURL,
  })

  // Not gated on dismissal — a dismissed doc still needs its real sibling
  // list, or `siblings: []` from a skipped fetch reads as "found nothing".
  // Sorted oldest-first so `siblings[0]` is the likely original.
  const [{ data: siblingsResponse, isLoading }] = usePayloadAPI(
    hasDuplicate && checksum ? mediaURL : '',
    {
      initialParams: {
        depth: 0,
        limit: 0,
        sort: 'createdAt',
        where: {
          and: [{ checksum: { equals: String(checksum) } }, { id: { not_equals: id } }],
        },
      },
    },
  )
  const siblings: Media[] | null = isLoading ? null : (siblingsResponse?.docs ?? [])

  // The group's oldest doc — self or the first sibling, since siblings come
  // back sorted ascending by `createdAt` — is the one likely worth keeping.
  const oldestSiblingCreatedAt = siblings?.[0]?.createdAt
  const selfIsOldest =
    !!siblings &&
    (siblings.length === 0 ||
      (!!createdAt && !!oldestSiblingCreatedAt && createdAt < oldestSiblingCreatedAt))

  if (!Boolean(hasDuplicate)) return null

  return (
    <Banner type={!duplicateDismissed ? 'error' : 'default'}>
      <p>
        <strong>Duplicate(s) detected:</strong>
      </p>
      {siblings === null && 'Checking for matching docs…'}
      {siblings?.length === 0 &&
        'No other matching doc found — it may have just been deleted.'}
      {!!siblings && siblings.length > 0 && (
        <ul>
          {siblings.map((doc, index) => (
            <li key={doc.id}>
              <Link
                href={formatAdminURL({
                  adminRoute: config.routes.admin,
                  path: `/collections/media/${doc.id}`,
                  serverURL: config.serverURL,
                })}
              >
                {doc.filename ?? `#${doc.id}`}
              </Link>{' '}
              {!selfIsOldest && index === 0 && (
                <Pill pillStyle="success" size="small">
                  Oldest
                </Pill>
              )}
            </li>
          ))}
        </ul>
      )}

      <div style={{ paddingBlockStart: '1em' }}>
        {selfIsOldest && (
          <Pill pillStyle="success" size="small">
            Oldest
          </Pill>
        )}
        {selfIsOldest
          ? '— This is the oldest duplicate and likely canonical, so you probably want to delete the others'
          : 'This is not the oldest duplicate, so you probably want to delete this copy.'}
      </div>
    </Banner>
  )
}
