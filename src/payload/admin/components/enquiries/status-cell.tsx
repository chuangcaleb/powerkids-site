'use client'

// Client component: reads `cellData` from the list-view table, which only
// exists in the browser.

import { Pill } from '@payloadcms/ui'
import type { DefaultCellComponentProps } from 'payload'

/** List-view status marker — no implicit "read" state, only unread/closed. */
export const StatusCell: React.FC<DefaultCellComponentProps> = ({
  cellData,
  rowData,
}) => {
  if (cellData === 'closed') {
    return (
      <Pill pillStyle="light" size="small">
        Closed
      </Pill>
    )
  }

  if (
    Array.isArray(rowData.notificationErrors) &&
    rowData.notificationErrors.length > 0
  ) {
    return (
      <Pill pillStyle="error" size="small">
        Failed
      </Pill>
    )
  }

  return (
    <Pill pillStyle="warning" size="small">
      Unread
    </Pill>
  )
}
