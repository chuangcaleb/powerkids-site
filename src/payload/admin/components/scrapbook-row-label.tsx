'use client'

import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'
import type { RowLabelProps } from '@payloadcms/ui'
import { useRowLabel } from '@payloadcms/ui'
import type { ScrapbookBlock } from '@/payload-types'

type RowData = NonNullable<ScrapbookBlock['items']>[number]

/**
 * Scrapbook items key their heading off `header.heading`, a richText field —
 * the generic `RowLabel` only handles plain-string keys, so this extracts
 * plaintext instead of a per-block one-off.
 */
export const ScrapbookRowLabel: React.FC<RowLabelProps> = () => {
  const { data, rowNumber } = useRowLabel<RowData>()

  const heading = data?.header?.heading
  const label = heading ? convertLexicalToPlaintext({ data: heading }) : ''
  const index = rowNumber !== undefined ? rowNumber + 1 : ''

  return <div>{label ? `${index}: ${label}` : 'Row'}</div>
}
