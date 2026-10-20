/**
 * Product visuals for the public site.
 *
 * ResidentPhone and GeofenceMap are redrawn from the EcoTrack proposal deck
 * (slide 3) so they stay sharp at any size; both are concepts and say so.
 * ConsoleCard renders the real console components with the demo dataset.
 */
import { Leaf, MapPin, Truck } from 'lucide-react'
import { useData } from '@/store/StoreProvider'
import { useNow } from '@/hooks/useNow'
import { DemoTag } from '@/components/ui/Status'
import { BrandMark } from '@/components/layout/Brand'
import { StatusMix } from '@/features/views/OpsViews'
import { dashboardMetrics } from '@/store/selectors'
import { DASHBOARD } from '@/content/original'
import { cn } from '@/lib/cn'
import { StatusPill } from './ui'

/** The resident home screen from the deck: map of pinned pickups, Request Pickup, Pending and Eco Points. */
export function ResidentPhone({ className, caption = true }: { className?: string; caption?: boolean }) {
  return (
    <figure className={cn('w-[248px] shrink-0', className)}>
      <div aria-hidden className="rounded-[34px] border-[3px] border-[#2ecc71] bg-[#0b1a10] p-2 shadow-e3">
        <div className="overflow-hidden rounded-[26px] bg-[#102016] text-white">
          <div className="flex items-center justify-between px-5 pb-1 pt-3 text-[10px] text-white/60">
            <span>9:41</span>
            <span className="h-1.5 w-4 rounded-[2px] bg-white/50" />
          </div>
          <div className="flex items-center justify-center gap-1.5 border-b border-white/10 bg-[#163021] py-2.5 text-[14px] font-bold text-[#6ee38f]">
            <Leaf className="size-4" />
            EcoTrack
          </div>
          {/* Pinned pickups around the truck's zone */}
          <svg viewBox="0 0 232 150" className="block w-full bg-[#0f1f15]">
            {[38, 77, 116, 155, 194].map((x) => (
              <line key={`v${x}`} x1={x} y1="0" x2={x} y2="150" stroke="#ffffff" strokeOpacity="0.06" />
            ))}
            {[37, 75, 113].map((y) => (
              <line key={`h${y}`} x1="0" y1={y} x2="232" y2={y} stroke="#ffffff" strokeOpacity="0.06" />
            ))}
            <circle cx="112" cy="70" r="28" fill="none" stroke="#2ecc71" strokeOpacity="0.6" strokeDasharray="3 4" />
            <path d="M58 54 L112 70 L132 82 L156 32" fill="none" stroke="#2ecc71" strokeOpacity="0.85" strokeDasharray="4 4" strokeWidth="1.5" />
            <circle cx="58" cy="54" r="7" fill="#2ecc71" />
            <circle cx="156" cy="32" r="7" fill="#2ecc71" />
            <circle cx="132" cy="82" r="7" fill="#2ecc71" />
            <circle cx="112" cy="70" r="11" fill="#1a6b35" />
            <rect x="106" y="66" width="12" height="7" rx="1.5" fill="#ffffff" />
            <circle cx="88" cy="114" r="6" fill="#050b07" />
          </svg>
          <div className="space-y-2.5 p-3.5">
            <div className="flex items-center justify-center gap-2 rounded-xl bg-[#1a6b35] py-3 text-[14px] font-semibold">
              <MapPin className="size-4" />
              Request Pickup
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-lg border border-white/10 bg-[#163021] px-3 py-2">
                <p className="text-[10px] text-white/60">Pending</p>
                <p className="text-[15px] font-bold text-[#6ee38f]">3</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-[#163021] px-3 py-2">
                <p className="text-[10px] text-white/60">Eco Points</p>
                <p className="text-[15px] font-bold text-[#f4d35e]">240</p>
              </div>
            </div>
            <div className="mx-auto h-1 w-16 rounded-full bg-white/25" />
          </div>
        </div>
      </div>
      {caption && (
        <figcaption className="mt-3 flex flex-wrap items-center justify-center gap-2 text-center text-[12px] text-ink-3">
          <StatusPill status="planned" />
          Resident app concept from the EcoTrack proposal
        </figcaption>
      )}
    </figure>
  )
}

const ZONES = [
  { id: 'A', x: 120, y: 92, near: true },
  { id: 'B', x: 300, y: 230, near: false },
  { id: 'C', x: 470, y: 86, near: false },
]

/** Geofenced pickup zones joined by the collector's route, as in the deck's collector map. */
export function GeofenceMap({ className, legend = true, animated = false }: { className?: string; legend?: boolean; animated?: boolean }) {
  return (
    <figure className={cn('min-w-0', className)}>
      <svg viewBox="0 0 600 330" role="img" aria-label="Concept map: three geofenced pickup zones, A, B and C, joined by a dashed collector route. The truck is entering zone A, which shows a Near alert." className="pub-grid block w-full rounded-xl border border-line bg-[var(--pub-field)]">
        {/* Main road */}
        <rect x="0" y="168" width="600" height="18" fill="var(--pub-mint)" />
        <line x1="0" y1="177" x2="600" y2="177" stroke="var(--pub-ring)" strokeDasharray="10 10" />
        {/* Route */}
        <path
          d="M120 92 L205 172 L300 230 L380 172 L470 86"
          fill="none"
          stroke="var(--pub-forest)"
          strokeWidth="2.5"
          strokeLinecap="round"
          className={cn('pub-route', animated && 'pub-route-animated')}
        />
        {ZONES.map((z) => (
          <g key={z.id}>
            <circle cx={z.x} cy={z.y} r="46" fill="var(--pub-mint)" fillOpacity="0.55" stroke="var(--pub-ring)" strokeWidth="2" strokeDasharray="5 6" />
            <path d={`M${z.x - 18} ${z.y + 2} L${z.x} ${z.y - 16} L${z.x + 18} ${z.y + 2} V${z.y + 20} H${z.x - 18} Z`} fill="var(--et-panel)" stroke="var(--pub-forest)" strokeWidth="2" strokeLinejoin="round" />
            <rect x={z.x - 5} y={z.y + 8} width="10" height="12" fill="var(--pub-forest)" />
            <text x={z.x} y={z.y + 66} textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--et-ink-2)">
              Zone {z.id}
            </text>
          </g>
        ))}
        {/* "Near!" alert at zone A */}
        <g>
          <rect x="22" y="22" width="76" height="28" rx="6" fill="var(--pub-forest)" />
          <text x="60" y="41" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ffffff">
            Near!
          </text>
          <line x1="98" y1="40" x2="104" y2="56" stroke="var(--pub-forest)" strokeWidth="1.5" strokeDasharray="3 3" />
        </g>
        {/* Truck entering zone A's ring */}
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
            Pickup zone (geofence)
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="w-6 border-t-2 border-dashed border-[var(--pub-forest)]" />
            Collector route
          </span>
          <span className="inline-flex items-center gap-2">
            <Truck aria-hidden className="size-4 text-[var(--pub-forest)]" />
            Collector
          </span>
          <StatusPill status="planned" className="ml-auto" />
        </figcaption>
      )}
    </figure>
  )
}

