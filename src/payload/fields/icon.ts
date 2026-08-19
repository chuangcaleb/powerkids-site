import type { TextField } from 'payload'
import { isIconName } from '@/lib/icons'

type IconFieldOptions = {
  /** Defaults to `icon` — override when a block stores more than one icon field. */
  name?: string
  /** Multi-select. Stored as a text array. */
  hasMany?: boolean
  required?: boolean
  /** Editor-facing help text. Say what the icon is *for*, not that it's an icon. */
  description?: string
  /** Admin column width, e.g. `'50%'` when paired with another field in a row. */
  width?: string
}

/**
 * Icon picker field, backed by the registry in `@/lib/icons`.
 *
 * `text`, not `select`, on purpose: a `select` compiles to a Postgres enum, so
 * every icon added would need a schema migration. `validate` keeps the set
 * closed instead. Payload ships no icon field as of 3.x, so the custom picker is
 * load-bearing — without it the admin renders a free-text input.
 */
export function iconField({
  name = 'icon',
  hasMany = false,
  required = false,
  description,
  width,
}: IconFieldOptions = {}): TextField {
  return {
    name,
    type: 'text',
    hasMany,
    required,
    admin: {
      width,
      description,
      components: {
        Field: '@/payload/admin/components/icon-picker#IconPicker',
      },
    },
    validate: (value: string | string[] | null | undefined) => {
      const names = Array.isArray(value) ? value : value ? [value] : []
      if (names.length === 0) {
        return required ? (hasMany ? 'Pick at least one icon.' : 'Pick an icon.') : true
      }

      const unknown = names.filter((entry) => !isIconName(entry))
      if (unknown.length === 0) return true

      // Only a registry cut that skipped its migration gets here; naming the
      // value makes it recoverable by hand.
      return `Not in the icon set: ${unknown.join(', ')}. Pick an icon from the list.`
    },
  }
}
