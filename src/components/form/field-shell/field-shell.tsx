import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'
import { primitiveVars } from '@/lib/primitive-vars'
import styles from './field-shell.module.css'

export type FieldShellRenderProps = {
  fieldId: string
  messageId: string | undefined
}

export type FieldShellProps = {
  label: string
  name: string
  hint?: string
  error?: string
  id?: string
  className?: string
  children: (props: FieldShellRenderProps) => ReactNode
}

/** Label/hint/error chrome shared by every field primitive — control itself is the caller's. */
export function FieldShell({
  label,
  name,
  hint,
  error,
  id,
  className,
  children,
}: FieldShellProps) {
  const fieldId = id ?? name
  const messageId = error ? `${fieldId}-error` : undefined

  return (
    <div className={cx('flow-3xs', className)}>
      <label
        htmlFor={fieldId}
        className={cx('cluster', styles.label)}
        style={primitiveVars({ '--cluster-gap': 'var(--space-3xs)' })}
      >
        {label}
        {hint ? <span className={styles.hint}> {hint}</span> : null}
      </label>
      {children({ fieldId, messageId })}
      {error ? (
        <p id={messageId} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  )
}
