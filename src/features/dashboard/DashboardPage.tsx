import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowUpRight, CalendarDays, CheckCircle2, CircleX, ClipboardList, Clock3, type LucideIcon } from 'lucide-react'
import { useAppStore, useData } from '@/store/StoreProvider'
import { dashboardMetrics, logsToday } from '@/store/selectors'
import { setShiftTiming } from '@/store/commands'
import { useNow } from '@/hooks/useNow'
import { EmptyState, Page, Panel, PanelHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/feedback/Toaster'
import { toneDot, toneText, type Tone } from '@/components/ui/Status'
import { LogTable } from '@/features/views/OpsViews'
import { UnitMap } from '@/features/views/UnitMap'
import { DASHBOARD } from '@/content/original'
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
  const share = (n: number) => (m.requests > 0 ? (n / m.requests) * 100 : 0)
  const pct = (n: number) => (m.hasData ? `${Math.round(share(n))}% of today's logs` : 'No logs recorded today')

  const kpis: { label: string; value: number; note: string; tone: Tone | 'accent'; icon: LucideIcon }[] = [
    { label: DASHBOARD.kpis.requests.label, value: m.requests, note: 'Logged since midnight', tone: 'accent', icon: ClipboardList },
    { label: DASHBOARD.kpis.collected.label, value: m.collected, note: pct(m.collected), tone: 'ok', icon: CheckCircle2 },
    { label: DASHBOARD.kpis.missed.label, value: m.missed, note: pct(m.missed), tone: 'crit', icon: CircleX },
    { label: DASHBOARD.kpis.active.label, value: m.active, note: 'Pending collection', tone: 'warn', icon: Clock3 },
  ]

  return (
    <Page
      title={DASHBOARD.title}
      subtitle={DASHBOARD.subtitle}
      actions={
        <p className="inline-flex h-10 items-center gap-2.5 rounded-lg border border-line-strong bg-panel px-4 text-[14px] font-medium text-ink">
          <CalendarDays aria-hidden className="size-4 text-accent-text" />
          <time dateTime={new Date(now).toISOString().slice(0, 10)}>{dateFmt.format(now)}</time>
        </p>
      }
    >
      <section aria-label="Today's counts" className="grid shrink-0 grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {kpis.map((k) => (
          <article key={k.label} className="flex items-start gap-4 rounded-lg border border-line bg-panel p-4 shadow-e1 sm:p-5 lg:py-[clamp(14px,2.2vh,20px)]">
            <span className={cn('hidden size-11 shrink-0 place-items-center rounded-full sm:grid', KPI_STYLE[k.tone].icon)}>
              <k.icon aria-hidden strokeWidth={1.75} className="size-5" />
            </span>
            <div className="min-w-0">
              <h2 className="text-[14px] font-medium leading-5 text-ink-2">{k.label}</h2>
              <p className="tabular mt-1.5 text-[clamp(28px,2.4vw,34px)] font-bold leading-none text-ink">{k.value}</p>
              <p className="mt-2 text-[13px] leading-4 text-ink-3">{k.note}</p>
            </div>
          </article>
        ))}
      </section>

      <div className="grid gap-5 lg:min-h-[480px] lg:flex-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(340px,1fr)] lg:gap-6">
        {/* Analytics and today's logs */}
        <Panel label={DASHBOARD.analytics.title} fill>
          <PanelHeader title={DASHBOARD.analytics.title} meta={DASHBOARD.analytics.subtitle} />
          <div className="grid shrink-0 border-b border-line sm:grid-cols-[minmax(0,1fr)_220px]">
            <ul className="flex flex-col gap-4 px-6 py-5">
              <Row label={DASHBOARD.analytics.rows.collected.label} unit={DASHBOARD.analytics.rows.collected.unit} value={m.collected} share={share(m.collected)} tone="ok" />
              <Row label={DASHBOARD.analytics.rows.active.label} unit={DASHBOARD.analytics.rows.active.unit} value={m.active} share={share(m.active)} tone="warn" />
              <Row label={DASHBOARD.analytics.rows.missed.label} unit={DASHBOARD.analytics.rows.missed.unit} value={m.missed} share={share(m.missed)} tone="crit" />
            </ul>
            <div className="flex flex-col justify-center border-t border-line bg-muted px-6 py-5 sm:border-l sm:border-t-0">
              <p className="text-[14px] font-medium text-ink-2">Collection rate</p>
              <p className="tabular mt-2 text-[40px] font-bold leading-none text-ink">{m.hasData ? `${m.efficiency}%` : '–'}</p>
              <p className="mt-2 text-[13px] leading-snug text-ink-3">{m.hasData ? `Completed of ${m.requests} logged today` : 'No logs recorded today'}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center justify-between px-6 pb-2 pt-4">
            <h3 className="text-[15px] font-bold text-ink">Today's collection logs</h3>
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

        <div className="flex flex-col gap-5 lg:min-h-0 lg:gap-6">
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
          <ShiftTiming />
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

function ShiftTiming() {
  const store = useAppStore()
  const toast = useToast()
  const saved = useData((d) => d.shift)
  const [draft, setDraft] = useState(saved)
  const dirty = draft.start !== saved.start || draft.end !== saved.end

  const commit = () => {
    const res = store.run((d) => setShiftTiming(d, draft))
    if (res.ok) toast.success('Shift timing committed', `Deployment ${fmt12(draft.start)}, operations cease ${fmt12(draft.end)}.`)
    else toast.error('Shift timing not saved', res.error)
  }

  return (
    <Panel label={DASHBOARD.shift.title} className="shrink-0">
      <PanelHeader
        title={DASHBOARD.shift.title}
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={() => setDraft(saved)} disabled={!dirty}>
              {DASHBOARD.shift.reset}
            </Button>
            <Button variant="primary" size="sm" onClick={commit} disabled={!dirty}>
              {DASHBOARD.shift.commit}
            </Button>
          </>
        }
      />
      <div className="grid grid-cols-1 gap-x-4 gap-y-3 px-6 py-[clamp(12px,2vh,20px)] sm:grid-cols-2">
        <TimeField id="deploy" label={DASHBOARD.shift.start.label} hint={DASHBOARD.shift.start.hint} value={draft.start} onChange={(v) => setDraft((d) => ({ ...d, start: v }))} />
        <TimeField id="cease" label={DASHBOARD.shift.end.label} hint={DASHBOARD.shift.end.hint} value={draft.end} onChange={(v) => setDraft((d) => ({ ...d, end: v }))} />
        <p role="status" className={cn('text-[13px] sm:col-span-2', dirty ? 'font-semibold text-warn-text' : 'text-ink-3')}>
          {dirty ? 'Unsaved changes' : `Saved: ${fmt12(saved.start)} to ${fmt12(saved.end)}`}
        </p>
      </div>
    </Panel>
  )
}

function TimeField({ id, label, hint, value, onChange }: { id: string; label: string; hint: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="text-[14px] font-semibold text-ink">
        {label}
      </label>
      <input
        id={id}
        type="time"
        required
        aria-describedby={`${id}-hint`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="tabular h-11 w-full rounded-lg border border-line-strong bg-panel px-3 text-[16px] font-medium text-ink transition-colors hover:border-ink-3 focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent-soft"
      />
      <p id={`${id}-hint`} className="text-[12px] leading-4 text-ink-3">
        {hint}
      </p>
    </div>
  )
}

function fmt12(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  return `${String(((h + 11) % 12) + 1).padStart(2, '0')}:${String(m).padStart(2, '0')} ${suffix}`
}
