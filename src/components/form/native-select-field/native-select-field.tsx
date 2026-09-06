import type { SelectHTMLAttributes } from 'react'
import { cx } from '@/lib/cx'
import { FieldShell } from '../field-shell/field-shell'
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
  return (
    <FieldShell label={label} name={name} error={error} id={id} className={className}>
      {({ fieldId, messageId }) => (
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
      )}
    </FieldShell>
  )
}
