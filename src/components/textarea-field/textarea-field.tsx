import type { TextareaHTMLAttributes } from 'react'
import { cx } from '@/lib/cx'
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
  const fieldId = id ?? name
  const messageId = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined

  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={fieldId} className={styles.label}>
        {label}
      </label>
      <textarea
        id={fieldId}
        name={name}
        className={cx(styles.textarea, error && styles.invalid)}
        aria-invalid={Boolean(error)}
        aria-describedby={messageId}
        {...rest}
      />
      {error ? (
        <p id={messageId} className={styles.error}>
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className={styles.hint}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}
