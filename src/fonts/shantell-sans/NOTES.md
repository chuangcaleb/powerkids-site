Source: [google/fonts](https://github.com/google/fonts/tree/main/ofl/shantellsans), SIL OFL (`OFL.txt` in this directory).

Upstream variable font has 4 axes (`wght`, `INFM`, `BNCE`, `SPAC`); per `DESIGN.md`, only `wght` is kept. Regenerate with:

```bash
fonttools varLib.instancer ShantellSans[BNCE,INFM,SPAC,wght].ttf INFM=0 BNCE=0 SPAC=0 -o trimmed.ttf
pyftsubset trimmed.ttf --output-file=shantell-sans-variable.woff2 --flavor=woff2 --layout-features='*' \
  --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
```
