/**
 * Product visuals for the public site.
 *
 * ResidentPhone and GeofenceMap are redrawn from the EcoTrack proposal deck
 * (slide 3) so they stay sharp at any size; both are concepts and say so.
 * ConsoleCard renders the real console components with the demo dataset.
 * FinancialImpactWidget visualizes the economic model from slides 7 and 8.
 */
import { useState } from 'react'
import { CheckCircle2, Coins, Fuel, Leaf, MapPin, TrendingDown, Truck } from 'lucide-react'
import { useData } from '@/store/StoreProvider'
import { useNow } from '@/hooks/useNow'
import { DemoTag } from '@/components/ui/Status'
import { BrandMark } from '@/components/layout/Brand'
import { StatusMix } from '@/features/views/OpsViews'
import { dashboardMetrics, logsToday } from '@/store/selectors'
import { DASHBOARD } from '@/content/original'
import { FINANCIAL_COMPARISON } from './content'
import { cn } from '@/lib/cn'
import { StatusPill } from './ui'

/** The resident home screen from the deck: map of pinned pickups, Request Pickup, Pending and Eco Points. */
export function ResidentPhone({ className, caption = true }: { className?: string; caption?: boolean }) {
  const [activeTab, setActiveTab] = useState<'pin' | 'alert' | 'points'>('pin')

  return (
    <figure className={cn('w-[270px] shrink-0 select-none', className)}>
      <div className="rounded-[36px] border-[3px] border-[#2ecc71] bg-[#0b1a10] p-2.5 shadow-e3 transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(46,204,113,0.22)]">
        <div className="overflow-hidden rounded-[28px] bg-[#0e1d13] text-white">
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pb-1 pt-3 text-[10px] text-white/70">
            <span className="font-semibold">9:41</span>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-3.5 rounded-[2px] bg-white/70" />
            </div>
          </div>

          {/* App Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-[#14281a] px-4 py-2.5">
            <div className="flex items-center gap-1.5 text-[14px] font-bold text-[#6ee38f]">
              <Leaf className="size-4" />
              EcoTrack
            </div>
            <span className="rounded-full bg-[#1b3d24] px-2 py-0.5 text-[10px] font-semibold text-[#8bf0a6]">
              Ward 12
            </span>
          </div>

          {/* Interactive Screen Selector */}
          <div className="flex border-b border-white/10 bg-[#0e1d13] text-[11px]">
            <button
              type="button"
              onClick={() => setActiveTab('pin')}
              className={cn(
                'flex-1 py-1.5 text-center font-semibold transition-colors',
                activeTab === 'pin' ? 'border-b-2 border-[#2ecc71] text-[#6ee38f]' : 'text-white/60 hover:text-white',
              )}
            >
              Pin
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('alert')}
              className={cn(
                'flex-1 py-1.5 text-center font-semibold transition-colors',
                activeTab === 'alert' ? 'border-b-2 border-[#2ecc71] text-[#6ee38f]' : 'text-white/60 hover:text-white',
              )}
            >
              Alert
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('points')}
              className={cn(
                'flex-1 py-1.5 text-center font-semibold transition-colors',
                activeTab === 'points' ? 'border-b-2 border-[#2ecc71] text-[#6ee38f]' : 'text-white/60 hover:text-white',
              )}
            >
              Points
            </button>
          </div>

          {/* Simulated Screen Content */}
          {activeTab === 'pin' && (
            <>
              <div className="relative">
                <svg viewBox="0 0 240 145" className="block w-full bg-[#0d1a11]">
                  {[38, 77, 116, 155, 194].map((x) => (
                    <line key={`v${x}`} x1={x} y1="0" x2={x} y2="145" stroke="#ffffff" strokeOpacity="0.06" />
                  ))}
                  {[37, 75, 113].map((y) => (
                    <line key={`h${y}`} x1="0" y1={y} x2="240" y2={y} stroke="#ffffff" strokeOpacity="0.06" />
                  ))}
                  {/* Geofence radius */}
                  <circle cx="116" cy="72" r="32" fill="none" stroke="#2ecc71" strokeOpacity="0.5" strokeDasharray="3 4" />
                  {/* Planned truck route */}
                  <path d="M48 50 L116 72 L144 86 L174 34" fill="none" stroke="#2ecc71" strokeOpacity="0.85" strokeDasharray="4 4" strokeWidth="1.5" />
                  {/* Household stops */}
                  <circle cx="48" cy="50" r="6" fill="#2ecc71" />
                  <circle cx="174" cy="34" r="6" fill="#2ecc71" />
                  <circle cx="144" cy="86" r="6" fill="#2ecc71" />
                  {/* Resident Drop Pin */}
                  <g transform="translate(108, 56)">
                    <circle cx="8" cy="8" r="12" fill="#1a6b35" fillOpacity="0.7" />
                    <rect x="3" y="4" width="10" height="7" rx="1.5" fill="#ffffff" />
                  </g>
                </svg>
                <div className="absolute bottom-2 left-3 right-3 rounded-md bg-[#0a150e]/90 px-2 py-1 text-[10px] text-[#8bf0a6] backdrop-blur-xs">
                  📍 Pin: House #14, Green Valley
                </div>
              </div>

              <div className="space-y-2 p-3">
                <div className="flex items-center justify-center gap-2 rounded-xl bg-[#1a6b35] py-2.5 text-[13px] font-semibold shadow-sm">
                  <MapPin className="size-4" />
                  Request Pickup
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-white/10 bg-[#14281a] px-3 py-2">
                    <p className="text-[10px] text-white/60">Pending</p>
                    <p className="text-[15px] font-bold text-[#6ee38f]">3 active</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-[#14281a] px-3 py-2">
                    <p className="text-[10px] text-white/60">Eco Points</p>
                    <p className="text-[15px] font-bold text-[#f4d35e]">240 pts</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'alert' && (
            <div className="space-y-3 p-3.5">
              <div className="rounded-xl border border-[#2ecc71]/40 bg-[#14301f] p-3 text-left">
                <div className="flex items-center gap-2 text-[12px] font-bold text-[#6ee38f]">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2ecc71] opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-[#2ecc71]" />
                  </span>
                  Arrival Notification
                </div>
                <p className="mt-1.5 text-[11px] leading-relaxed text-white/80">
                  Truck <span className="font-bold text-white">#ECO-1042</span> entered your neighborhood zone!
                </p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-white/60">
                  <span>Estimated arrival:</span>
                  <span className="font-semibold text-[#8bf0a6]">~3 mins</span>
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#14281a] p-3 text-left">
                <p className="text-[11px] font-semibold text-white">Checklist:</p>
                <ul className="mt-2 space-y-1.5 text-[10px] text-white/70">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-3 text-[#2ecc71]" /> Wet & dry waste segregated
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-3 text-[#2ecc71]" /> Bins placed at doorstep
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'points' && (
            <div className="space-y-2.5 p-3.5 text-center">
              <div className="grid size-12 place-items-center mx-auto rounded-full bg-[#1b3d24] text-[#f4d35e]">
                <Coins className="size-6" />
              </div>
              <p className="text-[12px] font-bold text-white">240 Eco Points</p>
              <p className="text-[10px] leading-relaxed text-white/70">
                Earned through verified collections and zero missed handshakes.
              </p>
              <div className="rounded-lg border border-white/10 bg-[#14281a] p-2 text-left text-[10px]">
                <div className="flex items-center justify-between text-white/80">
                  <span>Last Pickup</span>
                  <span className="font-semibold text-[#6ee38f]">+50 pts</span>
                </div>
                <div className="flex items-center justify-between text-white/50">
                  <span>Segregation Bonus</span>
                  <span className="font-semibold text-[#6ee38f]">+20 pts</span>
                </div>
              </div>
            </div>
          )}

          {/* Home indicator */}
          <div className="pb-2 pt-1">
            <div className="mx-auto h-1 w-16 rounded-full bg-white/20" />
          </div>
        </div>
      </div>
      {caption && (
        <figcaption className="mt-3 flex flex-wrap items-center justify-center gap-2 text-center text-[12px] text-ink-3">
          <StatusPill status="planned" />
          Resident app concept · Deck Slide 3
        </figcaption>
      )}
    </figure>
  )
}

const ZONES = [
  { id: 'A', x: 120, y: 92, near: true, label: 'Sector 4 / Zone A' },
  { id: 'B', x: 300, y: 230, near: false, label: 'Sector 2 / Zone B' },
  { id: 'C', x: 470, y: 86, near: false, label: 'Sector 7 / Zone C' },
]

/** Geofenced pickup zones joined by the collector's route, as in the deck's collector map. */
export function GeofenceMap({ className, legend = true, animated = false }: { className?: string; legend?: boolean; animated?: boolean }) {
  return (
    <figure className={cn('min-w-0', className)}>
      <svg
        viewBox="0 0 600 330"
        role="img"
        aria-label="Concept map: three geofenced pickup zones, A, B and C, joined by a dashed collector route. The truck is entering zone A, which shows a Near alert."
        className="pub-grid block w-full rounded-xl border border-line bg-[var(--pub-field)] shadow-sm"
      >
        {/* Main thoroughfare */}
        <rect x="0" y="168" width="600" height="20" fill="var(--pub-mint)" />
        <line x1="0" y1="178" x2="600" y2="178" stroke="var(--pub-ring)" strokeDasharray="10 10" />

        {/* Dynamic Route */}
        <path
          d="M120 92 L205 172 L300 230 L380 172 L470 86"
          fill="none"
          stroke="var(--pub-forest)"
          strokeWidth="2.75"
          strokeLinecap="round"
          className={cn('pub-route', animated && 'pub-route-animated')}
        />

        {/* Zones */}
        {ZONES.map((z) => (
          <g key={z.id}>
            {/* Geofence Ring */}
            <circle
              cx={z.x}
              cy={z.y}
              r="48"
              fill="var(--pub-mint)"
              fillOpacity="0.5"
              stroke="var(--pub-ring)"
              strokeWidth="2"
              strokeDasharray="6 6"
            />
            {/* Housing Icon Representation */}
            <path
              d={`M${z.x - 18} ${z.y + 2} L${z.x} ${z.y - 16} L${z.x + 18} ${z.y + 2} V${z.y + 20} H${z.x - 18} Z`}
              fill="var(--et-panel)"
              stroke="var(--pub-forest)"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <rect x={z.x - 5} y={z.y + 8} width="10" height="12" fill="var(--pub-forest)" />
            <text x={z.x} y={z.y + 68} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--et-ink)">
              Zone {z.id}
            </text>
            <text x={z.x} y={z.y + 82} textAnchor="middle" fontSize="11" fontWeight="500" fill="var(--et-ink-3)">
              {z.label}
            </text>
          </g>
        ))}

        {/* "Near!" alert at zone A */}
        <g>
          <rect x="24" y="24" width="82" height="30" rx="6" fill="var(--pub-forest)" />
          <text x="65" y="44" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ffffff">
            Near! ⚡
          </text>
          <line x1="106" y1="44" x2="114" y2="58" stroke="var(--pub-forest)" strokeWidth="2" strokeDasharray="3 3" />
        </g>

        {/* Truck entering zone A's ring */}
        <g transform="translate(168 148)">
          <circle cx="16" cy="12" r="32" fill="none" stroke="var(--pub-forest)" strokeOpacity="0.3" strokeWidth="1.5" />
          <rect x="-6" y="0" width="46" height="24" rx="5" fill="var(--pub-forest)" />
          <text x="17" y="16" textAnchor="middle" fontSize="11" fontWeight="700" fill="#ffffff">
            ECO
          </text>
          <circle cx="4" cy="27" r="5.5" fill="var(--et-panel)" stroke="var(--pub-forest)" strokeWidth="2" />
          <circle cx="31" cy="27" r="5.5" fill="var(--et-panel)" stroke="var(--pub-forest)" strokeWidth="2" />
        </g>
      </svg>

      {legend && (
        <figcaption className="mt-3.5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-ink-2">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="size-3.5 rounded-full border-2 border-dashed border-[var(--pub-ring)] bg-[var(--pub-mint)]" />
            Pickup zone (geofence perimeter)
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="w-6 border-t-2 border-dashed border-[var(--pub-forest)]" />
            Collector live route
          </span>
          <span className="inline-flex items-center gap-2">
            <Truck aria-hidden className="size-4 text-[var(--pub-forest)]" />
            Collector unit
          </span>
          <StatusPill status="planned" className="ml-auto" />
        </figcaption>
      )}
    </figure>
  )
}

/** Today's real console figures (with safe freshness fallback for demo across days). */
export function ConsoleCard({ className }: { className?: string }) {
  const logs = useData((d) => d.logs)
  const now = useNow(60_000)

  // Demo safety: ensure metrics display active logs even across date boundaries
  const effectiveNow = logs.length > 0 && logsToday(logs, now).length === 0 ? Math.max(...logs.map((l) => l.createdAt)) : now
  const m = dashboardMetrics(logs, effectiveNow)

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
        <StatusMix logs={logs} now={effectiveNow} />
      </div>
    </figure>
  )
}

/** Slide 8 — Financial Impact & Missed Pickup Cost Comparison Widget */
export function FinancialImpactWidget({ className }: { className?: string }) {
  const [mode, setMode] = useState<'daily' | 'monthly'>('monthly')

  return (
    <div className={cn('overflow-hidden rounded-2xl border border-line bg-panel p-6 sm:p-8 shadow-e2', className)}>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <span className="text-[12px] font-bold uppercase tracking-wider text-[var(--pub-forest)]">
            Proposal Deck · Slide 8
          </span>
          <h3 className="mt-1 text-[22px] font-bold text-ink">{FINANCIAL_COMPARISON.headline}</h3>
          <p className="mt-0.5 text-[14px] text-ink-2">{FINANCIAL_COMPARISON.subheading}</p>
        </div>
        <div className="flex rounded-lg border border-line bg-muted p-1 text-[13px]">
          <button
            type="button"
            onClick={() => setMode('daily')}
            className={cn(
              'rounded-md px-3 py-1 font-semibold transition-colors',
              mode === 'daily' ? 'bg-panel text-ink shadow-xs' : 'text-ink-2 hover:text-ink',
            )}
          >
            Daily Cost
          </button>
          <button
            type="button"
            onClick={() => setMode('monthly')}
            className={cn(
              'rounded-md px-3 py-1 font-semibold transition-colors',
              mode === 'monthly' ? 'bg-panel text-ink shadow-xs' : 'text-ink-2 hover:text-ink',
            )}
          >
            Monthly Impact
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Without EcoTrack */}
        <div className="flex flex-col justify-between rounded-xl border border-crit-soft bg-crit-soft/20 p-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold uppercase tracking-wider text-crit-text">
                ❌ {FINANCIAL_COMPARISON.withoutEcoTrack.label}
              </span>
              <span className="rounded-full bg-crit-soft px-2.5 py-0.5 text-[12px] font-bold text-crit-text">
                {FINANCIAL_COMPARISON.withoutEcoTrack.missedRate} missed
              </span>
            </div>
            <p className="mt-4 text-[36px] font-extrabold text-crit-text">
              {mode === 'daily' ? FINANCIAL_COMPARISON.withoutEcoTrack.dailyCost : '₹22,50,000'}
              <span className="text-[14px] font-normal text-ink-2"> / {mode === 'daily' ? 'day' : 'month'}</span>
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-2">
              {FINANCIAL_COMPARISON.withoutEcoTrack.notes}
            </p>
          </div>
          <div className="mt-6 border-t border-crit-soft/60 pt-3 text-[12px] text-ink-3">
            High operational deficit and repeated resident grievances.
          </div>
        </div>

        {/* With EcoTrack */}
        <div className="flex flex-col justify-between rounded-xl border border-ok-soft bg-ok-soft/30 p-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold uppercase tracking-wider text-ok-text">
                ✅ {FINANCIAL_COMPARISON.withEcoTrack.label}
              </span>
              <span className="rounded-full bg-ok-soft px-2.5 py-0.5 text-[12px] font-bold text-ok-text">
                {FINANCIAL_COMPARISON.withEcoTrack.missedRate} missed
              </span>
            </div>
            <p className="mt-4 text-[36px] font-extrabold text-ok-text">
              {mode === 'daily' ? FINANCIAL_COMPARISON.withEcoTrack.dailyCost : '₹6,30,000'}
              <span className="text-[14px] font-normal text-ink-2"> / {mode === 'daily' ? 'day' : 'month'}</span>
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-2">
              {FINANCIAL_COMPARISON.withEcoTrack.notes}
            </p>
          </div>
          <div className="mt-6 border-t border-ok-soft/60 pt-3 text-[12px] font-semibold text-ok-text">
            Net projected savings: <span className="font-bold underline">{FINANCIAL_COMPARISON.savings.monthlyCitySavings} / month</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-6 sm:grid-cols-3">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg bg-[var(--pub-mint)] text-[var(--pub-forest)]">
            <TrendingDown className="size-5" />
          </div>
          <div>
            <p className="text-[18px] font-bold text-ink">{FINANCIAL_COMPARISON.savings.rateDrop}</p>
            <p className="text-[12px] text-ink-3">Missed pickup cost drop</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg bg-[var(--pub-mint)] text-[var(--pub-forest)]">
            <Fuel className="size-5" />
          </div>
          <div>
            <p className="text-[18px] font-bold text-ink">{FINANCIAL_COMPARISON.savings.fuelSavings}</p>
            <p className="text-[12px] text-ink-3">Fuel cost reduction</p>
          </div>
        </div>
        <div className="col-span-2 sm:col-span-1 flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg bg-[var(--pub-mint)] text-[var(--pub-forest)]">
            <Truck className="size-5" />
          </div>
          <div>
            <p className="text-[18px] font-bold text-ink">{FINANCIAL_COMPARISON.savings.truckMonthlySavings}</p>
            <p className="text-[12px] text-ink-3">Saved per truck / month</p>
          </div>
        </div>
      </div>
    </div>
  )
}

