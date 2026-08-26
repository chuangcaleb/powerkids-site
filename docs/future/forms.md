# Forms — registration and careers

**Deferred.** Owner: "much later". Registration currently links to a Google Form; careers says "call or email". Both work. Do not start without explicit go-ahead.

**Goal:** registration and careers handled in-app, submissions readable in the admin panel.

---

## Pre

- [ ] Owner explicitly requests this
- [ ] **Email adapter working** (Resend or similar). A form nobody is notified about is worse than a Google Form link.
- [ ] **Owner decides on data handling.** This collects children's names and dates of birth. Malaysian PDPA applies. Decide retention period, who may access submissions, and whether a privacy notice is needed before building anything that stores it.
- [ ] ADR written for form-builder plugin vs hand-rolled server actions — pull `@payloadcms/plugin-form-builder` details from <https://payloadcms.com/docs/plugins/overview> rather than guess at API

## Work

**Registration** — replaces the Google Form. Fields per the current form. Server action or `@payloadcms/plugin-form-builder`, decided by ADR.

**Careers** — job listings as a collection so staff post vacancies without a developer, plus an application form with résumé upload to R2.

**Both** — Cloudflare Turnstile, rate limiting, server-side validation, email notification to the school, submissions stored in Payload so staff read them in the panel.

**Uploads from the public** — stricter path than admin uploads: size caps, MIME allow-list, never trust extension. Separate `upload`-type collection from `media`, `access.create` open (rate-limited) but `access.read` restricted to `admin` — public uploads readable-by-URL-guessing is the actual attack surface, not upload itself. Submission-received notification good fit for custom `Endpoint` (`advanced.md`) calling email adapter after `payload.create`, or `afterChange` hook if write always goes through Local API.

## Post

- [ ] Submissions arrive, are stored, and notify the school
- [ ] Spam protection working
- [ ] Résumé uploads land in R2, not readable by unauthenticated URL guessing
- [ ] Retention and access decisions documented
- [ ] Old Google Form link retired or redirected
- [ ] `pnpm verify` green

## Traps

- **Personal data of minors.** Encrypt where sensible, restrict access to `admin`, do not log form contents, and do not send them to any third-party service without the owner's explicit decision.
- **Public uploads are an attack surface.** The admin `media` collection assumes an authenticated, trusted uploader. Do not reuse its config for public submissions.
- **A form that silently fails is worse than no form.** A parent who thinks they registered and did not is a real harm. Confirmation on screen and by email.
