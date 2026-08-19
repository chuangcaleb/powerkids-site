/**
 * Deterministic PRNG for server-rendered decorative placement. Math.random
 * would render a different layout per request — client and server disagree,
 * React throws a hydration mismatch. This is a pure function of `seed`, so
 * server and client always produce the same sequence.
 */
export function createSeededRandom(seed: string): () => number {
  let state = hashString(seed)

  return function random() {
    // mulberry32
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashString(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (Math.imul(31, hash) + input.charCodeAt(i)) | 0
  }
  return hash
}
