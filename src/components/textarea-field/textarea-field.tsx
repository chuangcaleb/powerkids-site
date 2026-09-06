import type { TextareaHTMLAttributes } from 'react'
import { cx } from '@/lib/cx'
import styles from './textarea-field.module.css'
import { primitiveVars } from '@/lib/primitive-vars'

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
  const messageId = error ? `${fieldId}-error` : undefined

  return (
    <div className={cx(styles.field, className)}>
      <label
        htmlFor={fieldId}
        className={cx('cluster', styles.label)}
        style={primitiveVars({ '--cluster-gap': 'var(--space-3xs)' })}
      >
        {label}
        {hint ? <span className={styles.hint}> {hint}</span> : null}
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
      ) : null}
    </div>
  )
}
