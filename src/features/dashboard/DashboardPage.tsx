import { Link } from 'react-router'
import { ArrowUpRight, CalendarDays, CheckCircle2, CircleX, ClipboardList, Clock3, type LucideIcon } from 'lucide-react'
import { useData } from '@/store/StoreProvider'
import { dashboardMetrics, logsToday } from '@/store/selectors'
import { useNow } from '@/hooks/useNow'
import { EmptyState, Page, Panel, PanelHeader } from '@/components/layout/PageHeader'
import { toneDot, toneText, type Tone } from '@/components/ui/Status'
import { LogTable } from '@/features/views/OpsViews'
import { UnitMap } from '@/features/views/UnitMap'
import { DASHBOARD } from '@/content/original'
import { formatPercent, share as shareOf } from '@/lib/metrics'
import { cn } from '@/lib/cn'

const dateFmt = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

const KPI_STYLE: Record<Tone | 'accent', { icon: string }> = {
  accent: { icon: 'bg-muted text-ink-2' },
  ok: { icon: 'bg-ok-soft text-ok-text' },
  warn: { icon: 'bg-warn-soft text-warn-text' },
  crit: { icon: 'bg-crit-soft text-crit-text' },
  neutral: { icon: 'bg-muted text-ink-2' },
}

export default function DashboardPage() {
  const logs = useData((d) => d.logs)
  const collectors = useData((d) => d.collectors)
  const now = useNow(60_000)
  const m = dashboardMetrics(logs, now)
  const today = logsToday(logs, now).sort((a, b) => b.createdAt - a.createdAt)
  const online = collectors.filter((c) => c.online).length
  // Bar widths use the exact share; labels use whole percentages that sum to 100.
  const share = (n: number) => (shareOf(n, m.requests) ?? 0) * 100
  const pct = (p: number | undefined) => (m.percents && p !== undefined ? `${p}% of today's logs` : 'No logs recorded today')

  const kpis: { label: string; value: number; note: string; tone: Tone | 'accent'; icon: LucideIcon }[] = [
    { label: DASHBOARD.kpis.requests.label, value: m.requests, note: 'Logged since midnight', tone: 'accent', icon: ClipboardList },
    { label: DASHBOARD.kpis.collected.label, value: m.collected, note: pct(m.percents?.completed), tone: 'ok', icon: CheckCircle2 },
    { label: DASHBOARD.kpis.missed.label, value: m.missed, note: pct(m.percents?.missed), tone: 'crit', icon: CircleX },
    { label: DASHBOARD.kpis.active.label, value: m.active, note: 'Pending collection', tone: 'warn', icon: Clock3 },
  ]

  return (
    <Page
      title={DASHBOARD.title}
      subtitle={DASHBOARD.subtitle}
      actions={
        <p className="inline-flex h-9 items-center gap-2 rounded-lg border border-line bg-panel px-3.5 text-[13.5px] font-medium text-ink">
          <CalendarDays aria-hidden className="size-4 text-accent-text" />
          <time dateTime={new Date(now).toISOString().slice(0, 10)}>{dateFmt.format(now)}</time>
        </p>
      }
    >
      <section aria-label="Today's counts" className="grid shrink-0 grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <article key={k.label} className="flex items-center gap-4 rounded-xl border border-line bg-panel p-4 shadow-e1 lg:px-5 lg:py-[clamp(12px,1.8vh,18px)]">
            <span className={cn('hidden size-10 shrink-0 place-items-center rounded-full sm:grid', KPI_STYLE[k.tone].icon)}>
              <k.icon aria-hidden strokeWidth={1.75} className="size-5" />
            </span>
            <div className="min-w-0">
              <h2 className="text-[13.5px] font-medium leading-5 text-ink-2">{k.label}</h2>
              <p className="tabular mt-1 text-[clamp(26px,2vw,30px)] font-bold leading-none text-ink">{k.value}</p>
              <p className="mt-1.5 text-[12.5px] leading-4 text-ink-3">{k.note}</p>
            </div>
          </article>
        ))}
      </section>

      <div className="grid gap-4 lg:min-h-[460px] lg:flex-1 lg:grid-cols-[minmax(0,1.65fr)_minmax(340px,1fr)]">
        {/* Analytics and today's logs */}
        <Panel label={DASHBOARD.analytics.title} fill>
          <PanelHeader title={DASHBOARD.analytics.title} meta={DASHBOARD.analytics.subtitle} />
          <div className="grid shrink-0 border-b border-line sm:grid-cols-[minmax(0,1fr)_200px]">
            <ul className="flex flex-col gap-3.5 px-5 py-4">
              <Row label={DASHBOARD.analytics.rows.collected.label} unit={DASHBOARD.analytics.rows.collected.unit} value={m.collected} share={share(m.collected)} tone="ok" />
              <Row label={DASHBOARD.analytics.rows.active.label} unit={DASHBOARD.analytics.rows.active.unit} value={m.active} share={share(m.active)} tone="warn" />
              <Row label={DASHBOARD.analytics.rows.missed.label} unit={DASHBOARD.analytics.rows.missed.unit} value={m.missed} share={share(m.missed)} tone="crit" />
            </ul>
            <div className="flex flex-col justify-center border-t border-line bg-muted px-5 py-4 sm:border-l sm:border-t-0">
              <p className="text-[14px] font-medium text-ink-2">Collection rate</p>
              <p className="tabular mt-1.5 text-[36px] font-bold leading-none text-ink">{formatPercent(m.efficiency)}</p>
              <p className="mt-2 text-[13px] leading-snug text-ink-3">{m.hasData ? `Completed of ${m.requests} logged today` : 'No logs recorded today'}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center justify-between px-5 pb-2 pt-3">
            <h3 className="text-[14px] font-semibold text-ink">Today's collection logs</h3>
            <Link to="/reports" className="inline-flex items-center gap-1 text-[14px] font-semibold text-accent-text hover:underline">
              All reports
              <ArrowUpRight aria-hidden className="size-4" />
            </Link>
          </div>
          {today.length === 0 ? (
            <EmptyState icon={<ClipboardList aria-hidden className="size-5" />} title="No collection logs today" body="Logs recorded today will be listed here." />
          ) : (
            <div className="max-h-[420px] min-h-0 overflow-auto lg:max-h-none lg:flex-1">
              <LogTable logs={today} now={now} />
            </div>
          )}
        </Panel>

        <div className="flex flex-col gap-4 lg:min-h-0">
          {/* Field units */}
          <Panel label="Field units" fill className="min-h-[300px] lg:min-h-[230px]">
            <PanelHeader
              title="Field units"
              meta={`${online} online, ${collectors.length - online} offline`}
              actions={
                <Link to="/tracking" className="inline-flex items-center gap-1 text-[14px] font-semibold text-accent-text hover:underline">
                  Live Tracker
                  <ArrowUpRight aria-hidden className="size-4" />
                </Link>
              }
            />
            <div className="relative min-h-[220px] flex-1 lg:min-h-0">
              <UnitMap collectors={collectors} interactive={false} className="absolute inset-0" />
            </div>
          </Panel>
        </div>
      </div>
    </Page>
  )
}

function Row({ label, unit, value, share, tone }: { label: string; unit: string; value: number; share: number; tone: Tone }) {
  return (
    <li>
      <div className="flex items-baseline justify-between gap-4 text-[14px]">
        <span className="flex items-center gap-2 font-medium text-ink">
          <span aria-hidden className={cn('size-2 rounded-full', toneDot(tone))} />
          {label}
        </span>
        <span className="tabular text-[13px] text-ink-3">
          <span className={cn('mr-1 text-[17px] font-bold', toneText(tone))}>{value}</span>
          {unit}
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-sunken" role="meter" aria-label={`${label} share of today's logs`} aria-valuenow={Math.round(share)} aria-valuemin={0} aria-valuemax={100}>
        <div className={cn('h-full rounded-full transition-[width] duration-500', toneDot(tone))} style={{ width: `${share}%` }} />
      </div>
    </li>
  )
}
