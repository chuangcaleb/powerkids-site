import type { InputHTMLAttributes } from 'react'
import { cx } from '@/lib/cx'
import { FieldShell } from '../field-shell/field-shell'
import styles from './text-field.module.css'

export type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  name: string
  hint?: string
  error?: string
}

/** Labelled single-line input with hint/error text. Error always wins over hint. */
export function TextField({
  label,
  name,
  hint,
  error,
  className,
  id,
  ...rest
}: TextFieldProps) {
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
        <input
          id={fieldId}
          name={name}
          className={cx(styles.input, error && styles.invalid)}
          aria-invalid={Boolean(error)}
          aria-describedby={messageId}
          {...rest}
        />
      )}
    </FieldShell>
  )
}
