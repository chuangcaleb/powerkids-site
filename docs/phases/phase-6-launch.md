# Phase 6 — Launch

**Goal:** replace the live site and hand the CMS to school staff. v3 URL parity dropped — see [decisions/0004-single-page-mvp-no-redirects.md](../decisions/0004-single-page-mvp-no-redirects.md).

Agent prepares. Owner switches DNS.

---

## Pre

- [ ] Owner has populated production CMS by hand (phase 5 permanently skipped, no seed script — see [phase-5-content-migration.md](phase-5-content-migration.md))
- [x] **Email adapter configured.** Payload currently logs mail to console. Password resets reach nobody. Staff accounts cannot be handed over until this works — see `docs/ops/environments.md` "Known gaps".
- [ ] Production env vars set in Vercel, distinct `PAYLOAD_SECRET` from preview
- [ ] Owner has DNS access and a rollback window

## Work

**SEO** — `sitemap.xml`, `robots.txt`, canonical URLs, OG images. JSON-LD: `Organization`, plus `LocalBusiness` per school with address and phone. Sitemap generation queries every published `pages`/`programs`/`events` doc — use `select` for just `slug`/`updatedAt`, `pagination: false`, not full-depth `find`.

- [x] **Performance.** Bundle audited (public route ~166KB gzip JS, admin's 1.1MB ajv/GraphQL bundle confirmed isolated to `/admin`, no fix needed). Bricolage subset trimmed 90KB → 70KB (`--layout-features='kern'` not `'*'`, see [NOTES.md](../../src/styles/fonts/bricolage-grotesque/NOTES.md)). Image `sizes` audited across all blocks, one real gap fixed (`polaroid-reel.tsx`). Media cache `max-age=31536000, immutable` still **not applied** — Cloudflare-side setting on custom domain, owner action, not code.

**Accessibility audit** — keyboard, focus visibility, screen reader over nav and forms, contrast against `DESIGN.md` invariants, reduced-motion honoured.

- [x] **404 page** that helps rather than apologises. Shipped.

**`docs/workflows/content-editing.md`** — written for school staff, in **plain prose, not caveman**. Screenshots per step. No jargon: say "photo library", "section", "site-wide settings", never "collection", "block", "global". Test by handing it to a staff member and watching them try, without helping.

**Cutover plan** — lower DNS TTL in advance; switch; watch 404s; keep v3 deployment reachable until proven.

## Post

- [ ] Lighthouse ≥95 across the board; accessibility 100
- [ ] Structured data validates
- [ ] Staff guide written and tested on an actual staff member
- [ ] At least one staff account created and able to log in
- [ ] Rollback documented and understood by owner
- [ ] `pnpm verify` green

## Verify

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
