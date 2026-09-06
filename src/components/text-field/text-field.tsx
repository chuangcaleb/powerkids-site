import type { InputHTMLAttributes } from 'react'
import { cx } from '@/lib/cx'
import styles from './text-field.module.css'
import { primitiveVars } from '@/lib/primitive-vars'

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
      <input
        id={fieldId}
        name={name}
        className={cx(styles.input, error && styles.invalid)}
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
