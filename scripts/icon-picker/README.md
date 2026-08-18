# Icon set curation tool

Offline review surface for the icon registry (`src/lib/icons.ts`). Renders every
candidate icon as a real SVG so the set can be judged by eye, and exports a
ready-to-paste registry file.

`candidates.mjs` is the source of truth for what the tool shows and for the
legacy-value rename/purge map. Everything else is generated.

## Run

Run both from this directory — `extract-icons.mjs` resolves `lucide-react` from the
nearest `node_modules`, so the dump matches the version the app builds against:

```bash
cd scripts/icon-picker && node extract-icons.mjs && node build.mjs
```

`extract-icons.mjs` only needs rerunning when lucide is upgraded; `build.mjs` after
every `candidates.mjs` edit.

Then serve the directory — `index.html` embeds its data, but `file://` is not worth
fighting:

```bash
python3 -m http.server 4322 --directory scripts/icon-picker
```

There is an `icon-proto` entry in `.claude/launch.json` that does exactly this.

## Use

- Click a tile to cycle **cut → picker → ambient**; alt-click cycles back.
  - **picker** — offered to editors in the Payload icon field.
  - **ambient** — also in `AMBIENT_ICON_NAMES`, the seeded-random `DoodleLayer` set.
    Implies picker.
- Search with 2+ characters to filter the curated groups _and_ search all lucide
  icons, so new ones can be added without leaving the page.
- Anything kept that isn't in a curated group shows under **Kept, not yet in a
  group** — paste those into `candidates.mjs`.
- Marks persist in `localStorage`. **Reset** restores the committed set.
- **Export** produces the registry file, the legacy values needing a purge, and the
  old-value → export-name rename map.

## Rules the tool enforces by construction

- **Canonical lucide names only.** Stored DB values _are_ the export names, so a
  deprecated alias (`Smile` for `FaceSlightlySmiling`) would break silently when
  lucide drops it in a major.
- **Groups are review-only.** The shipped registry is flat; lucide publishes no
  category metadata, so inventing categories would mean maintaining them by hand.
- **Cutting an icon that live data references costs a migration.** Tiles marked
  **LIVE** are referenced by legacy rows; the export lists what needs purging.

## Generated files

`icons.json` and `index.html` are build output (~500KB each) and are gitignored.
Run the two commands above to recreate them.
