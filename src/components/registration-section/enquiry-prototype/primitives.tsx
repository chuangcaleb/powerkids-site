import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'
import { AlertTriangle } from 'lucide-react'
import { cx } from '@/lib/cx'
import styles from './primitives.module.css'

/** PROTOTYPE — throwaway. Standalone field/callout primitives, per #29's resolution: locked-in pieces get built for real, not re-described per variant. */

type FieldShellProps = {
  label: string
  hint?: string
  error?: string
  htmlFor: string
  wrapperClassName?: string
  children: ReactNode
}

function FieldShell({
  label,
  hint,
  error,
  htmlFor,
  wrapperClassName,
  children,
}: FieldShellProps) {
  return (
    <div className={cx(styles.field, wrapperClassName)}>
      <label htmlFor={htmlFor}>
        {label}
        {hint ? <span className={styles.hint}> {hint}</span> : null}
      </label>
      {children}
      {error ? (
        <span id={`${htmlFor}-error`} className={styles.error} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  )
}

export type TextFieldProps = {
  label: string
  hint?: string
  error?: string
  wrapperClassName?: string
  ref?: React.Ref<HTMLInputElement>
} & InputHTMLAttributes<HTMLInputElement>

export function TextField({
  label,
  hint,
  error,
  id,
  className,
  wrapperClassName,
  ref,
  ...rest
}: TextFieldProps) {
  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      htmlFor={id!}
      wrapperClassName={wrapperClassName}
    >
      <input
        ref={ref}
        id={id}
        className={cx(styles.control, className)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
    </FieldShell>
  )
}

export type TextAreaFieldProps = {
  label: string
  hint?: string
  error?: string
} & TextareaHTMLAttributes<HTMLTextAreaElement>

export function TextAreaField({
  label,
  hint,
  error,
  id,
  className,
  ...rest
}: TextAreaFieldProps) {
  return (
    <FieldShell label={label} hint={hint} error={error} htmlFor={id!}>
      <textarea
        id={id}
        className={cx(styles.control, styles.textarea, className)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
    </FieldShell>
  )
}

export type SelectFieldProps = {
  label: string
  error?: string
  options: string[]
} & SelectHTMLAttributes<HTMLSelectElement>

/** Native `<select>` with a custom chevron — the browser default reads too small/out of place on this card. */
export function SelectField({
  label,
  error,
  options,
  id,
  className,
  ...rest
}: SelectFieldProps) {
  return (
    <FieldShell label={label} error={error} htmlFor={id!}>
      <div className={styles.selectShell}>
        <select
          id={id}
          className={cx(styles.control, styles.select, className)}
          aria-invalid={Boolean(error)}
          {...rest}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <svg className={styles.chevron} viewBox="0 0 12 8" aria-hidden="true">
          <path
            d="M1 1l5 5 5-5"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </FieldShell>
  )
}

export type AlertTone = 'red-on-white' | 'tint-chip' | 'icon-only'

export type ErrorCalloutProps = {
  message: string
  tone: AlertTone
  calloutRef?: React.Ref<HTMLDivElement>
}

/** PROTOTYPE — three tone variants for #29's still-open "alert visual design" thread. */
export function ErrorCallout({ message, tone, calloutRef }: ErrorCalloutProps) {
  return (
    <div
      ref={calloutRef}
      className={cx(styles.callout, styles[`callout-${tone}`])}
      role="alert"
      tabIndex={-1}
    >
      <AlertTriangle aria-hidden="true" className={styles.calloutIcon} />
      <span>{message}</span>
    </div>
  )
}
