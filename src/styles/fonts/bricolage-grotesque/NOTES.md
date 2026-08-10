Source: [google/fonts](https://github.com/google/fonts/tree/main/ofl/bricolagegrotesque), SIL OFL (`OFL.txt` in this directory).

Same self-host-over-`next/font/google` reasoning as the previous Shantell Sans setup (see git
history) — self-hosting keeps control over which axes ship and lets the width axis be pinned
without adding a runtime knob nobody asked for.

Upstream axes: `opsz` (12–96), `wdth` (75–100), `wght` (200–800). Shipped file pins `wdth` to a
fixed **90** (narrow, per design decision — not a tunable) and keeps `opsz` and `wght` variable.
`opsz` stays variable so `font-optical-sizing: auto` can pick the right cut per rendered size
(small pill/button text vs a 90px hero heading) without a hand-set knob. `wght` stays variable
for any future weight animation.

One family, one file, used for both display and body — the design direction (see `DESIGN.md`)
deliberately drops the second webfont the previous direction used for body text.

Regenerate (manual, no build script — this file is committed as-is):

```bash
curl -sL -o var.ttf "https://raw.githubusercontent.com/google/fonts/main/ofl/bricolagegrotesque/BricolageGrotesque%5Bopsz%2Cwdth%2Cwght%5D.ttf"
fonttools varLib.instancer var.ttf wdth=90 -o var-wdth90.ttf
pyftsubset var-wdth90.ttf --output-file=bricolage-grotesque-variable.woff2 --flavor=woff2 --layout-features='*' \
  --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
```

`pyftsubset --flavor=woff2` needs the `brotli` Python package (`pip install brotli`) — not
installed by default even when `fonttools`/`pyftsubset` are on `PATH`.
