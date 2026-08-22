/**
 * Builds a Payload REST `where` query string from `[field, operator, value]`
 * triples, ANDed together — the shape both the review banner's sibling fetch
 * and the dashboard widget's count/link need, hand-encoded identically
 * otherwise.
 */
export function whereQueryString(
  conditions: [field: string, operator: string, value: string][],
) {
  const params = new URLSearchParams()
  conditions.forEach(([field, operator, value], index) => {
    params.set(`where[and][${index}][${field}][${operator}]`, value)
  })
  return params.toString()
}
