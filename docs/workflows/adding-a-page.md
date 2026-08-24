# Adding Page

**Purpose:** how new routes come into being — why most need no code at all.
**Read when:** someone ask for new page.

---

## Most pages need no developer

Point of rebuild. Editor creates `pages` record in admin panel, gives slug, stacks blocks, publishes. Catch-all route resolves it. No deploy, no PR.

Someone asks developer for "new page" — first question: is it really new _kind_ of page. Usually not — point them at [content-editing.md](content-editing.md).

## Page needs code only when

- Has behaviour no block can express (form, search, interactive tool).
- Generated from collection rather than authored — one route per program or event.
- Needs route-level machinery: custom caching, redirect, feed, non-HTML response.

## Steps, when code genuinely needed

1. **Confirm it isn't blocks job.** Write down why, in PR description.
2. **Decide URL.** v4 doesn't preserve v3 routes — see [decisions/0004-single-page-mvp-no-redirects.md](../adr/0004-single-page-mvp-no-redirects.md). Pick the URL fresh.
3. **Add route** under `src/app/(site)/`.
4. **Fetch content from CMS.** Copy in JSX is defect, including headings and empty states.
5. **Implement `generateMetadata`** — title, description, canonical, share image. Fall back to `seo-defaults`.
6. **Add `generateStaticParams`** for collection-driven routes.
7. **Handle not-found** properly, with `notFound()`.
8. **Add it to sitemap.**
9. **Update architecture overview** if route shape changed.
10. **Run verify loop**, then open PR.
