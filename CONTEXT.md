# Context

Domain vocabulary. The CMS uses these words too — use them exactly, everywhere (code, docs, commit messages) — except staff-facing plain-language material (e.g. the admin panel guide), where a non-technical word may replace a domain term when it's clearer to a non-coder reader.

- **School** — a physical branch (Sri Petaling, Puchong Utama, Parklane OUG). No code implementation; branch data lives as CMS page content. Not "centre".
- **Location** — a map pin with address data (`site-settings`); may or may not correspond to a School. Not a School — a Location is map/address data.
- **Enquiry** — a submission record (`enquiries`) created when a parent fills the site's enquiry form.
- **Status** (enquiry) — `unread` or `closed` only. Staff-set via closing the record; never a third "failed" value. Orthogonal to notification failure — a `closed` enquiry can have failed notifications in its history, an `unread` one can be currently failing.
- **Failed** (enquiry) — not a stored state. Derived: true when `notificationErrors` is non-empty. Surfaced in the admin list view only while `status` is `unread`; suppressed once `closed`, since closing is itself the resolution signal.
- **Block** — one entry in a page's `layout` array; the unit an editor adds and reorders.
- **Global** — content authored once, rendered identically on every page; editors don't choose whether it appears. Contrast Block, which editors add and arrange per page.
- **Page** — an editor-composed route, built from blocks.
- **Asset** — a `media` collection record. Not "media doc" or "doc", different from repo's own `docs/`.
