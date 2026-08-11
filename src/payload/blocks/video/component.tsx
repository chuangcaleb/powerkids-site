import { Card } from '@/components/card/card'
import type { VideoBlock as VideoBlockType } from '@/payload-types'

import { VideoTabs } from './video-tabs'

export function VideoBlock({ heading, subheading, poster, videos }: VideoBlockType) {
  if (!videos || videos.length === 0) return null

  const posterDoc = typeof poster === 'object' ? poster : null

  return (
    <section className="wrapper flow">
      <Card tabHeader={heading}>
        {subheading ? <p>{subheading}</p> : null}
        <VideoTabs
          tabs={videos.map((video) => ({ label: video.label, embedId: video.embedId }))}
          posterUrl={posterDoc?.url ?? ''}
        />
      </Card>
    </section>
  )
}
