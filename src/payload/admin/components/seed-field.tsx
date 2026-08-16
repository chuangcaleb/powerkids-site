'use client'

import { Button, TextField, useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

function randomSeed() {
  return Math.random().toString(36).slice(2, 10)
}

/**
 * The collage's random arrangement (lane stagger, jitter, tilt, upscale — see
 * ScrapbookCollage) is seeded, not re-rolled on every render, so an editor
 * needs a way to ask for a *different* arrangement and keep it. Storing the
 * seed on the block (rather than deriving it from the block id) makes that
 * possible: shuffle re-rolls it client-side, and saving the document
 * persists whichever roll the editor landed on.
 */
export const SeedField: TextFieldClientComponent = (props) => {
  const { path } = props
  const { setValue } = useField<string>({ path })

  return (
    <div
      className="field-type text"
      style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}
    >
      <div style={{ flexGrow: 1 }}>
        <TextField {...props} />
      </div>
      <Button buttonStyle="secondary" size="small" onClick={() => setValue(randomSeed())}>
        Shuffle layout
      </Button>
    </div>
  )
}
