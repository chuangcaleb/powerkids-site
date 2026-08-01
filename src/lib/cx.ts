/**
 * Joins CSS Module classnames, dropping falsy values. Not clsx — no object
 * syntax, no dedup — because nothing here needs more than an array of
 * strings-or-undefined; reach for clsx only if that stops being true.
 */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}
