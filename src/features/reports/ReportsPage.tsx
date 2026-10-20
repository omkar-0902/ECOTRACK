import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CalendarRange, Clock3, Download, Filter, MapPin, SearchX } from 'lucide-react'
import type { CollectionLog, LogStatus } from '@/types/domain'
import { useData } from '@/store/StoreProvider'
import { countByStatus, inRange, startOfDay, type DateRange } from '@/store/selectors'
import { useNow } from '@/hooks/useNow'
import { useTokens } from '@/hooks/useTokens'
import { EmptyState, ModuleNotice, Page, Panel, PanelHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { SearchInput, SelectField } from '@/components/ui/Controls'
import { LOG_STATUS_LABEL, toneDot, toneText } from '@/components/ui/Status'
import { useToast } from '@/components/feedback/Toaster'
import { LogTable } from '@/features/views/OpsViews'
import { REPORTS } from '@/content/original'
import { downloadFile, stamp, toCsv } from '@/lib/csv'
import { cn } from '@/lib/cn'

const RANGE_LABEL: Record<DateRange, string> = { today: REPORTS.dateDefault, '7d': 'Last 7 days', '30d': 'Last 30 days', all: 'All dates' }

export default function ReportsPage() {
  const logs = useData((d) => d.logs)
  const now = useNow(60_000)
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [range, setRange] = useState<DateRange>('7d')
  const [status, setStatus] = useState<'all' | LogStatus>('all')
  const [sector, setSector] = useState('all')

  const sectors = useMemo(() => [...new Set(logs.map((l) => l.sector))].sort(), [logs])
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return inRange(logs, range, now)
      .filter((l) => (status === 'all' || l.status === status) && (sector === 'all' || l.sector === sector) && (!q || `${l.id} ${l.address}`.toLowerCase().includes(q)))
      .sort((a, b) => b.createdAt - a.createdAt)
  }, [logs, range, now, status, sector, query])
  const counts = countByStatus(filtered)
  const noLogs = logs.length === 0
  const filtersActive = query !== '' || status !== 'all' || sector !== 'all'

  const exportData = () => {
    if (filtered.length === 0) {
      toast.info('Nothing to export', 'There are no collection logs for the current filters.')
      return
    }
    const csv = toCsv(
      ['Log ID', 'Address', 'Sector', 'Status', 'Created'],
      filtered.map((l) => [l.id, l.address, l.sector, LOG_STATUS_LABEL[l.status], new Date(l.createdAt).toISOString()]),
    )
    if (downloadFile(`ecotrack-collection-logs-${stamp()}.csv`, csv)) toast.success(`Exported ${filtered.length} logs`, 'The file contains the logs in the current filtered view.')
    else toast.error('Export failed', 'The browser blocked the download.')
  }

  const summary = [
    { label: REPORTS.summary.completed, value: counts.completed, tone: 'ok' as const },
    { label: REPORTS.summary.pending, value: counts.pending, tone: 'warn' as const },
    { label: REPORTS.summary.missed, value: counts.missed, tone: 'crit' as const },
  ]

  return (
    <Page
      title={REPORTS.title}
      subtitle={REPORTS.subtitle}
      actions={
        <Button variant="primary" icon={<Download aria-hidden className="size-4" />} onClick={exportData} disabled={noLogs}>
          {REPORTS.export}
        </Button>
      }
    >
      {noLogs ? (
        <Panel fill label={REPORTS.title}>
          <ModuleNotice icon={<Clock3 aria-hidden className="size-5" />} title={REPORTS.notice.title} body={REPORTS.notice.body} status={REPORTS.notice.status} />
        </Panel>
      ) : (
        <>
          {/* Filters */}
          <div
            role="search"
            aria-label="Filter collection logs"
            className={cn('grid shrink-0 gap-3 rounded-lg border border-line bg-panel p-4 shadow-e1 sm:grid-cols-2', filtersActive ? 'lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))_auto]' : 'lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))]')}
          >
            <SearchInput label="Search address or ID" value={query} onChange={setQuery} placeholder={REPORTS.search} />
            <SelectField label="Date range" icon={<CalendarRange aria-hidden className="size-4" />} value={range} onChange={(v) => setRange(v as DateRange)} options={(Object.keys(RANGE_LABEL) as DateRange[]).map((k) => ({ value: k, label: RANGE_LABEL[k] }))} />
            <SelectField
              label="Status"
              icon={<Filter aria-hidden className="size-4" />}
              value={status}
              onChange={(v) => setStatus(v as 'all' | LogStatus)}
              options={[{ value: 'all', label: REPORTS.statusDefault }, ...(Object.keys(LOG_STATUS_LABEL) as LogStatus[]).map((k) => ({ value: k, label: LOG_STATUS_LABEL[k] }))]}
            />
            <SelectField label="Sector" icon={<MapPin aria-hidden className="size-4" />} value={sector} onChange={setSector} options={[{ value: 'all', label: REPORTS.sectorDefault }, ...sectors.map((s) => ({ value: s, label: s }))]} />
            {filtersActive && (
              <Button
                variant="ghost"
                onClick={() => {
                  setQuery('')
                  setStatus('all')
                  setSector('all')
                }}
              >
                Clear filters
              </Button>
            )}
          </div>

          <div className="grid gap-5 lg:min-h-[420px] lg:flex-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-6">
            {/* Summary + trend */}
            <Panel label="Summary" fill>
              <PanelHeader title="Summary" meta={RANGE_LABEL[range]} />
              <dl className="grid shrink-0 grid-cols-4 border-b border-line">
                <div className="bg-muted px-4 py-4 sm:px-5">
                  <dt className="text-[13px] font-medium text-ink-2">{REPORTS.summary.total}</dt>
                  <dd className="tabular mt-1.5 text-[28px] font-bold leading-none text-ink">{filtered.length}</dd>
                </div>
                {summary.map((s) => (
                  <div key={s.label} className="border-l border-line px-4 py-4 sm:px-5">
                    <dt className="flex items-center gap-1.5 text-[13px] font-medium text-ink-2">
                      <span aria-hidden className={cn('size-1.5 rounded-full', toneDot(s.tone))} />
                      {s.label}
                    </dt>
                    <dd className={cn('tabular mt-1.5 text-[28px] font-bold leading-none', s.value ? toneText(s.tone) : 'text-ink')}>{s.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex min-h-[240px] flex-1 flex-col px-4 pb-4 pt-5">
                <p className="px-2 text-[14px] font-semibold text-ink">{range === 'today' ? 'Logs by hour' : 'Logs by day'}, stacked by status</p>
                <div className="min-h-0 flex-1">
                  <TrendChart logs={filtered} range={range} now={now} />
                </div>
              </div>
            </Panel>

            {/* Log table */}
            <Panel label="Collection logs" fill>
              <PanelHeader title="Collection logs" meta={`${filtered.length} ${filtered.length === 1 ? 'log' : 'logs'}`} />
              {filtered.length === 0 ? (
                <EmptyState icon={<SearchX aria-hidden className="size-5" />} title="No logs match these filters" body="Widen the date range or clear the filters." />
              ) : (
                <div className="max-h-[480px] min-h-0 overflow-auto lg:max-h-none lg:flex-1">
                  <LogTable logs={filtered} now={now} showDate={range !== 'today'} />
                </div>
              )}
            </Panel>
          </div>
        </>
      )}
    </Page>
  )
}

const dayFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })

function TrendChart({ logs, range, now }: { logs: CollectionLog[]; range: DateRange; now: number }) {
  const t = useTokens()
  const data = useMemo(() => {
    const buckets = new Map<string, { label: string; completed: number; pending: number; missed: number; order: number }>()
    if (range === 'today') {
      for (let h = 0; h <= new Date(now).getHours(); h++) buckets.set(String(h), { label: `${String(h).padStart(2, '0')}:00`, completed: 0, pending: 0, missed: 0, order: h })
      for (const l of logs) buckets.get(String(new Date(l.createdAt).getHours()))![l.status]++
    } else {
      const days = range === '7d' ? 7 : range === '30d' ? 30 : Math.max(1, Math.ceil((startOfDay(now) - Math.min(...logs.map((l) => startOfDay(l.createdAt)), startOfDay(now))) / 86_400_000) + 1)
      for (let i = days - 1; i >= 0; i--) {
        const d = startOfDay(now) - i * 86_400_000
        buckets.set(String(d), { label: dayFmt.format(d), completed: 0, pending: 0, missed: 0, order: d })
      }
      for (const l of logs) {
        const b = buckets.get(String(startOfDay(l.createdAt)))
        if (b) b[l.status]++
      }
    }
    return [...buckets.values()].sort((a, b) => a.order - b.order)
  }, [logs, range, now])

  if (logs.length === 0) return <p className="grid h-full place-items-center text-[13px] text-ink-3">No logs in this view.</p>
  return (
    <div className="h-full w-full" role="img" aria-label={`Collection logs ${range === 'today' ? 'by hour' : 'by day'}: ${logs.length} total`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }} barCategoryGap="22%">
          <CartesianGrid vertical={false} stroke={t.line} />
          <XAxis dataKey="label" tick={{ fill: t.ink3, fontSize: 12 }} tickLine={false} axisLine={{ stroke: t.line }} minTickGap={16} />
          <YAxis allowDecimals={false} tick={{ fill: t.ink3, fontSize: 12 }} tickLine={false} axisLine={false} width={40} />
          <Tooltip
            cursor={{ fill: t.hover }}
            content={({ active, payload, label }) =>
              active && payload?.length ? (
                <div className="rounded-lg border border-line bg-panel px-3.5 py-2.5 text-[13px] shadow-e2">
                  <p className="mb-1 font-medium text-ink">{label}</p>
                  {(['completed', 'pending', 'missed'] as const).map((k) => (
                    <p key={k} className="flex justify-between gap-6 text-ink-2">
                      {LOG_STATUS_LABEL[k]} <span className="tabular text-ink">{payload[0].payload[k]}</span>
                    </p>
                  ))}
                </div>
              ) : null
            }
          />
          <Bar dataKey="completed" stackId="s" fill={t.ok} isAnimationActive={false} />
          <Bar dataKey="pending" stackId="s" fill={t.warn} isAnimationActive={false} />
          <Bar dataKey="missed" stackId="s" fill={t.crit} radius={[3, 3, 0, 0]} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
