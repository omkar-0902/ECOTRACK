import L from 'leaflet'

const TRUCK_SVG =
  '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>'

const cache = new Map<string, L.DivIcon>()

/** Collector unit marker (truck). Online units carry the accent; the selected unit gets a ring. */
export function unitIcon(online: boolean, selected = false) {
  const key = `${online}:${selected}`
  let icon = cache.get(key)
  if (!icon) {
    const cls = ['et-unit', online && 'et-unit--online', selected && 'et-unit--selected'].filter(Boolean).join(' ')
    icon = L.divIcon({ className: '', iconSize: [30, 30], iconAnchor: [15, 15], html: `<div class="${cls}">${TRUCK_SVG}</div>` })
    cache.set(key, icon)
  }
  return icon
}
