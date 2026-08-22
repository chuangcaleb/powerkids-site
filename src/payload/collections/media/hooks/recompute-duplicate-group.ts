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

  await Promise.all(
    group.docs
      .filter((doc) => Boolean(doc.hasDuplicate) !== hasDuplicate)
      .map((doc) =>
        req.payload.update({
          collection: 'media',
          id: doc.id,
          data: { hasDuplicate },
          depth: 0,
          req,
          context: { [SKIP_RECOMPUTE_CONTEXT_KEY]: true },
        }),
      ),
  )
}
