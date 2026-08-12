import type { Field } from 'payload'

type ButtonFieldOptions = {
  /** Match the block's existing requiredness — defaults to optional. */
  required?: boolean
}

/** Shared label/url group for an optional call-to-action button. */
export function buttonField({ required = false }: ButtonFieldOptions = {}): Field {
  return {
    name: 'button',
    type: 'group',
    admin: {
      description: 'Optional call-to-action button.',
    },
    fields: [
      { name: 'label', type: 'text', required },
      { name: 'url', type: 'text', required },
    ],
  }
}
