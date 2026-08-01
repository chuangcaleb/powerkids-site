'use client'

import { useState } from 'react'
import { VideoEmbed } from '@/components/video-embed/video-embed'

export type VideoTab = {
  label: string
  embedId: string
}

export type VideoTabsProps = {
  tabs: VideoTab[]
  posterUrl: string
}

/** Tab row over `VideoEmbed` — one tab per event year, per docs/architecture/blocks.md. */
export function VideoTabs({ tabs, posterUrl }: VideoTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = tabs[activeIndex]

  if (!active) return null

  return (
    <div className="flow">
      <div className="cluster" role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            onClick={() => setActiveIndex(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <VideoEmbed
        embedUrl={`https://www.youtube.com/embed/${active.embedId}`}
        title={active.label}
        posterUrl={posterUrl}
      />
    </div>
  )
}
