/**
 * Fixed brand strings.
 *
 * Exempt from the "content is data, never markup" rule: these are chrome, not
 * editable content. The legal name is a fixed display convention (same reason
 * `Wordmark` hard-codes its lettering — see docs/architecture/content-model.md)
 */

export const SITE_NAME = 'PowerKids Kindergarten'

export const SITE_CREDIT = {
  label: 'Chuang Caleb',
  url: 'https://chuangcaleb.com',
} as const
