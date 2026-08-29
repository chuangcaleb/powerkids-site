# Section dividers

**Purpose:** which divider shape to reach for, and which ones were tried and dropped.
**Read this when:** placing a `SectionDivider`, or tempted to add a shape to the set.

`DividerShape` in `src/lib/divider-shapes.ts` is the closed set. Width, depth and flip are per-call-site props — read the call sites for current values; they are tuned by eye and this doc does not mirror them. Design rules for _whether_ a boundary gets a divider at all live in [../../DESIGN.md](../../DESIGN.md) § Section dividers.

---

## Picking a shape

Each generator has a character. Match it to the boundary's job, not to novelty.

- **`arc`** — one wide curve, no repeat. A single gesture; suits a hero edge, where the boundary should read as one deliberate stroke rather than a pattern.
- **`torn`** — irregular, hand-torn. Subtle at a short period; the default for a quiet boundary, including content-level dividers.
- **`wave`** — smooth sine. Needs a wide period to stay quiet; goes fussy fast at a short one.
- **`pinking`** — even triangular sawtooth, craft scissors. Wide and shallow reads gentle, not aggressive — depth matters more than shape here, so keep it shallow.
- **`wobble`** — low-amplitude irregular curve. Hand-cut, less literal than `torn`.
- **`flat`** — no cut. A drop-in for a plain rule, so a boundary can be flattened without changing markup.

`torn` and `wobble` are jittered, so they need a `seed` — stable across server and client, or the render mismatches.

Every shape can **flip**: mirror the cut about the strip midline, handing the shape to the lower band instead of the upper one. Same geometry, opposite reading.

## Adding to the set is a real decision

The set is deliberately small. Nine shapes were built and rejected during exploration: `scallop`, `scoop`, `cloud`, `jigsaw`, `roundtab`, `drip`, `perf`, `stepped`, `tab`. They were dropped for being too loud, too literal, or indistinguishable from a shape already in the set at usable depths.

Two are worth remembering if this is ever revisited:

- **`jigsaw`** — a real puzzle knob with an undercut neck, drawn as one >180° arc. The most distinctive of the set and the most specific to a kids' brand.
- **`drip`** — the most dramatic, and reads well where both sides share a colour. It has a gravity direction, so it must never be rotated.

## Rendering: alternatives rejected

Inline SVG, no CSS masks, no client JS. The mechanics and the exactness details are documented on `SectionDivider` and `buildDividerPath` themselves. What those can't record is what was tried instead:

- **CSS `mask` with repeating gradients** only works for periodic shapes. Most of the set is irregular, so a mask route would cover part of it and leave two systems to maintain.
- **URL-encoding the SVG as a repeating `background-image`** forces hex values into a data URI, which leaves the token system and trips `stylelint-declaration-strict-value`.
- **Measuring container width in client JS** means shipping a `ResizeObserver` per divider to a static marketing page. Stretching one viewBox is the trade taken instead: teeth read wider on wide viewports and narrower on mobile, which is intended, not a defect.

## Vertical joins

A vertical divider works — the generator is axis-agnostic, so it is one rotation on an absolutely-positioned copy. It is still not used, for two reasons: its length is the container _height_, which varies far more than width, so the stretch artifact is severe; and knowing that height needs JS, reintroducing exactly the machinery the SVG approach avoids. A straight border is the standing choice. Reversible later — only the plumbing costs.

## References

- CSS-only edge recipes — <https://css-tip.com/>, <https://css-generators.com/custom-borders/>, <https://css-tip.com/puzzle-shape/>, <https://css-tip.com/rounded-shapes/>
- Shape vocabulary surveys — <https://www.shapedivider.app/>, <https://css-shape.com/>
