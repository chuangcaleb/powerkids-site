# 0003. Vanilla CSS with layout primitives

**Status:** accepted
**Date:** 2026-07-30

## Context

v3 used Tailwind with shadcn/ui. The layout code it produced is the clearest argument against repeating it: per-component grid definitions with breakpoint-specific overrides (`xl:row-start-1 xl:col-start-1 mr-auto`, `sm:max-md:fl-ml-m`), and hard-coded per-index positioning arrays on the homepage card grids. Every section solved responsive layout from scratch. Meanwhile most of the shadcn palette was never used, and of the Radix components pulled in, only the mobile drawer and accordion needed to be interactive at all.

The rebuild is largely agent-driven. Agents reproduce whatever vocabulary is available to them, and utility classes make ad-hoc layout the path of least resistance — the drift is invisible in review because every individual class is legitimate.

## Decision

Vanilla CSS: design tokens as custom properties, CUBE-style composition primitives for layout, CSS Modules for component-scoped styles. No CSS framework.

The primitives — `flow`, `cluster`, `grid-auto`, `wrapper`, `sidebar`, `switcher`, `repel` — are adapted from the owner's existing system on chuangcaleb.com, which derives from Every Layout. Layout mechanics carry over; the visual language explicitly does not.

## Consequences

**Makes easy.** Layout becomes a vocabulary with about seven words in it, and blocks are specified in terms of that vocabulary ("`card-grid` uses `grid-auto`"). Reviewing layout means checking the primitive choice, not reading a class string. Primitives are container-responsive, so breakpoints mostly disappear. Tokens as custom properties mean a raw hex or px value in a component is trivially greppable — a mechanical review check rather than a judgement call.

**Makes hard.** No framework escape hatch: layout the primitives don't cover has to be written, and the reason recorded. Component styles need real CSS rather than composed utilities, which is more typing. The primitive CSS is ours to maintain. There is also less agent training data for a bespoke system than for Tailwind, so the docs have to carry more weight — which is the intent, but it front-loads the effort.

**Costs.** Phase 2 is larger than dropping in a framework, and it is the phase most likely to need human correction. The correction only has to happen once, provided it lands in `DESIGN.md`.

**Cross-project trap.** The primitives come from an editorial design system with the opposite visual language: quiet, serif-led, soft "whisper" shadows, warm neutrals. PowerKids is loud, marker-drawn, and defined by hard black offset shadows. Copy the layout files; do not copy the aesthetic. This disagreement is deliberate and is recorded in `docs/reference/v3-design-audit.md`.

## Alternatives considered

**Tailwind v4 with primitives as custom utilities.** CSS-first config would hold the tokens cleanly, and it is familiar from v3. Rejected: it leaves two overlapping layout vocabularies in the same codebase, and every contributor — human or agent — will reach for the raw utility over the primitive, because it is right there. Policing that in review, forever, costs more than writing the CSS.

**Panda CSS or vanilla-extract.** Type-safe tokens with zero runtime is genuinely the strongest correctness story here. Rejected on build complexity and unfamiliarity relative to the size of the project. Worth revisiting if the token layer ever gets large enough that type safety earns its cost.

**shadcn/ui again.** Rejected: v3 used a fraction of it. Two brand components and an accordion do not justify the dependency, and generated component files invite the same ad-hoc styling the rest of this decision is meant to prevent.
