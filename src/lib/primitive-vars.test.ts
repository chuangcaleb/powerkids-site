import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  clusterVars,
  flowVars,
  gridAutoVars,
  regionVars,
  repelVars,
  sidebarVars,
  switcherVars,
  wrapperVars,
} from './primitive-vars'

const compositionsDir = join(process.cwd(), 'src/styles/compositions')

function varsDeclaredIn(file: string, prefix: string): Set<string> {
  const css = readFileSync(join(compositionsDir, file), 'utf8')
  const matches = css.match(new RegExp(`--${prefix}-[\\w-]+`, 'g')) ?? []
  return new Set(matches)
}

const primitives: Array<{
  name: string
  file: string
  prefix: string
  vars: readonly string[]
  extra?: string[]
}> = [
  { name: 'cluster', file: 'cluster.css', prefix: 'cluster', vars: clusterVars },
  { name: 'flow', file: 'flow.css', prefix: 'flow', vars: flowVars },
  { name: 'switcher', file: 'switcher.css', prefix: 'switcher', vars: switcherVars },
  { name: 'repel', file: 'repel.css', prefix: 'repel', vars: repelVars },
  { name: 'sidebar', file: 'sidebar.css', prefix: 'sidebar', vars: sidebarVars },
  { name: 'grid-auto', file: 'grid-auto.css', prefix: 'grid', vars: gridAutoVars },
  { name: 'region', file: 'region.css', prefix: 'region', vars: regionVars },
  {
    name: 'wrapper',
    file: 'wrapper.css',
    prefix: 'wrapper',
    vars: wrapperVars,
    extra: ['--gutter'],
  },
]

describe('primitive var arrays stay in sync with compositions CSS', () => {
  for (const { name, file, prefix, vars, extra = [] } of primitives) {
    it(`${name}Vars matches ${file}`, () => {
      const declaredInCss = varsDeclaredIn(file, prefix)
      for (const knownException of extra) declaredInCss.add(knownException)
      expect(new Set(vars)).toEqual(declaredInCss)
    })
  }
})
