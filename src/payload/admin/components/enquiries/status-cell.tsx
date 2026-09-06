'use client'

// Client component: reads `cellData` from the list-view table, which only
// exists in the browser.

import { Pill } from '@payloadcms/ui'
import type { DefaultCellComponentProps } from 'payload'

/** List-view status marker — no implicit "read" state, only unread/closed. */
export const StatusCell: React.FC<DefaultCellComponentProps> = ({ cellData }) => {
  if (cellData === 'closed') {
    return (
      <Pill pillStyle="light" size="small">
        Closed
      </Pill>
    )
  }

  return (
    <Pill pillStyle="error" size="small">
      Unread
    </Pill>
  )
}
