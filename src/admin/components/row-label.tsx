'use client'

import type { RowLabelProps } from '@payloadcms/ui'
import { useRowLabel } from '@payloadcms/ui'

type RowData = {
  label?: string
  name?: string
  number?: string
  heading?: string
  link?: { label?: string }
}

/**
 * Generic row label for admin array fields. Tries the field names that
 * actually occur in this schema (label, name, number, heading, link.label)
 * rather than being written per-field like the reference implementation —
 * one component covers schools.phones, site-settings.phones,
 * navigation.header/footerColumns, and events.videos.
 */
export const RowLabel: React.FC<RowLabelProps> = () => {
  const { data, rowNumber } = useRowLabel<RowData>()

  const label =
    data?.label ?? data?.name ?? data?.number ?? data?.heading ?? data?.link?.label
  const index = rowNumber !== undefined ? rowNumber + 1 : ''

  return <div>{label ? `${index}: ${label}` : 'Row'}</div>
}
