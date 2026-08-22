'use client'

// Client component: reads live admin form state — only makes sense in the browser.

import { Pill, useFormFields } from '@payloadcms/ui'

/**
 * Above-the-fold notice for a flagged doc.
 */
export const HasDuplicatePill: React.FC = () => {
  const hasDuplicate = useFormFields(([fields]) => fields.hasDuplicate?.value)
  const duplicateDismissed = useFormFields(([fields]) => fields.duplicateDismissed?.value)

  const flagged = Boolean(hasDuplicate) && !duplicateDismissed

  if (!flagged) return null

  return (
    <Pill pillStyle="error" size="small">
      Unhandled duplicate
    </Pill>
  )
}
