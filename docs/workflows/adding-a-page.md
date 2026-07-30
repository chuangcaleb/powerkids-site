# Adding a Page

**Purpose:** how new routes come into being — and why most of them need no code at all.
**Read this when:** someone asks for a new page.

> **Status: not yet implemented.** Phase 4 delivers the catch-all route this depends on.

---

## Most pages need no developer

That is the point of the rebuild. An editor creates a `pages` record in the admin panel, gives it a slug, stacks blocks, and publishes. The catch-all route resolves it. No deploy, no PR.

If someone asks a developer for a "new page", the first question is whether it is really a new *kind* of page. Usually it isn't — point them at [content-editing.md](content-editing.md).

## A page needs code only when

- It has behaviour no block can express (a form, a search, an interactive tool).
- It is generated from a collection rather than authored — one route per program or event.
- It needs route-level machinery: custom caching, a redirect, a feed, a non-HTML response.

## Steps, when code is genuinely needed

1. **Confirm it isn't a blocks job.** Write down why, in the PR description.
2. **Decide the URL.** Check [../reference/content-inventory.md](../reference/content-inventory.md) for an existing v3 route — if one exists, keep it or add a redirect.
3. **Add the route** under `src/app/(site)/`.
4. **Fetch content from the CMS.** Copy in JSX is a defect, including headings and empty states.
5. **Implement `generateMetadata`** — title, description, canonical, share image. Fall back to `seo-defaults`.
6. **Add `generateStaticParams`** for collection-driven routes.
7. **Handle not-found** properly, with `notFound()`.
8. **Add it to the sitemap.**
9. **Extend the Playwright smoke run.**
10. **Update the route map** in the content inventory, and the architecture overview if the shape changed.
11. **Run the verify loop**, then open a PR.

## Redirects

Any URL that ever shipped must keep resolving. Old paths are listed in the content inventory's route map; redirects live in the Next config and are covered by a launch check.
