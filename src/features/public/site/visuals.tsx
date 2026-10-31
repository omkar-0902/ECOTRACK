/**
 * Product visuals for the public site.
 *
 * GeofenceMap is redrawn from the collector map in the EcoTrack proposal; it is a
 * concept and is captioned so.
 * ProductWindow and ConsoleCard render the real console with its demo dataset.
 */
import { lazy, Suspense } from 'react'
import { Truck } from 'lucide-react'
import { useData } from '@/store/StoreProvider'
import { useNow } from '@/hooks/useNow'
import { DemoTag } from '@/components/ui/Status'
import { BrandMark } from '@/components/layout/Brand'
import { StatusMix } from '@/features/views/OpsViews'
import { dashboardMetrics, logsToday, startOfDay } from '@/store/selectors'
import type { CollectionLog } from '@/types/domain'
import { cn } from '@/lib/cn'
import { StatusPill } from './ui'

// Leaflet loads with this chunk only where a map is shown.
const UnitMap = lazy(() => import('@/features/views/UnitMap').then((m) => ({ default: m.UnitMap })))

const dayFmt = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

/**
 * The day the public figures describe: today if anything has been logged today,
 * otherwise the most recent day with records. Always labelled with its date.
 */
export function useReportingDay(logs: CollectionLog[]) {
  const now = useNow(60_000)
  if (logs.length === 0 || logsToday(logs, now).length > 0) return { at: now, label: `Today, ${dayFmt.format(now)}` }
  const latest = Math.max(...logs.map((l) => l.createdAt))
  const endOfThatDay = startOfDay(latest) + 86_400_000 - 1
  return { at: endOfThatDay, label: `Latest day on record, ${dayFmt.format(latest)}` }
}

const ZONES = [
  { id: 'A', x: 120, y: 92 },
  { id: 'B', x: 300, y: 230 },
  { id: 'C', x: 470, y: 86 },
]

/** Service areas with the crew's route between them, as drawn in the proposal. Illustration only. */
export function GeofenceMap({ className, legend = true, animated = false }: { className?: string; legend?: boolean; animated?: boolean }) {
  return (
    <figure className={cn('min-w-0', className)}>
      <svg viewBox="0 0 600 330" role="img" aria-label="Illustration: three service areas, A, B and C, joined by a dashed crew route. The truck is entering area A, where a resident alert shows that the crew is near." className="pub-grid block w-full rounded-xl border border-line bg-[var(--pub-field)]">
        <rect x="0" y="168" width="600" height="18" fill="var(--pub-mint)" />
        <line x1="0" y1="177" x2="600" y2="177" stroke="var(--pub-ring)" strokeDasharray="10 10" />
        <path d="M120 92 L205 172 L300 230 L380 172 L470 86" fill="none" stroke="var(--pub-forest)" strokeWidth="2.5" strokeLinecap="round" className={cn('pub-route', animated && 'pub-route-animated')} />
        {ZONES.map((z) => (
          <g key={z.id}>
            <circle cx={z.x} cy={z.y} r="46" fill="var(--pub-mint)" fillOpacity="0.55" stroke="var(--pub-ring)" strokeWidth="2" strokeDasharray="5 6" />
            <path d={`M${z.x - 18} ${z.y + 2} L${z.x} ${z.y - 16} L${z.x + 18} ${z.y + 2} V${z.y + 20} H${z.x - 18} Z`} fill="var(--et-panel)" stroke="var(--pub-forest)" strokeWidth="2" strokeLinejoin="round" />
            <rect x={z.x - 5} y={z.y + 8} width="10" height="12" fill="var(--pub-forest)" />
            <text x={z.x} y={z.y + 66} textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--et-ink-2)">
              Area {z.id}
            </text>
          </g>
        ))}
        <g>
          <rect x="22" y="22" width="76" height="28" rx="6" fill="var(--pub-forest)" />
          <text x="60" y="41" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ffffff">
            Near!
          </text>
          <line x1="98" y1="40" x2="104" y2="56" stroke="var(--pub-forest)" strokeWidth="1.5" strokeDasharray="3 3" />
        </g>
        <g transform="translate(168 150)">
          <circle cx="16" cy="12" r="30" fill="none" stroke="var(--pub-forest)" strokeOpacity="0.35" />
          <rect x="-6" y="0" width="44" height="22" rx="5" fill="var(--pub-forest)" />
          <text x="16" y="15" textAnchor="middle" fontSize="10" fontWeight="700" fill="#ffffff">
            ECO
          </text>
          <circle cx="4" cy="25" r="5" fill="var(--et-panel)" stroke="var(--pub-forest)" strokeWidth="2" />
          <circle cx="30" cy="25" r="5" fill="var(--et-panel)" stroke="var(--pub-forest)" strokeWidth="2" />
        </g>
      </svg>
      {legend && (
        <figcaption className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-ink-2">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="size-3 rounded-full border-2 border-dashed border-[var(--pub-ring)] bg-[var(--pub-mint)]" />
            Service area
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="w-6 border-t-2 border-dashed border-[var(--pub-forest)]" />
            Crew route
          </span>
          <span className="inline-flex items-center gap-2">
            <Truck aria-hidden className="size-4 text-[var(--pub-forest)]" />
            Collection crew
          </span>
          <StatusPill status="planned" className="ml-auto" />
        </figcaption>
      )}
    </figure>
  )
}

