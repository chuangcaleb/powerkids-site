import type { SelectHTMLAttributes } from 'react'
import { cx } from '@/lib/cx'
import styles from './native-select-field.module.css'

export type NativeSelectOption = { value: string; label: string }

export type NativeSelectFieldProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'children'
> & {
  label: string
  name: string
  options: NativeSelectOption[]
  placeholder?: string
  error?: string
}

/**
 * Native `<select>` with a custom SVG chevron — the browser-default chevron
 * reads too small/misplaced at this component's size (spec §7).
 */
export function NativeSelectField({
  label,
  name,
  options,
  placeholder,
  error,
  className,
  id,
  ...rest
}: NativeSelectFieldProps) {
  const fieldId = id ?? name
  const messageId = error ? `${fieldId}-error` : undefined

  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={fieldId} className={cx(styles.label, error && styles.invalid)}>
        {label}
      </label>
      <div className={styles.selectWrap}>
        <select
          id={fieldId}
          name={name}
          className={cx(styles.select, error && styles.invalid)}
          aria-invalid={Boolean(error)}
          aria-describedby={messageId}
          {...rest}
        >
          {placeholder ? (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          ) : null}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          className={styles.chevron}
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1 1.5L6 6.5L11 1.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {error ? (
        <p id={messageId} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  )
}
