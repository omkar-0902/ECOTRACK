import { useRef, useState, type KeyboardEvent } from 'react'
import { useSearchParams } from 'react-router'
import { Activity, ArrowRight, Info, LayoutGrid, Map, Smartphone, Truck, Users } from 'lucide-react'
import { useData } from '@/store/StoreProvider'
import { useNow } from '@/hooks/useNow'
import { Button } from '@/components/ui/Button'
import { BrandMark } from '@/components/layout/Brand'
import { DemoTag, UnitStatusBadge } from '@/components/ui/Status'
import { CollectorTable, LogTable, MetricStrip, StatusMix } from '@/features/views/OpsViews'
import { UnitMap } from '@/features/views/UnitMap'
import { COLLECTORS, DASHBOARD, REPORTS, TRACKING } from '@/content/original'
import { logsToday } from '@/store/selectors'
import { cn } from '@/lib/cn'
import { usePublicActions } from './PublicLayout'
import { COLLECTOR_FEATURES, RESIDENT_FEATURES, type Status } from './site/content'
import { Container, PageHead, StatusPill } from './site/ui'
import { GeofenceMap, ResidentPhone } from './site/visuals'

const AUDIENCES: { id: 'console' | 'resident' | 'collector'; label: string; icon: typeof LayoutGrid; status: Status }[] = [
  { id: 'console', label: 'Municipal console', icon: LayoutGrid, status: 'available' },
  { id: 'resident', label: 'Resident app', icon: Smartphone, status: 'planned' },
  { id: 'collector', label: 'Collector app', icon: Truck, status: 'planned' },
]
type AudienceId = (typeof AUDIENCES)[number]['id']

const SCREENS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, title: DASHBOARD.title, sub: DASHBOARD.subtitle },
  { id: 'tracker', label: 'Live Tracker', icon: Map, title: TRACKING.title, sub: TRACKING.subtitle },
  { id: 'reports', label: 'Collection Reports', icon: Activity, title: REPORTS.title, sub: REPORTS.subtitle },
  { id: 'collectors', label: 'Collectors', icon: Users, title: COLLECTORS.title, sub: COLLECTORS.subtitle },
] as const
type ScreenId = (typeof SCREENS)[number]['id']

/** Arrow-key roving focus for a horizontal tablist. */
function useTabKeys<T extends string>(ids: readonly T[], select: (id: T) => void) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const onKey = (e: KeyboardEvent, i: number) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!d) return
    e.preventDefault()
    const n = (i + d + ids.length) % ids.length
    select(ids[n])
    refs.current[n]?.focus()
  }
  return { refs, onKey }
}

