import type { Access } from 'payload'

/** Unconditional public access — for reads that carry no draft/publish state. */
export const anyone: Access = () => true
