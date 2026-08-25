import type { CSSProperties } from 'react'

export const clusterVars = [
  '--cluster-gap',
  '--cluster-gap-x',
  '--cluster-gap-y',
  '--cluster-align-x',
  '--cluster-align-y',
] as const
export type ClusterVars = (typeof clusterVars)[number]

export const flowVars = ['--flow-space'] as const
export type FlowVars = (typeof flowVars)[number]

export const switcherVars = [
  '--switcher-gap',
  '--switcher-vertical-alignment',
  '--switcher-justify',
  '--switcher-inline-at',
] as const
export type SwitcherVars = (typeof switcherVars)[number]

export const repelVars = [
  '--repel-direction',
  '--repel-gap',
  '--repel-y-alignment',
] as const
export type RepelVars = (typeof repelVars)[number]

export const sidebarVars = [
  '--sidebar-gap',
  '--sidebar-align',
  '--sidebar-size',
  '--sidebar-wrap-at',
] as const
export type SidebarVars = (typeof sidebarVars)[number]

export const gridAutoVars = [
  '--grid-placement',
  '--grid-gap',
  '--grid-item-min',
  '--grid-align-items',
] as const
export type GridAutoVars = (typeof gridAutoVars)[number]

export const regionVars = ['--region-space'] as const
export type RegionVars = (typeof regionVars)[number]

// `--gutter` is unprefixed, unlike every other wrapper var — a known naming
// irregularity, tracked for the primitive var-naming standardization pass.
export const wrapperVars = ['--wrapper-max-width', '--gutter'] as const
export type WrapperVars = (typeof wrapperVars)[number]

/** Every overridable custom property across all layout primitives. */
export type PrimitiveVar =
  | ClusterVars
  | FlowVars
  | SwitcherVars
  | RepelVars
  | SidebarVars
  | GridAutoVars
  | RegionVars
  | WrapperVars

/**
 * Sets layout-primitive custom properties from React's `style` prop. `Var`
 * is inferred from the keys you pass and checked against `PrimitiveVar`, so
 * a typo'd or non-existent var name is a type error — and because the
 * constraint spans every primitive, one call can freely mix vars from
 * several primitives on the same node (e.g. `--cluster-gap` with
 * `--wrapper-max-width`).
 *
 * Scoped to layout primitives only — a component's own custom properties
 * (`--sticker-rotate`, `--polaroid-tilt`, ...) don't belong here; set those
 * with a plain `style` object.
 *
 * `primitive-vars.test.ts` asserts each `*Vars` array matches the custom
 * properties actually declared in its `src/styles/compositions/*.css` file —
 * update both together. See docs/coding-standards.md#styling.
 */
export function primitiveVars<Var extends PrimitiveVar>(
  vars: Partial<Record<Var, string>>,
): CSSProperties {
  return vars as CSSProperties
}
