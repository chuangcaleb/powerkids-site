import { describe, expect, it } from 'vitest'
import { AMBIENT_ICON_NAMES, ICON_NAMES, ICONS, iconLabel, isIconName } from './icons'

/**
 * These names are stored database values, so the registry has failure modes a
 * type check can't catch: a name that no longer resolves, a lucide alias that
 * disappears on upgrade, or a legacy value quietly becoming valid again.
 */
describe('icon registry', () => {
  it('resolves every name to a component', () => {
    const unresolved = ICON_NAMES.filter((name) => !ICONS[name])
    expect(unresolved).toEqual([])
  })

  it('exposes every registry key, and nothing else', () => {
    expect(ICON_NAMES.sort()).toEqual(Object.keys(ICONS).sort())
  })

  it('uses lucide export names, never kebab-case values', () => {
    // Stored values switched from `pen-line` to `PenLine`; a kebab name
    // reappearing means someone hand-added an option instead of an import.
    const malformed = ICON_NAMES.filter((name) => !/^[A-Z][A-Za-z0-9]*$/.test(name))
    expect(malformed).toEqual([])
  })

  it('keeps the ambient set inside the registry', () => {
    const strays = AMBIENT_ICON_NAMES.filter((name) => !isIconName(name))
    expect(strays).toEqual([])
  })

  it('rejects the legacy select values the migration renamed', () => {
    for (const legacy of ['star', 'pen-line', 'smile', 'zap', 'rainbow']) {
      expect(isIconName(legacy)).toBe(false)
    }
  })

  it('rejects lucide aliases that a major release can remove', () => {
    // `Smile` is an alias for `FaceSlightlySmiling`; storing the alias would
    // break rows on upgrade rather than at build time.
    expect(isIconName('Smile')).toBe(false)
    expect(isIconName('FaceSlightlySmiling')).toBe(true)
  })

  it('splits PascalCase names into admin labels', () => {
    expect(iconLabel('GraduationCap')).toBe('Graduation Cap')
    expect(iconLabel('Star')).toBe('Star')
    expect(iconLabel('MicVocal')).toBe('Mic Vocal')
    expect(iconLabel('Gamepad2')).toBe('Gamepad2')
  })
})