export default function PreviewPage() {
  const { openSignIn } = usePublicActions()
  const [params, setParams] = useSearchParams()
  const audience = AUDIENCES.find((a) => a.id === params.get('for')) ?? AUDIENCES[0]
  const screen = SCREENS.find((s) => s.id === params.get('view')) ?? SCREENS[0]

  const setAudience = (id: AudienceId) => setParams(id === 'console' ? {} : { for: id }, { replace: true })
  const setScreen = (id: ScreenId) => setParams({ view: id }, { replace: true })
  const aTabs = useTabKeys(AUDIENCES.map((a) => a.id), setAudience)
  const sTabs = useTabKeys(SCREENS.map((s) => s.id), setScreen)

  return (
    <>
      <PageHead
        eyebrow="Preview"
        title={
          <>
            See EcoTrack <span className="text-[var(--pub-forest)]">from each side.</span>
          </>
        }
        body="Pick who you are looking through. The municipal console is the working product in this build; the resident and collector views are concepts from the EcoTrack proposal, shown as they were drawn there."
      />

      <section aria-label="Product preview" className="bg-muted py-10 lg:py-14">
        <Container>
          <div role="tablist" aria-label="Preview for" className="grid gap-3 sm:grid-cols-3">
            {AUDIENCES.map((a, i) => {
              const on = a.id === audience.id
              return (
                <button
                  key={a.id}
                  ref={(el) => {
                    aTabs.refs.current[i] = el
                  }}
                  role="tab"
                  id={`for-${a.id}`}
                  aria-selected={on}
                  aria-controls="preview-audience"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setAudience(a.id)}
                  onKeyDown={(e) => aTabs.onKey(e, i)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border bg-panel px-4 py-3.5 text-left transition-colors',
                    on ? 'border-[var(--pub-forest)] shadow-e2 ring-1 ring-[var(--pub-forest)]' : 'border-line hover:border-line-strong',
                  )}
                >
                  <span className={cn('grid size-10 shrink-0 place-items-center rounded-lg', on ? 'bg-[var(--pub-forest)] text-white' : 'bg-[var(--pub-mint)] text-[var(--pub-forest)]')}>
                    <a.icon aria-hidden strokeWidth={1.75} className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-bold text-ink">{a.label}</span>
                  </span>
                  <StatusPill status={a.status} />
                </button>
              )
            })}
          </div>

          <div id="preview-audience" role="tabpanel" aria-labelledby={`for-${audience.id}`} className="mt-6">
            {audience.id === 'console' && (
              <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-panel shadow-e3 lg:h-[640px]">
                <div className="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-2 border-b border-line bg-muted px-4 sm:px-5">
                  <BrandMark size="sm" />
                  <div role="tablist" aria-label="Console screens" className="scrollbar-none -mb-px flex min-w-0 flex-1 gap-6 overflow-x-auto">
                    {SCREENS.map((s, i) => {
                      const on = s.id === screen.id
                      return (
                        <button
                          key={s.id}
                          ref={(el) => {
                            sTabs.refs.current[i] = el
                          }}
                          role="tab"
                          id={`screen-${s.id}`}
                          aria-selected={on}
                          aria-controls="preview-screen"
                          tabIndex={on ? 0 : -1}
                          onClick={() => setScreen(s.id)}
                          onKeyDown={(e) => sTabs.onKey(e, i)}
                          className={cn('flex h-13 shrink-0 items-center gap-2 border-b-[3px] text-[14px] transition-colors', on ? 'border-brand font-semibold text-ink' : 'border-transparent text-ink-2 hover:text-ink')}
                        >
                          <s.icon aria-hidden strokeWidth={1.75} className={cn('size-4', on ? 'text-[var(--pub-forest)]' : 'text-ink-3')} />
                          {s.label}
                        </button>
                      )
                    })}
                  </div>
                  <DemoTag />
                </div>
                <div id="preview-screen" role="tabpanel" aria-labelledby={`screen-${screen.id}`} className="flex min-h-[460px] flex-1 flex-col lg:min-h-0">
                  <div className="shrink-0 border-b border-line px-6 py-4">
                    <p className="text-[19px] font-bold text-ink">{screen.title}</p>
                    <p className="text-[14px] text-ink-3">{screen.sub}</p>
                  </div>
                  <ConsoleScreen id={screen.id} />
                </div>
              </div>
            )}

            {audience.id === 'resident' && (
              <div className="grid items-center gap-10 rounded-xl border border-line bg-[var(--pub-field)] p-6 sm:p-10 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-16">
                <div className="flex justify-center">
                  <ResidentPhone />
                </div>
                <div>
                  <h2 className="text-[clamp(24px,2.4vw,32px)] font-bold leading-tight text-ink">The resident home screen</h2>
                  <p className="mt-3 max-w-xl text-[16px] leading-[1.6] text-ink-2">
                    The proposal shows one resident screen: a map of pinned pickups around the collector's zone, a Request Pickup button, and counters for pending requests and Eco Points. It supports these capabilities:
                  </p>
                  <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
                    {RESIDENT_FEATURES.map((f) => (
                      <li key={f.title} className="flex items-center gap-3 border-b border-[color-mix(in_srgb,var(--pub-forest)_18%,transparent)] py-3 text-[15px] font-semibold text-ink">
                        <f.icon aria-hidden strokeWidth={1.75} className="size-5 shrink-0 text-[var(--pub-forest)]" />
                        {f.title}
                      </li>
                    ))}
                  </ul>
                  <ConceptNote />
                </div>
              </div>
            )}

            {audience.id === 'collector' && (
              <div className="grid gap-10 rounded-xl border border-line bg-panel p-6 sm:p-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-14">
                <GeofenceMap animated />
                <div>
                  <h2 className="text-[clamp(24px,2.4vw,32px)] font-bold leading-tight text-ink">The live geofencing map</h2>
                  <p className="mt-3 text-[16px] leading-[1.6] text-ink-2">Pickup zones are geofences; the collector's route runs between them, and entering a zone triggers the resident's alert.</p>
                  <ul className="mt-6 flex flex-col gap-3">
                    {COLLECTOR_FEATURES.map((f) => (
                      <li key={f.title} className="flex items-center gap-3 text-[15px] font-semibold text-ink">
                        <f.icon aria-hidden strokeWidth={1.75} className="size-5 shrink-0 text-[var(--pub-forest)]" />
                        {f.title}
                      </li>
                    ))}
                  </ul>
                  <ConceptNote />
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="flex items-start gap-2 text-[14px] text-ink-3">
              <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
              Console records are an illustrative demo dataset, not live municipal data. Changes made in the console stay in this browser.
            </p>
            <Button variant="primary" size="lg" onClick={openSignIn} icon={<ArrowRight aria-hidden className="size-4" />} trailingIcon>
              Sign in to the console
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}

function ConceptNote() {
  return (
    <p className="mt-6 flex items-start gap-2 rounded-lg border border-dashed border-line-strong bg-panel px-4 py-3 text-[14px] text-ink-2">
      <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-3" />
      Redrawn from the EcoTrack proposal. This app is planned and is not part of this web build, so there is nothing to sign in to yet.
    </p>
  )
}

function ConsoleScreen({ id }: { id: ScreenId }) {
  const logs = useData((d) => d.logs)
  const collectors = useData((d) => d.collectors)
  const now = useNow(60_000)
  const [selected, setSelected] = useState<string | null>(null)

  // Demo safety: ensure metrics display active logs even across date boundaries
  const effectiveNow = logs.length > 0 && logsToday(logs, now).length === 0 ? Math.max(...logs.map((l) => l.createdAt)) : now

  if (id === 'dashboard') {
    const today = logsToday(logs, effectiveNow).sort((a, b) => b.createdAt - a.createdAt)
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="shrink-0 border-b border-line">
          <MetricStrip logs={logs} now={effectiveNow} />
        </div>
        <div className="shrink-0 border-b border-line px-6 py-4">
          <StatusMix logs={logs} now={effectiveNow} />
        </div>
        <div className="min-h-0 flex-1 overflow-auto">
          <LogTable logs={today} now={effectiveNow} />
        </div>
      </div>
    )
  }
  if (id === 'tracker') {
    return (
      <div className="grid min-h-0 flex-1 md:grid-cols-[minmax(0,1fr)_280px]">
        <div className="relative min-h-[320px]">
          <UnitMap collectors={collectors} selectedId={selected} onSelect={setSelected} className="absolute inset-0" />
        </div>
        <ul className="min-h-0 divide-y divide-line overflow-auto border-t border-line md:border-l md:border-t-0">
          {collectors.map((c) => (
            <li key={c.id}>
              <button type="button" onClick={() => setSelected(c.id)} disabled={!c.position} aria-pressed={selected === c.id} className={cn('flex min-h-14 w-full items-center justify-between gap-3 px-5 py-2.5 text-left transition-colors disabled:cursor-default', selected === c.id ? 'bg-accent-soft' : 'hover:bg-hover')}>
                <span className="min-w-0">
                  <span className="block truncate text-[14px] font-semibold text-ink">{c.name}</span>
                  <span className="block text-[12px] text-ink-3">{c.position ? c.id : 'No reported position'}</span>
                </span>
                <UnitStatusBadge online={c.online} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    )
  }
  if (id === 'reports') {
    return (
      <div className="min-h-0 flex-1 overflow-auto">
        <LogTable logs={[...logs].sort((a, b) => b.createdAt - a.createdAt)} now={effectiveNow} showDate />
      </div>
    )
  }
  return (
    <div className="min-h-0 flex-1 overflow-auto">
      <CollectorTable collectors={collectors} />
    </div>
  )
}
