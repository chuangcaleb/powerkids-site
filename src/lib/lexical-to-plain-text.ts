type LooseNode = { text?: unknown; children?: unknown }

function collectText(node: unknown, parts: string[]): void {
  if (!node || typeof node !== 'object') return
  const { text, children } = node as LooseNode

  if (typeof text === 'string' && text.trim() !== '') parts.push(text)
  if (Array.isArray(children)) children.forEach((child) => collectText(child, parts))
}

/**
 * Extracts plain text from a lexical richText tree. Same duck-typed `unknown`
 * walk as `lexicalHasText` (that type's discriminated union has no shared
 * base carrying `text`/`children`), but collects text instead of just
 * checking for its presence.
 */
export function lexicalToPlainText(data: unknown): string {
  if (!data || typeof data !== 'object') return ''
  const root = (data as { root?: unknown }).root
  const parts: string[] = []
  collectText(root, parts)
  return parts.join(' ').trim()
}
