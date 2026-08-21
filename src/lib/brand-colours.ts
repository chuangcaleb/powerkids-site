/**
 * Literal colour values for contexts that can't consume CSS custom
 * properties: manifest.json (read by the OS, not a browser page) and the
 * mask-icon meta attribute. Keep in sync with `--colour-cream` and
 * `--colour-red` in src/styles/tokens/colour.css — everywhere else, use the
 * CSS tokens instead. See docs/design/tokens.md.
 */

export const BRAND = {
  cream: '#fffcf7',
  red: '#e12c2c',
}