/** The day's counts from the console, with the date they describe. */
export function Counts({ compact }: { compact?: boolean }) {
  const logs = useData((d) => d.logs)
  const day = useReportingDay(logs)
  const m = dashboardMetrics(logs, day.at)
  const counts = [
    { label: 'Requests', value: m.requests },
    { label: 'Collected', value: m.collected },
    { label: 'Missed', value: m.missed },
    { label: 'Pending', value: m.active },
  ]
  return (
    <div>
      <dl className="grid grid-cols-4 divide-x divide-line">
        {counts.map((c) => (
          <div key={c.label} className={cn('px-3', compact ? 'py-2.5' : 'py-3')}>
            <dt className="text-[12px] leading-4 text-ink-3">{c.label}</dt>
            <dd className="tabular mt-1 text-[22px] font-bold leading-none text-ink">{c.value}</dd>
          </div>
        ))}
      </dl>
      <div className="border-t border-line px-4 py-3">
        <StatusMix logs={logs} now={day.at} />
        <p className="mt-2 text-[11px] text-ink-3">{day.label}</p>
      </div>
    </div>
  )
}

/** The municipal console as a product window: real collector map above the day's real counts. */
export function ProductWindow({ className, mapClassName = 'h-[220px] sm:h-[260px]' }: { className?: string; mapClassName?: string }) {
  const collectors = useData((d) => d.collectors)
  const online = collectors.filter((c) => c.online).length
  return (
    <figure className={cn('min-w-0 overflow-hidden rounded-2xl border border-[var(--pub-shot-line)] bg-panel shadow-[var(--pub-shot-shadow)]', className)}>
      <div className="flex items-center gap-3 border-b border-line bg-muted px-4 py-2.5">
        <BrandMark size="sm" />
        <figcaption className="min-w-0 flex-1 truncate text-[13px] font-semibold text-ink">Municipal console</figcaption>
        <DemoTag label="Sample data" />
      </div>
      <div className={cn('relative bg-[var(--et-map-bg)]', mapClassName)}>
        <Suspense fallback={null}>
          <UnitMap collectors={collectors} interactive={false} className="absolute inset-0" />
        </Suspense>
        <p className="absolute left-3 top-3 z-[500] rounded-md bg-panel/95 px-2.5 py-1 text-[12px] font-semibold text-ink shadow-e1">
          {online} of {collectors.length} collectors online
        </p>
      </div>
      <Counts compact />
    </figure>
  )
}

/** Compact console card: the day's counts only. */
export function ConsoleCard({ className }: { className?: string }) {
  return (
    <figure className={cn('min-w-0 overflow-hidden rounded-xl border border-line bg-panel shadow-e3', className)}>
      <div className="flex items-center gap-3 border-b border-line bg-muted px-4 py-2.5">
        <BrandMark size="sm" />
        <figcaption className="min-w-0 flex-1 text-[13px] font-semibold text-ink">Operations dashboard</figcaption>
        <DemoTag label="Sample data" />
      </div>
      <Counts />
    </figure>
  )
}
