import type { PayloadRequest } from 'payload'

/**
 * Threaded via `context` on the `update` calls this file makes, so the
 * `afterChange` hook they trigger recognises its own writes and skips
 * recursing back into this function.
 */
export const SKIP_RECOMPUTE_CONTEXT_KEY = 'skipDuplicateRecompute'

/**
 * Recomputes `hasDuplicate` for every doc sharing `checksum` — not just
 * whichever doc triggered the write. `checksum` is the sole source of truth
 * for group membership (see ADR 0005), so this can run unconditionally after
 * any create, file-replace, or delete that touches the group: a group
 * shrunk to 1 member flips that survivor back to `false`; a group grown from
 * 1 to 2 flips the original (previously unflagged) member to `true` too.
 *
 * A survivor's `duplicateDismissed` is reset alongside `hasDuplicate: false`
 * — once no duplicate exists, a stale dismissal would otherwise resurface
 * (still checked) if the same checksum reappears later.
 */
export async function recomputeDuplicateGroup(
  checksum: string | null | undefined,
  req: PayloadRequest,
): Promise<void> {
  if (!checksum) return

  const group = await req.payload.find({
    collection: 'media',
    where: { checksum: { equals: checksum } },
    depth: 0,
    limit: 0,
    req,
  })

  const hasDuplicate = group.docs.length > 1

  // Sequential, not `Promise.all`: these updates share `req`'s transaction,
  // so firing them concurrently races multiple writes against one
  // connection — one can throw mid-flight, which the caller catches and
  // swallows, leaving the group partially flagged with no visible error.
  for (const doc of group.docs) {
    const data: { hasDuplicate: boolean; duplicateDismissed?: false } = { hasDuplicate }
    if (!hasDuplicate) data.duplicateDismissed = false

    const isUnchanged =
      Boolean(doc.hasDuplicate) === hasDuplicate &&
      (hasDuplicate || Boolean(doc.duplicateDismissed) === false)
    if (isUnchanged) continue

    await req.payload.update({
      collection: 'media',
      id: doc.id,
      data,
      depth: 0,
      req,
      context: { [SKIP_RECOMPUTE_CONTEXT_KEY]: true },
    })
  }
}
