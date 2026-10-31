import { useRef, useState, type KeyboardEvent } from 'react'
import { useSearchParams } from 'react-router'
import { Activity, ArrowRight, Check, Info, LayoutGrid, Map, Smartphone, Truck, Users } from 'lucide-react'
import { useData } from '@/store/StoreProvider'
import { useNow } from '@/hooks/useNow'
import { Button } from '@/components/ui/Button'
import { BrandMark } from '@/components/layout/Brand'
import { DemoTag, UnitStatusBadge } from '@/components/ui/Status'
import { CollectorTable, LogTable, MetricStrip, StatusMix } from '@/features/views/OpsViews'
import { UnitMap } from '@/features/views/UnitMap'
import { logsToday } from '@/store/selectors'
import { cn } from '@/lib/cn'
import { usePublicActions } from './PublicLayout'
import { NEXT, PREVIEW_NOTES, type Status } from './site/content'
import { Container, PageHead, StatusPill } from './site/ui'
import { CREW_LABEL, CrewAppScreen, Phone, RESIDENT_LABEL, ResidentAppScreen } from './site/showcase'

const AUDIENCES: { id: 'console' | 'resident' | 'collector'; label: string; who: string; icon: typeof LayoutGrid; status: Status }[] = [
  { id: 'console', label: 'Municipal console', who: 'For city teams', icon: LayoutGrid, status: 'available' },
  { id: 'resident', label: 'Resident app', who: 'For residents', icon: Smartphone, status: 'planned' },
  { id: 'collector', label: 'Crew app', who: 'For collection crews', icon: Truck, status: 'planned' },
]
type AudienceId = (typeof AUDIENCES)[number]['id']

const SCREENS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, title: 'Operations dashboard' },
  { id: 'tracker', label: 'Collector map', icon: Map, title: 'Collector map' },
  { id: 'reports', label: 'Records', icon: Activity, title: 'Collection records' },
  { id: 'collectors', label: 'Roster', icon: Users, title: 'Collector roster' },
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
      <PageHead eyebrow="Product preview" title="See EcoTrack from every side." body="The console as it works today, and the resident and crew apps to come." />

      <section aria-label="Product preview" className="bg-[var(--pub-warm)] py-12 lg:py-16">
        <Container>
          <div role="tablist" aria-label="Choose a view" className="grid gap-3 sm:grid-cols-3">
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
                  className={cn('flex items-center gap-4 rounded-2xl border bg-panel p-4 text-left transition-colors', on ? 'border-[var(--pub-forest)] shadow-e2 ring-1 ring-[var(--pub-forest)]' : 'border-line hover:border-line-strong')}
                >
                  <span className={cn('grid size-11 shrink-0 place-items-center rounded-xl', on ? 'bg-[var(--pub-forest)] text-white' : 'bg-[var(--pub-mint)] text-[var(--pub-forest)]')}>
                    <a.icon aria-hidden strokeWidth={1.75} className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-bold text-ink">{a.label}</span>
                    <span className="block text-[13px] text-ink-3">{a.who}</span>
                  </span>
                  <StatusPill status={a.status} />
                </button>
              )
            })}
          </div>

          <div id="preview-audience" role="tabpanel" aria-labelledby={`for-${audience.id}`} className="mt-6">
            {audience.id === 'console' && (
              <div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-panel shadow-e3 lg:h-[660px]">
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
                          className={cn('flex h-13 shrink-0 items-center gap-2 border-b-[3px] text-[14px] transition-colors', on ? 'border-[var(--pub-leaf)] font-semibold text-ink' : 'border-transparent text-ink-2 hover:text-ink')}
                        >
                          <s.icon aria-hidden strokeWidth={1.75} className={cn('size-4', on ? 'text-[var(--pub-forest)]' : 'text-ink-3')} />
                          {s.label}
                        </button>
                      )
                    })}
                  </div>
                  <DemoTag label="Sample data" />
                </div>
                <div id="preview-screen" role="tabpanel" aria-labelledby={`screen-${screen.id}`} className="flex min-h-[460px] flex-1 flex-col lg:min-h-0">
                  <div className="shrink-0 border-b border-line px-6 py-4">
                    <p className="text-[19px] font-bold text-ink">{screen.title}</p>
                    <p className="text-[14px] text-ink-2">{PREVIEW_NOTES[screen.id]}</p>
                  </div>
                  <ConsoleScreen id={screen.id} />
                </div>
              </div>
            )}

            {audience.id === 'resident' && (
              <ConceptPanel
                title="The resident app"
                body="For residents: ask for a pickup and know when the crew is near."
                items={NEXT.resident}
                visual={
                  <Phone label={RESIDENT_LABEL} className="w-[260px]">
                    <ResidentAppScreen />
                  </Phone>
                }
              />
            )}

            {audience.id === 'collector' && (
              <ConceptPanel
                title="The crew app"
                body="For collection crews: the day's route, the next stop, one tap to confirm."
                items={NEXT.crew}
                visual={
                  <Phone label={CREW_LABEL} className="w-[260px]">
                    <CrewAppScreen />
                  </Phone>
                }
              />
            )}
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="flex items-start gap-2 text-[14px] text-ink-2">
              <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-3" />
              Console figures and positions are sample data, not live municipal records. Changes you make in the console stay in this browser.
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

