'use client'

// Client component: reads `rowData` from the list-view table, which only
// exists in the browser.

import { Pill } from '@payloadcms/ui'
import type { DefaultCellComponentProps } from 'payload'

/** List-view marker for user story 3 — visible only while genuinely unreviewed. */
export const HasDuplicateCell: React.FC<DefaultCellComponentProps> = ({
  cellData,
  rowData,
}) => {
  if (!cellData || rowData.duplicateDismissed) return null

  return <Pill pillStyle="warning">Possible duplicate</Pill>
}
