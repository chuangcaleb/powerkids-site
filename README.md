# powerkids-site

Website for **PowerKids Kindergarten** — three schools across the Klang Valley, Malaysia. <https://powerkids.edu.my>

This v4 is a ground-up rebuild in PayloadCMS. Its purpose is to move every piece of content out of code and into a CMS, so school staff can edit copy, swap photos, add pages, and rearrange sections without a developer.

## Stack

| Layer     | Choice                                                                                                             |
| --------- | ------------------------------------------------------------------------------------------------------------------ |
| Framework | [Next.js](https://nextjs.org) (App Router)                                                                         |
| CMS       | [Payload](https://payloadcms.com), mounted in same app                                                             |
| Database  | [Neon](https://neon.tech) Postgres                                                                                 |
| Media     | [Cloudflare R2](https://developers.cloudflare.com/r2/), S3-compatible adapter                                      |
| Hosting   | [Vercel](https://vercel.com)                                                                                       |
| Styling   | Vanilla CSS — design tokens, [Every Layout](https://every-layout.dev/layouts/) composition primitives, CSS Modules |
| Language  | TypeScript, strict                                                                                                 |
| Packages  | pnpm                                                                                                               |

Versions pinned exactly, not caret-ranged. Payload couples tightly to Next — doesn't support Next `15.5`–`16.1.x` — so upgrades are deliberate change, not incidental.

## Getting started

```bash
pnpm install
cp .env.example .env
```

Fill in `.env`. See [docs/workflows/environments.md](docs/workflows/environments.md).

```bash
pnpm migrate
pnpm dev
```

Public site runs at [localhost:3000](http://localhost:3000), admin panel at [/admin](http://localhost:3000/admin). Avoid `/admin`'s account-creation prompt — this project stores one permanent dev admin credentials. Set it up:

```bash
pnpm sync:dev-admin  # paste credentials from your password manager
pnpm seed:dev-admin  # creates/updates the account in your local DB
```

See [docs/workflows/environments.md](docs/workflows/environments.md#dev-admin-account) for why and the full flow.

**Every variable must be set before anything runs, including build** — Payload config reads them while Next collects page data. Missing one fails loudly, naming itself.

### Commands

|                              |                                                          |
| ---------------------------- | -------------------------------------------------------- |
| `pnpm dev`                   | Dev server                                               |
| `pnpm verify`                | lint → typecheck → test → build. Run before committing.  |
| `pnpm migrate`               | Apply pending migrations                                 |
| `pnpm migrate:create <name>` | Generate migration after schema change                   |
| `pnpm generate:types`        | Regenerate `payload-types.ts`                            |
| `pnpm generate:importmap`    | Regenerate admin import map after adding admin component |

Git hooks handle formatting on commit, run full verify loop on push.

## Engineering conventions

### Content

**One app, two route groups.** Following PayloadCMS recommended conventions, `src/app/(site)/` is the public-facing marketing site; `src/app/(payload)/` is the generated Payload admin panel, mounted in the same Next.js deploy rather than run as a separate service (see [ADR 0001](docs/adr/0001-nextjs-payload-vercel.md)). `(payload)` and `src/payload-types.ts` are generated output — excluded from lint/format, never hand-edited, regenerated with `pnpm generate:types`.

**Content is data, never markup.** Page content, navigation, contact details — all are CMS records (`src/payload/collections/`, `src/payload/globals/`), not hardcoded JSX. Pages are editor-composed from a closed catalogue of **blocks** — see [docs/architecture/blocks.md](docs/architecture/blocks.md).

### Design & Styling

**Token-driven design.** Avoid magic values, always declare standard tokens in native CSS Variables. `DESIGN.md` is the primary source of truth for why. `src/styles/tokens/` is the implementation of tokens, and the next highest authority.

**Reusable layout primitives.** [Every Layout](https://every-layout.dev/layouts/) methodology is to give layout _hints_ to the browser, and let the browser decide. There's really only a handful of layout archetypes, so we should avoid micromanaging every single box.

**Fluid scales for responsive type and space.** We avoid media breakpoints like the plague (lol) so there's a smooth size scaling between each pixel difference in screen width, instead of sudden jumps. Also allows us to avoid eyeballing arbitrary sizes and breakpoints.

### Media assets

**Media filenames are content-addressed.** Uploads are renamed to include a content hash (`hero-4846c1b1.webp`) before Payload derives size variants, so edge cache never serves stale assets after a replacement. See [docs/workflows/environments.md#media-serving-and-cache](docs/workflows/environments.md#media-serving-and-cache).

**Duplicate uploads are flagged, not blocked.** Media re-uploads are detected by checksum group and flagged to editors for review/dismissal, rather than silently rejected. See [ADR 0005](docs/adr/0005-media-duplicate-detection-by-checksum-group.md).

### Locations map

<!-- SCAFFOLD — 10 candidate one-liners. Narrow down, then rewrite as prose in the
     style of the sections above: bolded claim sentence, then one supporting sentence,
     then a link to the deeper doc if one exists. -->

- **Click-to-load facade.** Map renders as a static poster image + button; the 263 KB gz MapLibre engine is fetched only after a click, so the page's initial JS is unaffected.
- **The code-split is defended in code.** The `mapLib` promise is created _inside_ the click handler — hoisting it to module scope would pull the engine into the component's own chunk and silently undo the split.
- **Shared facade primitive.** `ClickToLoadFacade` is the one bordered 16:9 poster-button shape behind every deferred embed (map, video); the payload it unlocks is the caller's concern.
- **Self-hosted-free tiles, no key, no bill.** Tiles come from OpenFreeMap (`liberty` style); "Get directions" uses the keyless Google Maps URLs API, so neither path is metered or needs a secret.
- **Tile style is code, not CMS.** The style URL is a technical endpoint, not editorial content — one of the few deliberate exceptions to "content is data".
- **DOM markers over a symbol layer.** A symbol layer hides colliding icons at low zoom; DOM markers always show all three schools.
- **Accessibility comes from the native binding.** Binding a real MapLibre `Popup` via `setPopup` gives each marker `role="button"`, a managed tabindex, and a keyboard-reachable popup for free — only the generic "Map marker" label is overridden, with the Location's own name.
- **Popups still render through React.** `createRoot` per marker keeps CMS strings as text nodes rather than injected HTML.
- **Initial view is derived, not configured.** `mapCenter` averages every Location's coordinates and picks the zoom from how many there are — editors never hand-tune a viewport.
- **The worker ships via a build script.** MapLibre v6 is ESM-only and resolves its worker from `import.meta.url`; neither bundler emits the worker's sibling module, so the map mounts and never requests a tile — silently. `scripts/copy-maplibre-worker.mjs` copies both files into `public/`, wired to `predev`/`prebuild` because `postinstall` alone gets skipped.
- **One source, two surfaces.** The `locations` block has no fields — list, map, and footer contact all read Site Settings > Locations, so an address is edited once.

### Enquiry form

<!-- SCAFFOLD — 10 candidate one-liners. Same treatment as above. -->

- **Two-step wizard, one submit.** Step 1 asks what the enquiry is about; step 2 collects contact details — both steps stay mounted, so nothing is lost stepping back.
- **Reply-by drives what's required.** WhatsApp/Call require a phone, Email requires an email — never both, never neither.
- **Switching reply-by clears the error it invalidated.** A "Required." on the now-optional field disappears immediately rather than waiting for the next submit attempt.
- **One validation module, three call sites.** `validate-enquiry.ts` is shared by the client wizard, the Server Action, and the collection's field `validate` functions — the client copy is UX, the server copies are the authority.
- **Manual action dispatch, on purpose.** Native `<form action>` rethrows a WAF-denied response to the nearest error boundary — there is none, so it would crash the page; calling the Server Action by hand lets the form catch transport failures and show its own alert.
- **Invisible bot defence, lazily loaded.** The Turnstile script loads only when the form scrolls within 200 px or gains focus, never on page load; verification is server-side, and a rejected token is dropped, never persisted.
- **The security boundary is a hook, not field access.** `stripStaffOnlyFields` deletes staff-only keys on any unauthenticated write — field-level `access.create: false` only signals intent to the admin UI, and the Server Action passes `overrideAccess: false` so the Local API doesn't bypass it all.
- **The notification email can't destroy the enquiry.** Payload runs `afterChange` before the commit, so a throw would kill the transaction and delete the record; the send is caught, and the failure recorded on the doc as `notificationErrors` via a follow-up write.
- **Failures surface to staff, not just to logs.** A non-empty `notificationErrors` renders a warning in the admin panel — "someone enquired and nobody was emailed" is visible rather than silent.
- **Submitted fields are readonly forever.** Only `status` is editable; closing stamps `closedBy`/`closedAt` and re-opening clears them — current state, not an audit log.
- **The type label is snapshotted.** Storing the label alongside the soft row-id reference means a later-deleted enquiry-type option still reads correctly months on.
- **No-JS gets an honest fallback.** Bot defence is client-side, so there is no progressive-enhancement submit path; without JS the form is hidden and replaced with a pointer to direct contact details.

## Documentation

- **AGENTS.md** — conventions, non-negotiables, pointers to everything else. Start here.
- **CONTEXT.md** — domain glossary.
- **DESIGN.md** — visual identity: tokens, type scale, invariants.
- **docs/architecture/** — system shape, content model, block catalogue.
- **docs/design/** — layout primitives, tokens, components.
- **docs/workflows/** — git, verify loop, worktrees, environments, deploy, migrations, how to add a block or page, how to edit content.
- **docs/adr/** — architecture decision records.
- **docs/future/** — deferred, larger-scope work with no current owner or timeline.

## Previous versions

- v1 was made in 2019 with **Weebly** website builder.
- v2 was made in 2021 with **Jekyll**, [source code here](https://github.com/chuangcaleb/powerkids-jekyll)
- v3 was made in 2023 with **Astro**, see [v3-final](https://github.com/chuangcaleb/powerkids-site/tree/v3-final) branch.
  - Optimised performance with minimal Astro.js + Typescript
  - Interactive components with shadcn/ui + Radix UI + React
  - Responsive design with Tailwind CSS, with Utopia's fluid typography/spacing
  - SEO friendly with sitemap and robots.txt generation
  - Image optimization with Cloudinary
  - High Lighthouse performance with techniques

## Licence

MIT