function ConceptPanel({ title, body, items, visual }: { title: string; body: string; items: readonly string[]; visual: React.ReactNode }) {
  return (
    <div className="grid items-center gap-12 rounded-2xl border border-line bg-[var(--pub-field)] p-6 sm:p-12 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-20">
      <div className="flex min-w-0 justify-center">{visual}</div>
      <div>
        <StatusPill status="planned" />
        <h2 className="mt-5 text-[clamp(28px,2.8vw,42px)] font-bold leading-tight text-ink">{title}</h2>
        <p className="mt-3 max-w-xl text-[18px] leading-[1.6] text-ink-2">{body}</p>
        <ul className="mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
          {items.map((t) => (
            <li key={t} className="flex items-center gap-3 text-[16px] font-medium text-ink">
              <Check aria-hidden strokeWidth={2.5} className="size-5 shrink-0 text-[var(--pub-forest)]" />
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-8 flex items-start gap-2 text-[14px] text-ink-2">
          <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-[var(--pub-forest)]" />
          A concept from the product plan. This app is not available yet.
        </p>
      </div>
    </div>
  )
}

function ConsoleScreen({ id }: { id: ScreenId }) {
  const logs = useData((d) => d.logs)
  const collectors = useData((d) => d.collectors)
  const now = useNow(60_000)
  const [selected, setSelected] = useState<string | null>(null)

  if (id === 'dashboard') {
    const today = logsToday(logs, now).sort((a, b) => b.createdAt - a.createdAt)
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="shrink-0 border-b border-line">
          <MetricStrip logs={logs} now={now} />
        </div>
        <div className="shrink-0 border-b border-line px-6 py-4">
          <StatusMix logs={logs} now={now} />
        </div>
        {today.length === 0 ? (
          <p className="px-6 py-10 text-center text-[15px] text-ink-2">No collections have been logged yet today in the sample data. The Records tab shows earlier days.</p>
        ) : (
          <div className="min-h-0 flex-1 overflow-auto">
            <LogTable logs={today} now={now} />
          </div>
        )}
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
                  <span className="block text-[12px] text-ink-3">{c.position ? c.id : 'No position reported'}</span>
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
        <LogTable logs={[...logs].sort((a, b) => b.createdAt - a.createdAt)} now={now} showDate />
      </div>
    )
  }
  return (
    <div className="min-h-0 flex-1 overflow-auto">
      <CollectorTable collectors={collectors} />
    </div>
  )
}
