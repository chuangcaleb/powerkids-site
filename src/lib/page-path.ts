/**
 * Slug ⇄ route-path mapping for `pages`.
 *
 * The homepage is stored as the slug `index` (Payload needs a non-empty slug),
 * but serves from `/`. That rule was inlined at five call sites in three
 * different shapes — two of which disagreed on whether the root is `''` or
 * `/` — so it lives here now: changing the homepage convention is one edit.
 *
 * Paths always start with a slash and never end with one (Next's default
 * `trailingSlash: false`), and `revalidatePath` needs the root spelled `/`.
 */

export const INDEX_SLUG = 'index'

/** Route path for a page slug. `index` maps to the site root. */
export function pathForSlug(slug: string | null | undefined) {
  return !slug || slug === INDEX_SLUG ? '/' : `/${slug}`
}

/** Inverse of {@link pathForSlug}: catch-all route segments to a page slug. */
export function slugFromSegments(segments: string[] | undefined) {
  return segments?.length ? segments.join('/') : INDEX_SLUG
}

/**
 * Absolute URL for a page slug, given an origin. The root collapses to the
 * bare origin so the homepage has one canonical spelling in `og:url` and in
 * Payload's live-preview/SEO URLs, not two.
 */
export function urlForSlug(origin: string, slug: string | null | undefined) {
  const path = pathForSlug(slug)
  return path === '/' ? origin : `${origin}${path}`
}
