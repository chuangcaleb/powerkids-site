/**
 * Single source of truth for doodle icon identity — consumed by both
 * `doodle-layer.tsx`'s `ICON_MAP` (name -> lucide component) and any Payload
 * `select` field offering a doodle icon choice (e.g. scrapbook's
 * `doodleIcons`). Keeping one list means adding/renaming an icon can't drift
 * between a field's `options` and the component's lookup table.
 */
export const DOODLE_ICON_NAMES = [
  'star',
  'sun',
  'cloud',
  'sparkles',
  'smile',
  'feather',
  'music',
  'rocket',
  'palette',
  'pen-line',
  'zap',
  'rainbow',
  'flower',
] as const

export type DoodleIconName = (typeof DOODLE_ICON_NAMES)[number]
