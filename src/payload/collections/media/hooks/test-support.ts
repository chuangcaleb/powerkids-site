export type ChecksumWhere =
  | { and: [{ checksum: { equals: string } }, { id: { not_equals: number } }?] }
  | { checksum: { equals: string } }

/** Same checksum/id filtering the real `find` calls in this collection use — matches both `flagOwnDuplicate`'s `{ and: [...] }` shape and `recomputeDuplicateGroup`'s plain `{ checksum: { equals } }`. */
export function matchByChecksum<T extends { id: number; checksum: string }>(
  docs: T[],
  where: ChecksumWhere,
): T[] {
  const [checksumClause, idClause] = 'and' in where ? where.and : [where, undefined]
  return docs.filter(
    (doc) =>
      doc.checksum === checksumClause!.checksum.equals &&
      (!idClause || doc.id !== idClause.id.not_equals),
  )
}
