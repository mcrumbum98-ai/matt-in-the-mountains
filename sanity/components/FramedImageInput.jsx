import {useEffect, useRef, useState} from 'react'
import {Card, Stack, Text} from '@sanity/ui'
import {PatchEvent, set, useClient} from 'sanity'

const clamp = (n) => Math.max(0, Math.min(1, n))

export function FramedImageInput(props) {
  const {value, onChange, renderDefault, schemaType} = props
  const client = useClient({apiVersion: '2024-01-01'})
  const frameRef = useRef(null)
  const [url, setUrl] = useState('')
  const ratio = schemaType?.options?.basecampFrame?.ratio || '16 / 9'
  const label = schemaType?.options?.basecampFrame?.label || 'Website frame'
  const x = value?.hotspot?.x ?? 0.5
  const y = value?.hotspot?.y ?? 0.5

  useEffect(() => {
    let alive = true
    const ref = value?.asset?._ref
    if (!ref) {
      setUrl('')
      return () => { alive = false }
    }
    client.fetch('*[_id == $id][0].url', {id: ref}).then((assetUrl) => {
      if (alive) setUrl(assetUrl || '')
    }).catch(() => {
      if (alive) setUrl('')
    })
    return () => { alive = false }
  }, [client, value?.asset?._ref])

  const setFocus = (nextX, nextY) => {
    const hotspot = {
      _type: 'sanity.imageHotspot',
      x: clamp(nextX),
      y: clamp(nextY),
      width: value?.hotspot?.width ?? 0.1,
      height: value?.hotspot?.height ?? 0.1,
    }
    onChange(PatchEvent.from(set(hotspot, ['hotspot'])))
  }

  const handleFrameClick = (event) => {
    const rect = frameRef.current?.getBoundingClientRect()
    if (!rect) return
    setFocus((event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height)
  }

  return (
    <Stack space={4}>
      {renderDefault(props)}
      {url && (
        <Card padding={3} radius={2} border tone="transparent">
          <Stack space={3}>
            <Stack space={2}>
              <Text size={1} weight="semibold">Basecamp framing · {label}</Text>
              <Text size={1} muted>Click anywhere in the frame to move the subject/focal point. This changes only website framing — the original uploaded photo is never altered.</Text>
            </Stack>
            <div
              ref={frameRef}
              onClick={handleFrameClick}
              title="Click to reposition the focal point"
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: ratio,
                overflow: 'hidden',
                borderRadius: 8,
                background: '#d7d0c4',
                cursor: 'crosshair',
                boxShadow: 'inset 0 0 0 1px rgba(23,24,20,.16)',
              }}
            >
              <img
                src={url}
                alt=""
                draggable="false"
                style={{
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: `${x * 100}% ${y * 100}%`,
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              />
              <div style={{position:'absolute',left:`calc(${x * 100}% - 9px)`,top:`calc(${y * 100}% - 9px)`,width:18,height:18,border:'2px solid white',borderRadius:'50%',boxShadow:'0 0 0 1px rgba(0,0,0,.55),pointerEvents:'none'}} />
              <div style={{position:'absolute',inset:0,boxShadow:'inset 0 0 0 2px rgba(177,139,82,.8)',pointerEvents:'none'}} />
            </div>
            <Text size={1} muted>Saved focal point: {Math.round(x * 100)}% horizontal · {Math.round(y * 100)}% vertical</Text>
          </Stack>
        </Card>
      )}
    </Stack>
  )
}
