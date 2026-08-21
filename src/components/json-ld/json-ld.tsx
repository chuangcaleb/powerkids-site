/**
 * `<` is escaped so CMS-sourced strings (school name, address) can't break out
 * of the script tag — JSON.stringify alone doesn't escape `</script>`.
 */
export function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c')

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