/** Today's real console figures (same selector as the dashboard), framed as a console window. */
export function ConsoleCard({ className }: { className?: string }) {
  const logs = useData((d) => d.logs)
  const now = useNow(60_000)
  const m = dashboardMetrics(logs, now)
  const counts = [
    { label: DASHBOARD.kpis.requests.label, value: m.requests },
    { label: DASHBOARD.kpis.collected.label, value: m.collected },
    { label: DASHBOARD.kpis.missed.label, value: m.missed },
    { label: DASHBOARD.kpis.active.label, value: m.active },
  ]
  return (
    <figure className={cn('min-w-0 overflow-hidden rounded-xl border border-line bg-panel shadow-e3', className)}>
      <div className="flex items-center gap-3 border-b border-line bg-muted px-4 py-2.5">
        <BrandMark size="sm" />
        <figcaption className="min-w-0 flex-1 truncate text-[13px] font-semibold text-ink">{DASHBOARD.title}</figcaption>
        <DemoTag />
      </div>
      <dl className="grid grid-cols-4 divide-x divide-line">
        {counts.map((c) => (
          <div key={c.label} className="px-3 py-3">
            <dt className="text-[12px] leading-4 text-ink-3">{c.label}</dt>
            <dd className="tabular mt-1 text-[22px] font-bold leading-none text-ink">{c.value}</dd>
          </div>
        ))}
      </dl>
      <div className="border-t border-line px-4 py-3">
        <StatusMix logs={logs} now={now} />
      </div>
    </figure>
  )
}
