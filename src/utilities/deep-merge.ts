/** Narrows to a plain object (excludes arrays and null). */
export function isObject(item: unknown): item is Record<string, unknown> {
  return typeof item === 'object' && item !== null && !Array.isArray(item)
}

/** Recursively merges `source` into `target`, favoring `source` on conflicts. */
export function deepMerge<T, R>(target: T, source: R): T {
  const output = { ...target }
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in (target as object))) {
          Object.assign(output as Record<string, unknown>, { [key]: source[key] })
        } else {
          ;(output as Record<string, unknown>)[key] = deepMerge(
            (target as Record<string, unknown>)[key],
            source[key],
          )
        }
      } else {
        Object.assign(output as Record<string, unknown>, { [key]: source[key] })
      }
    })
  }
  return output
}
