/**
 * Turn a title into a URL-safe slug.
 *
 * Used to default the `slug` field when an editor creates a page without
 * setting one. Deliberately conservative: it strips rather than transliterates,
 * so an unexpected character can never produce a surprising URL.
 */
export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    // Strip combining marks left behind by the decomposition above.
    .replaceAll(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-+|-+$/g, '')
}
