'use client'

// Client component: `useField` binds to the admin form state, which only
// exists in the browser.

import { fieldBaseClass, FieldLabel, useField } from '@payloadcms/ui'
import type { JSONFieldClientComponent } from 'payload'

/** Read-only bullet list — default JSON textarea is unreadable for a plain `string[]`. */
export const NotificationErrorsField: JSONFieldClientComponent = ({ field, path }) => {
  const { value } = useField<string[]>({ path })
  const errors = Array.isArray(value) ? value : []

  if (errors.length === 0) return null

  return (
    <div className={fieldBaseClass}>
      <FieldLabel label={field.label} path={path} />
      <ul>
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  )
}
