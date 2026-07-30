# 0001. Next.js + Payload on Vercel, Neon, and R2

**Status:** accepted
**Date:** 2026-07-30

## Context

v3 is an Astro site with all content hard-coded in components. School staff cannot change a phone number, swap a photo, or add a page without a developer. The rebuild's primary requirement is that they can — including adding pages and rearranging sections, though only from a fixed set of components so the site cannot be visually broken by an editor.

Constraints:

- Editors are non-technical school staff. A Git-based workflow is not viable.
- Small budget; a kindergarten site with modest traffic.
- The owner is a competent developer working largely through coding agents, so a widely-documented stack matters — obscure tooling means more hand-holding.
- Content must be genuinely data-driven: navigation, socials, contact details, schools, programs, and events all live in the CMS.

## Decision

Next.js (App Router, `>=16.2.2`) with Payload (`>=3.73`) mounted in the same application, on Vercel, with Neon Postgres and Cloudflare R2 for media.

## Consequences

**Makes easy.** Payload's `blocks` field is precisely the "editors pick from a fixed set and reorder" requirement, with drag-and-drop, out of the box. One repository, one deploy, one type system: schema changes regenerate types that the renderers consume, so a field rename becomes a type error rather than a runtime blank. Vercel's Node runtime gives us `sharp`, so Payload generates image sizes at upload and R2 just stores bytes — no image-transform service, no second vendor. Draft preview and version history come with the CMS.

**Makes hard.** Astro's zero-JS default is gone; keeping the site light is now a discipline (server components everywhere, `"use client"` justified in a comment) rather than a property of the framework. There is a database to run, back up, and migrate — schema changes are no longer free. Payload pins the Next version tightly, so upgrades are coupled.

**Costs.** Neon and Vercel free tiers likely suffice at this traffic; R2 storage is cents. Realistically zero to low single-digit dollars monthly, with paid tiers available without re-architecting.

**Version floor is hard.** Payload does not support Next `15.5`–`16.1.x`. Pin exact versions and treat a Next upgrade as a Payload-compatibility question first.

## Alternatives considered

**Astro + Payload as a separate headless service.** Keeps Astro's output characteristics, which suits a mostly-static brochure site. Rejected: two deploys, two runtimes, CORS and preview plumbing, a hand-written block renderer mapping, and no shared types across the boundary. The most work of the four options, for a benefit that server components largely replicate.

**Astro + Sanity.** No infrastructure to run, strong editor experience, real live preview. Rejected: content lives in a vendor's system rather than a database the owner controls, and the block-builder mapping still has to be written by hand.

**Astro + Keystatic (Git-based).** Free, no database, content versioned in Git — genuinely attractive for a developer. Rejected on the primary requirement: editors would need GitHub accounts and every edit triggers a rebuild. Image handling and reorder UX are weaker than a database-backed panel. This fails the actual users.

**Payload on Cloudflare Workers.** Considered while Cloudflare hosting was the assumption. Workers cannot run `sharp`, which pushes image resizing to a separate paid service, and the Workers runtime still has rough edges around database adapters and logging. Vercel's Node runtime avoids the whole class of problem. R2 is still used for storage — the object store was never the issue.
