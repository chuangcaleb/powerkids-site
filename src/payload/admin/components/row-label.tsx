'use client'

import type { RowLabelProps } from '@payloadcms/ui'
import { useRowLabel } from '@payloadcms/ui'

type RowData = {
  label?: string
  name?: string
  number?: string
  title?: string
  heading?: string
  question?: string
  link?: { label?: string }
}

/**
 * Generic row label for admin array fields. Tries the field names that
 * actually occur in this schema (label, name, number, title, heading,
 * question, link.label) rather than being written per-field like the
 * reference implementation — one component covers every row-array field in
 * the collections and blocks.
 */
export const RowLabel: React.FC<RowLabelProps> = () => {
  const { data, rowNumber } = useRowLabel<RowData>()

  const label =
    data?.label ??
    data?.name ??
    data?.number ??
    data?.title ??
    data?.heading ??
    data?.question ??
    data?.link?.label
  const index = rowNumber !== undefined ? rowNumber + 1 : ''

  return <div>{label ? `${index}: ${label}` : 'Row'}</div>
}
