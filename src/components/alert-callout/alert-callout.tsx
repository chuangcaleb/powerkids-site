import { AlertCircle } from 'lucide-react'
import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import { cx } from '@/lib/cx'
import styles from './alert-callout.module.css'

export type AlertCalloutProps = HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode
}

/**
 * Tint-chip error banner. Focus management (moving focus here on submit
 * failure) is the caller's job — this only renders the alert semantics.
 * Forwards its ref so the caller can call `.focus()` on submit failure.
 */
export const AlertCallout = forwardRef<HTMLDivElement, AlertCalloutProps>(
  function AlertCallout({ className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        role="alert"
        tabIndex={-1}
        className={cx(styles.callout, className)}
        {...rest}
      >
        <AlertCircle aria-hidden="true" className={styles.icon} />
        <p>{children}</p>
      </div>
    )
  },
)
