import type { TextareaHTMLAttributes } from 'react'
import { cx } from '@/lib/cx'
import { FieldShell } from '../field-shell/field-shell'
import styles from './textarea-field.module.css'

export type TextareaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  name: string
  hint?: string
  error?: string
}

/** Labelled multi-line input, resize locked to vertical only. */
export function TextareaField({
  label,
  name,
  hint,
  error,
  className,
  id,
  ...rest
}: TextareaFieldProps) {
  return (
    <FieldShell
      label={label}
      name={name}
      hint={hint}
      error={error}
      id={id}
      className={className}
    >
      {({ fieldId, messageId }) => (
        <textarea
          id={fieldId}
          name={name}
          className={cx(styles.textarea, error && styles.invalid)}
          aria-invalid={Boolean(error)}
          aria-describedby={messageId}
          {...rest}
        />
      )}
    </FieldShell>
  )
}
