'use client'

// Client component: reads `rowData` from the list-view table, which only
// exists in the browser.

import { Pill } from '@payloadcms/ui'
import type { DefaultCellComponentProps } from 'payload'

/** List-view marker for user story 3 — visible only while genuinely unreviewed. */
export const HasDuplicateCell: React.FC<DefaultCellComponentProps> = ({
  cellData: _,
  rowData,
}) => {
  if (!rowData.hasDuplicate) return null

  if (!rowData.duplicateDismissed) {
    return (
      <Pill pillStyle="error" size="small">
        Unhandled
      </Pill>
    )
  }

  return (
    <Pill pillStyle="light" size="small">
      Dismissed
    </Pill>
  )
}
