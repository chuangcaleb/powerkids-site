Source: [google/fonts](https://github.com/google/fonts/tree/main/ofl/bricolagegrotesque), SIL OFL (`OFL.txt` in this directory).

Same self-host-over-`next/font/google` reasoning as the previous Shantell Sans setup (see git
history) — self-hosting keeps control over which axes ship and lets the width axis be pinned
without adding a runtime knob nobody asked for.

Upstream axes: `opsz` (12–96), `wdth` (75–100), `wght` (200–800). Shipped file pins `wdth` to
**100** — the axis max, i.e. as wide as this typeface's own width axis goes — per-design-decision,
not a tunable, and keeps `opsz` and `wght` variable. `opsz` stays variable so
`font-optical-sizing: auto` can pick the right cut per rendered size (small button text vs a 90px
hero heading) without a hand-set knob. `wght` stays variable for any future weight animation.

Value lives once, in `DESIGN.md`'s `type.width` — the `wdth=100` below is that value, copied by
hand since this is a manual build step. If `type.width` changes, update the command to match.

Font's own `wdth` axis is already maxed at 100 — there is no wider instance to pin to. If text
still reads narrow, that's the typeface's shape, not this axis; the tuning knob is
`--tracking-display` in `src/styles/tokens/type.css` (letter-spacing on the display face), value
decided in `DESIGN.md`'s `type.displayTracking`.

Display face only — `--font-display`. Body/UI text (`--font-body`) is Figtree,
`src/styles/fonts/figtree.ts`; see `DESIGN.md`'s Type section for the split.

Regenerate (manual, no build script — this file is committed as-is):

```bash
curl -sL -o var.ttf "https://raw.githubusercontent.com/google/fonts/main/ofl/bricolagegrotesque/BricolageGrotesque%5Bopsz%2Cwdth%2Cwght%5D.ttf"
fonttools varLib.instancer var.ttf wdth=100 -o var-wdth100.ttf
pyftsubset var-wdth100.ttf --output-file=bricolage-grotesque-variable.woff2 --flavor=woff2 --layout-features='kern' \
  --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
```

`--layout-features='kern'` (not `'*'`) — `'*'` keeps every GSUB feature including stylistic
alternates this site never toggles, dragging in their glyph variants. Site doesn't use alternates;
`kern` alone keeps letter-pair spacing (matters at display sizes) and drops the rest. Cut file
90KB → 70KB, no visual diff. Verified against performance audit, 2026-08-21.

`pyftsubset --flavor=woff2` needs the `brotli` Python package (`pip install brotli`) — not
installed by default even when `fonttools`/`pyftsubset` are on `PATH`.
