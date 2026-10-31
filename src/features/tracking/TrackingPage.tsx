import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { CloudOff, MapPin, MapPinOff, Signal, Users, WifiOff, X } from 'lucide-react'
import { useData } from '@/store/StoreProvider'
import { EmptyState, Page, Panel } from '@/components/layout/PageHeader'
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary'
import { IconButton } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/Controls'
import { DemoTag, UnitStatusBadge } from '@/components/ui/Status'
import { Avatar } from '@/components/ui/Avatar'
import { UnitMap } from '@/features/views/UnitMap'
import { TRACKING } from '@/content/original'
import { cn } from '@/lib/cn'

type Filter = 'all' | 'online' | 'offline'

export default function TrackingPage() {
  const collectors = useData((d) => d.collectors)
  const [params, setParams] = useSearchParams()
  const selectedId = params.get('unit')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [tilesFailed, setTilesFailed] = useState(false)

  const online = collectors.filter((c) => c.online).length
  const offline = collectors.length - online
  const located = collectors.filter((c) => c.position).length
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return collectors.filter((c) => (filter === 'all' || (filter === 'online') === c.online) && (!q || `${c.name} ${c.id}`.toLowerCase().includes(q)))
  }, [collectors, filter, query])
  const selected = collectors.find((c) => c.id === selectedId) ?? null
  const select = (id: string | null) => setParams(id ? { unit: id } : {}, { replace: true })

  return (
    <Page title={TRACKING.title} subtitle={TRACKING.subtitle} actions={<DemoTag label="Demo positions, not live GPS" />}>
      <Panel label={TRACKING.panelTitle} fill className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* Map */}
        <div className="relative h-[56vh] min-h-[340px] lg:h-auto lg:min-h-0">
          <ErrorBoundary area="The map" compact>
            <UnitMap collectors={visible} selectedId={selectedId} onSelect={select} onTileError={setTilesFailed} className="absolute inset-0" />
          </ErrorBoundary>

          {/* Tracking core legend */}
          <dl aria-label={TRACKING.legendTitle} className="absolute left-3 top-3 z-[400] flex flex-wrap gap-px overflow-hidden rounded-lg border border-line bg-line shadow-e2">
            <LegendCell icon={<Signal aria-hidden className="size-3.5 text-accent-text" />} label={TRACKING.online.label} value={online} />
            <LegendCell icon={<WifiOff aria-hidden className="size-3.5 text-ink-3" />} label={TRACKING.offline.label} value={offline} />
            <LegendCell icon={<MapPin aria-hidden className="size-3.5 text-ink-3" />} label="On map" value={located} />
          </dl>

          {tilesFailed && (
            <p role="status" className="absolute bottom-4 left-4 z-[400] flex max-w-sm items-start gap-2 rounded-lg border border-line bg-panel px-4 py-3 text-[13px] text-ink-2 shadow-e2">
              <CloudOff aria-hidden className="mt-px size-4 shrink-0 text-warn-text" />
              Map tiles couldn't load. Check the network connection; unit positions still display.
            </p>
          )}
        </div>

        {/* Unit panel */}
        <aside aria-label="Collector units" className="flex min-h-0 flex-col border-t border-line lg:border-l lg:border-t-0">
          {selected ? (
            <div className="shrink-0 border-b border-line bg-muted p-4">
              <div className="flex items-start gap-3">
                <Avatar name={selected.name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[17px] font-bold text-ink">{selected.name}</p>
                  <p className="data-mono text-[12.5px] text-ink-3">{selected.id}</p>
                </div>
                <IconButton label="Clear selection" size="sm" onClick={() => select(null)}>
                  <X aria-hidden className="size-4" />
                </IconButton>
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[13px]">
                <div>
                  <dt className="text-ink-3">Status</dt>
                  <dd className="mt-1">
                    <UnitStatusBadge online={selected.online} />
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-3">Contact</dt>
                  <dd className="tabular mt-1 text-ink">{selected.phone}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-ink-3">Last reported position</dt>
                  <dd className="data-mono mt-1 text-[12.5px] text-ink">{selected.position ? `${selected.position.lat.toFixed(4)}, ${selected.position.lng.toFixed(4)}` : 'None reported'}</dd>
                </div>
              </dl>
            </div>
          ) : null}

          <div className="flex shrink-0 flex-col gap-2.5 border-b border-line p-3">
            <SearchInput label="Search units" value={query} onChange={setQuery} placeholder="Search name or ECO-ID" />
            <div role="radiogroup" aria-label="Unit status" className="grid grid-cols-3 gap-1 rounded-lg border border-line bg-muted p-1">
              {(['all', 'online', 'offline'] as Filter[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  role="radio"
                  aria-checked={filter === f}
                  onClick={() => setFilter(f)}
                  className={cn('h-8 rounded-md text-[13px] capitalize transition-colors', filter === f ? 'bg-panel font-semibold text-ink shadow-e1 dark:bg-raised' : 'text-ink-2 hover:text-ink')}
                >
                  {f} <span className="tabular text-ink-3">{f === 'all' ? collectors.length : f === 'online' ? online : offline}</span>
                </button>
              ))}
            </div>
          </div>

          {collectors.length === 0 ? (
            <EmptyState
              icon={<Users aria-hidden className="size-5" />}
              title="No collectors registered"
              body="Units appear here once collectors are registered."
              action={
                <Link to="/collectors?add=1" className="text-[13px] font-medium text-accent-text hover:underline">
                  Add a collector
                </Link>
              }
            />
          ) : visible.length === 0 ? (
            <EmptyState icon={<Users aria-hidden className="size-5" />} title="No units match" body="Try a different search or status filter." />
          ) : (
            <ul className="max-h-[360px] min-h-0 flex-1 divide-y divide-line overflow-auto lg:max-h-none">
              {visible.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => select(c.id)}
                    aria-pressed={c.id === selectedId}
                    className={cn('relative flex min-h-12 w-full items-center gap-3 px-4 py-2 text-left transition-colors', c.id === selectedId ? 'bg-accent-soft shadow-[inset_3px_0_0_var(--et-accent)]' : 'hover:bg-hover')}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-semibold text-ink">{c.name}</span>
                      <span className="flex items-center gap-1.5 text-[12.5px] text-ink-3">
                        <span className="data-mono">{c.id}</span>
                        {!c.position && (
                          <span className="inline-flex items-center gap-1">
                            <MapPinOff aria-hidden className="size-3" /> no position
                          </span>
                        )}
                      </span>
                    </span>
                    <UnitStatusBadge online={c.online} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </Panel>
    </Page>
  )
}

function LegendCell({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2 bg-panel px-3 py-2">
      {icon}
      <dt className="text-[13px] text-ink-2">{label}</dt>
      <dd className="tabular text-[15px] font-bold text-ink">{value}</dd>
    </div>
  )
}
