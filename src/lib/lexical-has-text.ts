type LooseNode = { text?: unknown; children?: unknown }

function hasText(node: unknown): boolean {
  if (!node || typeof node !== 'object') return false
  const { text, children } = node as LooseNode

  if (typeof text === 'string' && text.trim() !== '') return true
  return Array.isArray(children) && children.some(hasText)
}

/**
 * A cleared-out lexical field (editor deleted all text but left the
 * paragraph shell) is a truthy object with no visible content — `if
 * (heading)` guards let it through and render an empty heading/landmark.
 * Walks the tree for at least one non-whitespace text node instead.
 *
 * Takes `unknown` rather than lexical's `SerializedEditorState`: that type's
 * node fields are a discriminated union with no shared base carrying
 * `text`/`children`, so it structurally rejects any hand-written duck type.
 * This only ever reads, never trusts the shape, so `unknown` is honest.
 */
export function lexicalHasText(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false
  const root = (data as { root?: unknown }).root
  return hasText(root)
}
