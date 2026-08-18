'use client'

import {
  fieldBaseClass,
  FieldDescription,
  FieldError,
  FieldLabel,
  ReactSelect,
  useField,
  type ReactSelectOption,
} from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'
import type { CSSProperties, ReactNode } from 'react'
import { cx } from '@/lib/cx'
import { ICON_NAMES, ICONS, iconLabel, isIconName, type IconName } from '@/lib/icons'
import styles from './icon-picker.module.css'

type IconOption = { label: ReactNode; value: IconName }

/** Element labels are passed through by Payload, so the glyph lives in the option. */
const OPTIONS: IconOption[] = ICON_NAMES.map((name) => {
  const Icon = ICONS[name]
  return {
    label: (
      <span className={styles.option}>
        <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
        {iconLabel(name)}
      </span>
    ),
    value: name,
  }
})

const OPTIONS_BY_NAME = new Map(OPTIONS.map((option) => [option.value, option]))

/**
 * Icon field control, built on Payload's `ReactSelect`. Required rather than
 * cosmetic: the field stores `text` so the registry can grow without a migration
 * (see `iconField`), and the default control for `text` is a free-text input.
 */
export const IconPicker: TextFieldClientComponent = ({ field, path }) => {
  const hasMany = Boolean(field.hasMany)
  const { value, setValue, showError } = useField<string | string[]>({ path })

  // A value outside the registry has no option to show; `validate` names it on save.
  const names = (Array.isArray(value) ? value : [value]).filter(isIconName)
  const selected = names
    .map((name) => OPTIONS_BY_NAME.get(name))
    .filter(Boolean) as IconOption[]

  return (
    <div
      className={cx(fieldBaseClass, 'select')}
      // Payload sets this on wrappers it renders itself; a custom Field has to
      // carry it, or `admin.width` is ignored.
      style={{ '--field-width': field.admin?.width } as CSSProperties}
    >
      <FieldLabel label={field.label} path={path} required={field.required} />
      <div className={`${fieldBaseClass}__wrap`}>
        <FieldError path={path} showError={showError} />
        <ReactSelect
          // Searches the stored name: the default matches on `label`, which is an element here.
          filterOption={(option, search) =>
            String((option as unknown as { data: IconOption }).data.value)
              .toLowerCase()
              .includes(search.replace(/\s/g, '').toLowerCase())
          }
          isClearable
          isMulti={hasMany}
          isSortable={hasMany}
          onChange={(option: ReactSelectOption | ReactSelectOption[]) => {
            const picked = (Array.isArray(option) ? option : option ? [option] : []).map(
              (entry) => entry.value as IconName,
            )
            setValue(hasMany ? picked : (picked[0] ?? null))
          }}
          options={OPTIONS}
          showError={showError}
          value={hasMany ? selected : selected[0]}
        />
      </div>
      <FieldDescription description={field.admin?.description} path={path} />
    </div>
  )
}
