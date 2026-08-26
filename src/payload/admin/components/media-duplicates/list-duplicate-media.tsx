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

/** List-view marker for user story 3 — plus the live list of every asset
 * sharing its checksum. Not a schema-level `virtual` field on purpose — that
 * would run this query on every read of the asset anywhere in the app. This
 * fetch only fires while this exact admin view is mounted. See ADR 0005. */
export const ListDuplicateMedia: React.FC<DefaultCellComponentProps> = ({}) => {
  const { id, data } = useDocumentInfo()
  const { config } = useConfig()
  const hasDuplicate = useFormFields(([fields]) => fields.hasDuplicate?.value)
  const duplicateDismissed = useFormFields(([fields]) => fields.duplicateDismissed?.value)
  const checksum = useFormFields(([fields]) => fields.checksum?.value)
  const createdAt = typeof data?.createdAt === 'string' ? data.createdAt : undefined

  const mediaURL = formatAdminURL({
    apiRoute: config.routes.api,
    path: '/media',
    serverURL: config.serverURL,
  })

  // Not gated on dismissal — a dismissed asset still needs its real sibling
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

  // Self merged into the sibling list so the rendered list has one row per
  // asset in the group, sorted newest-first — matches how the "Oldest" badge
  // and the closing sentence both need to point at the last row.
  const group =
    siblings === null
      ? null
      : [
          ...siblings.map((asset) => ({
            id: asset.id,
            filename: asset.filename,
            createdAt: asset.createdAt,
            isSelf: false,
          })),
          {
            id,
            filename: typeof data?.filename === 'string' ? data.filename : undefined,
            createdAt,
            isSelf: true,
          },
        ].sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))

  const selfIsOldest = !!group && group[group.length - 1]?.isSelf

  if (!Boolean(hasDuplicate)) return null

  return (
    <Banner type={!duplicateDismissed ? 'error' : 'default'}>
      <p>
        <strong>These media assets are duplicates:</strong>
      </p>
      {siblings === null && 'Checking for matching assets…'}
      {siblings?.length === 0 &&
        'No other matching asset found — it may have just been deleted.'}
      {!!group && siblings!.length > 0 && (
        <ul>
          {group.map((asset, index) => (
            <li key={asset.id}>
              {asset.isSelf ? (
                (asset.filename ?? `#${asset.id}`)
              ) : (
                <Link
                  href={formatAdminURL({
                    adminRoute: config.routes.admin,
                    path: `/collections/media/${asset.id}`,
                    serverURL: config.serverURL,
                  })}
                >
                  {asset.filename ?? `#${asset.id}`}
                </Link>
              )}{' '}
              {index === group.length - 1 && (
                <Pill pillStyle="success" size="small">
                  Oldest
                </Pill>
              )}
            </li>
          ))}
        </ul>
      )}

      <div style={{ paddingBlockStart: '1em' }}>
        {selfIsOldest
          ? 'Current media asset is the oldest duplicate. You probably want to delete the other copies.'
          : 'Current media asset is a later duplicate. You probably want to delete this copy.'}
      </div>
    </Banner>
  )
}
