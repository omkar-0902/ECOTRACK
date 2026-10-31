/**
 * Leaflet map of collector units, shared by the console and the public pages.
 * Kept apart from OpsViews so Leaflet only loads with the screens that show a map.
 */
import { useEffect, useRef } from 'react'
import { MapContainer, Marker, TileLayer, Tooltip, useMap, ZoomControl } from 'react-leaflet'
import type { LatLngBoundsExpression } from 'leaflet'
import type { Collector } from '@/types/domain'
import { unitIcon } from '@/components/maps/markers'
import { cn } from '@/lib/cn'
import './unitMap.css'

const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

function SizeSync() {
  const map = useMap()
  useEffect(() => {
    const ro = new ResizeObserver(() => map.invalidateSize())
    ro.observe(map.getContainer())
    return () => ro.disconnect()
  }, [map])
  return null
}

/** Fits the view to the located units once, or flies to the selected unit. */
function ViewController({ points, focus }: { points: [number, number][]; focus: [number, number] | null }) {
  const map = useMap()
  const key = points.map((p) => p.join(',')).join('|')
  useEffect(() => {
    if (points.length > 1) map.fitBounds(points as LatLngBoundsExpression, { padding: [48, 48], maxZoom: 14 })
    else if (points.length === 1) map.setView(points[0], 13)
    // Refit only when the set of positions changes, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, map])
  useEffect(() => {
    if (focus) map.flyTo(focus, Math.max(map.getZoom(), 14), { duration: 0.8 })
  }, [focus, map])
  return null
}

/** Leaflet map of collector units at their last reported positions. */
export function UnitMap({
  collectors,
  selectedId,
  onSelect,
  interactive = true,
  onTileError,
  className,
}: {
  collectors: Collector[]
  selectedId?: string | null
  onSelect?: (id: string) => void
  interactive?: boolean
  onTileError?: (failed: boolean) => void
  className?: string
}) {
  const located = collectors.filter((c) => c.position)
  const points = located.map((c) => [c.position!.lat, c.position!.lng] as [number, number])
  const selected = located.find((c) => c.id === selectedId)
  const errors = useRef(0)
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      minZoom={2}
      maxZoom={18}
      zoomControl={false}
      scrollWheelZoom={interactive}
      dragging={interactive}
      doubleClickZoom={interactive}
      className={cn('h-full w-full', className)}
      attributionControl
    >
      <TileLayer
        url={TILE_URL}
        attribution={ATTRIBUTION}
        eventHandlers={{
          tileerror: () => {
            errors.current += 1
            if (errors.current > 6) onTileError?.(true)
          },
          tileload: () => onTileError?.(false),
        }}
      />
      {interactive && <ZoomControl position="bottomright" />}
      <SizeSync />
      <ViewController points={points} focus={selected ? [selected.position!.lat, selected.position!.lng] : null} />
      {located.map((c) => (
        <Marker key={c.id} position={[c.position!.lat, c.position!.lng]} icon={unitIcon(c.online, c.id === selectedId)} title={`${c.name}, ${c.id}, ${c.online ? 'online' : 'offline'}`} eventHandlers={onSelect ? { click: () => onSelect(c.id) } : undefined}>
          <Tooltip direction="top" offset={[0, -16]}>
            {c.name}, {c.id}
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  )
}
