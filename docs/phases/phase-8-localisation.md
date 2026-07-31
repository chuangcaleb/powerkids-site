# Phase 8 — Localisation

**Deferred.** Schema already supports it; nothing forces the timing.

**Goal:** activate a second language without a data migration.

---

## Pre

- [ ] Owner explicitly requests it, and has decided **which** language — Bahasa Malaysia and/or Chinese. v3 had Chinese-language brochure scans for the After School Program, which hints at the audience.
- [ ] Owner has a translator. This is a content project, not a code project — the code side is roughly a day, the translation is not.
- [ ] Phase 6 done

## Work

Payload localisation is already configured with `en` as the only active locale, so this is a config change rather than a migration of every text field. That was deliberate in Phase 1.

- Add the locale to `localization.locales` in `src/payload.config.ts`
- Locale routing in the App Router; `generateStaticParams` per locale
- Language switcher in the header, from `navigation` global
- `hreflang` tags, per-locale sitemap entries
- Decide fallback behaviour: untranslated fields fall back to `en` (already `fallback: true`)

## Post

- [ ] Second locale selectable in admin panel, per field
- [ ] Routes resolve per locale; switcher preserves the current page
- [ ] `hreflang` and sitemap correct
- [ ] Untranslated content falls back rather than rendering blank
- [ ] Staff guide explains how to translate a page
- [ ] `pnpm verify` green

## Traps

- **Translation is the actual cost.** Do not ship a half-translated site: a page that switches to Bahasa and shows English body copy reads as broken. Decide per-page whether it is translated before exposing the switcher.
- **School names and addresses are not translated.** Neither is the brand. `PowerKids` stays `PowerKids`.
- **Fallback hides missing work.** With `fallback: true`, an untranslated field silently shows English. Useful for launch, dangerous for tracking progress — count untranslated fields deliberately.
