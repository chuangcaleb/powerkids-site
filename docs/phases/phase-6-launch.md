# Phase 6 — Launch

**Goal:** replace the live site without breaking a URL, and hand the CMS to school staff.

Agent prepares. Owner switches DNS.

---

## Pre

- [ ] Phase 5 done — production content seeded and proof-read
- [x] **Email adapter configured.** Payload currently logs mail to console. Password resets reach nobody. Staff accounts cannot be handed over until this works — see `docs/ops/environments.md` "Known gaps".
- [ ] Production env vars set in Vercel, distinct `PAYLOAD_SECRET` from preview
- [ ] Owner has DNS access and a rollback window

## Work

**SEO** — `sitemap.xml`, `robots.txt`, canonical URLs, OG images. JSON-LD: `Organization`, plus `LocalBusiness` per school with address and phone. Sitemap generation queries every published `pages`/`programs`/`events` doc — use `select` for just `slug`/`updatedAt`, `pagination: false`, not full-depth `find`.

**Redirects** — every v3 URL resolves. Route map is in `docs/reference/content-inventory.md`. Includes the `/programs/daycare` slug mismatch and the `#our-schools` / `#our-team` anchors.

**Performance** — bundle budget, font loading strategy (Shantell Sans is variable; subset it), image `sizes` correctness. Consider raising media cache to `max-age=31536000, immutable` — safe because filenames are content-addressed.

**Accessibility audit** — keyboard, focus visibility, screen reader over nav and forms, contrast against `DESIGN.md` invariants, reduced-motion honoured.

**404 page** that helps rather than apologises.

**`docs/workflows/content-editing.md`** — written for school staff, in **plain prose, not caveman**. Screenshots per step. No jargon: say "photo library", "section", "site-wide settings", never "collection", "block", "global". Test by handing it to a staff member and watching them try, without helping.

**Cutover plan** — lower DNS TTL in advance; verify every old URL; switch; watch 404s; keep v3 deployment reachable until proven.

## Post

- [ ] Every v3 URL returns 200 or 301
- [ ] Lighthouse ≥95 across the board; accessibility 100
- [ ] Structured data validates
- [ ] Staff guide written and tested on an actual staff member
- [ ] At least one staff account created and able to log in
- [ ] Rollback documented and understood by owner
- [ ] `pnpm verify` green

## Verify

- Crawl the v3 sitemap, assert every URL resolves on the new deployment
- Lighthouse CI on the production build
- axe-core across all routes
- Real-device check: an actual phone on mobile data, not a desktop emulator. Malaysian mobile is the primary audience.
- Have a staff member add a page and swap a photo, unaided

## Traps

- **Rolling back code does not roll back a migration.** If a deploy migrated schema, restore the database to a point before it, then redeploy older code. See `docs/ops/deploy.md`.
- **Media cache is 4 hours by default.** Content-hashed filenames make replacements appear instantly, but a _deleted_ object may still serve from edge cache until TTL expires.
- **Preview deployments sit behind Vercel Authentication.** `curl` gets Vercel's login page, not the app. Verify in a browser.
- **Do not point preview at production data**, ever, including during launch checks.
- **The school's photos are irreplaceable.** R2 has no object versioning. Before any bulk media operation, confirm what a mistake would cost.
