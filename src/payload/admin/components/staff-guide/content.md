# Staff Guide

How to update the PowerKids website. No coding needed.

## 1. Signing in

Go to the admin login page and sign in with your email and password. Forgot your
password? Use "Forgot password" on the login screen — a reset link will be emailed to you.

## 2. Two things you can change

- **Content** — page layout/content, photos. Can be unique for every page.
- **Settings** — phone numbers, social links, site navigation. They are the same everywhere on the site, changed once in one place.

## 3. Editing a page

Open the page from the sidebar. The page is built from sections stacked top to
bottom. Click "+ Add" to insert a new section, drag the handle to reorder one, or
use the section's menu to remove it.

**Rich text** — a block of text that has special formatting segments (bold, italic, heading, etc.). Contrasted with "plain text", which is just basic text characters without formatting.

## 4. Section types

Each section does one job — pick the one that matches what you're adding:

- **Hero** — eye-catching section at the top of a page, usually with a photo and a heading.
- **Content** — generic information and flexible layout.
- **Gallery** — a grid of 9+ photos.
- **Framed Rows** — custom section. 2-3 subitems, each with heading, description, 1 image.
- **Scrapbook** — custom section. 3-6 subitems, each with heading, description, about 5-10 images.

(If you're not sure which section fits, ask a developer rather than guessing)

## 5. Media

- The admin panel refers to photos as "media assets".
- Upload photos at least 1600px wide so they stay sharp on large screens.
- Every photo needs a short description (alt text) — it's read aloud to visitors
  using screen readers, and helps search engines find your pages.
- Photos live in one shared database. Replacing a photo there updates it everywhere
  it's used on the site — you don't need to hunt down every page.
- Prefer to use Folders (and subfolders) to organise your photos. Every photo should live in a categorised folder.
- Avoid uploading duplicate photos. This wastes storage space and worsens site speed. You will get a warning and instructions how/where to remove duplicates.

## 6. Draft & Publish

Changes autosave as a draft first — nothing goes live until you click Publish.

Use the Preview button to see exactly what visitors will see before you publish. You can open in a new tab, or use the Live Preview for realtime changes.

## 7. Undoing a mistake

Every save is kept as a version. Open a page, go to its version history, and
restore any earlier version — including ones from before your last publish.

## 8. Adding a new page

Create the page, add your sections, and publish it. A new page isn't accessible to visitors via page links, until it's also added to `Settings → Navigation`.

## 9. What only a developer can change

New section types, page layouts, how the site looks and behaves, and anything to
do with code. Ask a developer for these rather than trying to work around it here.

## 10. Further reading

These are helpful if you want more background on how the admin panel works under the hood:

- [Admin Panel Overview](https://payloadcms.com/docs/admin/overview) (MUST READ)
- [Versions](https://payloadcms.com/docs/versions/overview)
- [Drafts](https://payloadcms.com/docs/versions/drafts)
- [Preview](https://payloadcms.com/docs/admin/preview)
