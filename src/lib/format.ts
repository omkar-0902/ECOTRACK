const numberFmt = new Intl.NumberFormat('en-IN')
const decimalFmt = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 1 })

export const formatNumber = (n: number) => numberFmt.format(Math.round(n))
export const formatDecimal = (n: number) => decimalFmt.format(n)
export const formatPercent = (n: number, digits = 0) => `${n.toFixed(digits)}%`

/** Kilograms rendered as kg below a tonne, tonnes above. */
export function formatMass(kg: number): { value: string; unit: string } {
  if (Math.abs(kg) >= 1000) return { value: decimalFmt.format(kg / 1000), unit: 't' }
  return { value: numberFmt.format(Math.round(kg)), unit: 'kg' }
}

export function formatMassText(kg: number) {
  const m = formatMass(kg)
  return `${m.value} ${m.unit}`
}

export function formatRelative(ts: number, now = Date.now()): string {
  const diff = Math.round((now - ts) / 1000)
  const abs = Math.abs(diff)
  const suffix = diff >= 0 ? 'ago' : 'from now'
  // Slightly-future timestamps come from a clock that refreshes on an interval.
  if (diff < 45 && diff > -120) return 'just now'
  if (abs < 3600) return `${Math.round(abs / 60)} min ${suffix}`
  if (abs < 86400) {
    const h = Math.floor(abs / 3600)
    const m = Math.round((abs % 3600) / 60)
    return m > 0 && h < 6 ? `${h} h ${m} min ${suffix}` : `${h} h ${suffix}`
  }
  const d = Math.round(abs / 86400)
  return `${d} day${d === 1 ? '' : 's'} ${suffix}`
}

export function hoursSince(ts: number, now = Date.now()) {
  return Math.max(0, (now - ts) / 3_600_000)
}

const timeFmt = new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit' })
const dateTimeFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
const dateFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
const shortDateFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' })

export const formatTime = (ts: number) => timeFmt.format(ts)
export const formatDateTime = (ts: number) => dateTimeFmt.format(ts)
export const formatDate = (ts: number) => dateFmt.format(ts)
export const formatShortDate = (ts: number) => shortDateFmt.format(ts)

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('')
}

export function toISODate(ts: number) {
  const d = new Date(ts)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export function fromISODate(s: string) {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1).getTime()
}
