Source: [google/fonts](https://github.com/google/fonts/tree/main/ofl/shantellsans), SIL OFL (`OFL.txt` in this directory).

`next/font/google` lists Shantell Sans's custom axes (`BNCE`, `INFM`, `SPAC`) in its metadata, but Google's font-serving API silently drops all non-`wght` axes regardless of the `axes` option requested — verified by inspecting the actual served file. Self-hosting the upstream file directly is the only way to keep them.

Kept: `wght`, `BNCE` (Bounce), `INFM` (Informality), `SPAC` (Spacing) — all variable, for future text animation per `DESIGN.md`. Dropped: italic (separate upstream file, no current use case).

Regenerate (manual, no build script — this file is committed as-is):

```bash
curl -sL -o var.ttf "https://raw.githubusercontent.com/google/fonts/main/ofl/shantellsans/ShantellSans%5BBNCE%2CINFM%2CSPAC%2Cwght%5D.ttf"
pyftsubset var.ttf --output-file=shantell-sans-variable.woff2 --flavor=woff2 --layout-features='*' \
  --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
```
