/**
 * Data views shared by the authenticated console and the public Preview page.
 * They render whatever records the store holds — nothing here is hard-coded —
 * so the preview shows the actual product, not a picture of it.
 */
import type { CollectionLog, Collector } from '@/types/domain'
import { dashboardMetrics } from '@/store/selectors'
import { formatPercent } from '@/lib/metrics'
import { Avatar } from '@/components/ui/Avatar'
import { LogStatusBadge, UnitStatusBadge, toneDot, type Tone } from '@/components/ui/Status'
import { DASHBOARD, COLLECTORS } from '@/content/original'
import { cn } from '@/lib/cn'

// ---------------------------------------------------------------- metrics

type Metric = { key: keyof typeof DASHBOARD.kpis; value: number; tone: Tone | 'accent' }

/** Today's four operational counts, all derived from collection logs. */
export function MetricStrip({ logs, now, compact }: { logs: CollectionLog[]; now: number; compact?: boolean }) {
  const m = dashboardMetrics(logs, now)
  const items: Metric[] = [
    { key: 'requests', value: m.requests, tone: 'accent' },
    { key: 'collected', value: m.collected, tone: 'ok' },
    { key: 'missed', value: m.missed, tone: 'crit' },
    { key: 'active', value: m.active, tone: 'warn' },
  ]
  return (
    <dl className="grid grid-cols-2 sm:grid-cols-4">
      {items.map((k, i) => {
        const meta = DASHBOARD.kpis[k.key]
        return (
          <div
            key={k.key}
            className={cn(
              'flex min-w-0 flex-col border-line',
              compact ? 'gap-1.5 px-3 py-[clamp(8px,1.4vh,12px)] sm:px-4' : 'gap-2 px-5 py-4',
              i % 2 === 1 && 'border-l',
              i >= 2 && 'border-t sm:border-t-0',
              i === 2 && 'sm:border-l',
            )}
          >
            <dt title={meta.label} className={cn('flex items-center gap-2 text-ink-2', compact ? 'text-[12px]' : 'text-[13px]')}>
              {/* In compact strips the status bar beneath carries the colour key */}
              {!compact && <span aria-hidden className={cn('size-1.5 rounded-full', k.tone === 'accent' ? 'bg-ink-3' : toneDot(k.tone))} />}
              <span className="truncate">{meta.label}</span>
            </dt>
            <dd className={cn('tabular font-semibold leading-none text-ink', compact ? 'text-[24px]' : 'text-[32px]')}>{k.value}</dd>
          </div>
        )
      })}
    </dl>
  )
}

/** Share of today's logs by status, as one segmented bar with a legend. */
export function StatusMix({ logs, now }: { logs: CollectionLog[]; now: number }) {
  const m = dashboardMetrics(logs, now)
  const parts: { label: string; value: number; pct: number | null; tone: Tone }[] = [
    { label: 'Completed', value: m.collected, pct: m.percents?.completed ?? null, tone: 'ok' },
    { label: 'Pending', value: m.active, pct: m.percents?.pending ?? null, tone: 'warn' },
    { label: 'Missed', value: m.missed, pct: m.percents?.missed ?? null, tone: 'crit' },
  ]
  const total = m.requests
  return (
    <div>
      <div className="flex h-2 w-full gap-[2px] overflow-hidden rounded-full bg-sunken" role="img" aria-label={total ? parts.map((p) => `${p.label} ${p.value}`).join(', ') : 'No logs today'}>
        {total > 0 && parts.map((p) => (p.value > 0 ? <span key={p.label} className={cn('h-full', toneDot(p.tone))} style={{ width: `${(p.value / total) * 100}%` }} /> : null))}
      </div>
      <ul className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1 text-[12.5px] text-ink-2">
        {parts.map((p) => (
          <li key={p.label} className="inline-flex items-center gap-1.5">
            <span aria-hidden className={cn('size-2 rounded-[2px]', toneDot(p.tone))} />
            {p.label}
            <span className="tabular text-ink">{formatPercent(p.pct)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ---------------------------------------------------------------- tables

const time = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
const dayTime = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })

export function LogTable({ logs, now, showDate, className }: { logs: CollectionLog[]; now: number; showDate?: boolean; className?: string }) {
  const today = new Date(now).toDateString()
  const when = (ts: number) => (showDate || new Date(ts).toDateString() !== today ? dayTime.format(ts) : time.format(ts))
  return (
    <>
    <ul className={cn('divide-y divide-line sm:hidden', className)}>
      {logs.map((l) => (
        <li key={l.id} className="flex items-start justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="data-mono text-[13px] font-medium text-ink">{l.id}</p>
            <p className="mt-0.5 truncate text-[14px] text-ink-2">{l.address}</p>
            <p className="tabular mt-0.5 text-[13px] text-ink-3">
              {l.sector}, {when(l.createdAt)}
            </p>
          </div>
          <LogStatusBadge status={l.status} />
        </li>
      ))}
    </ul>
    <table className={cn('hidden w-full min-w-[560px] text-left text-[14px] sm:table', className)}>
      <thead className="sticky top-0 z-10 bg-muted text-[11.5px] uppercase tracking-[0.06em] text-ink-3 shadow-[inset_0_-1px_0_var(--et-line)]">
        <tr>
          <th scope="col" className="py-2.5 pl-5 pr-3 font-semibold">Log ID</th>
          <th scope="col" className="px-3 py-2.5 font-semibold">Address</th>
          <th scope="col" className="px-3 py-2.5 font-semibold">Sector</th>
          <th scope="col" className="px-3 py-2.5 font-semibold">Status</th>
          <th scope="col" className="py-2.5 pl-3 pr-5 text-right font-semibold">Logged</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((l) => (
          <tr key={l.id} className="border-b border-line transition-colors last:border-b-0 hover:bg-hover">
            <td className="data-mono whitespace-nowrap py-2.5 pl-5 pr-3 text-[13px] font-medium text-ink">{l.id}</td>
            <td className="max-w-[300px] truncate px-3 py-2.5 text-ink-2">{l.address}</td>
            <td className="whitespace-nowrap px-3 py-2.5 text-ink-2">{l.sector}</td>
            <td className="px-3 py-2">
              <LogStatusBadge status={l.status} />
            </td>
            <td className="data-mono whitespace-nowrap py-2.5 pl-3 pr-5 text-right text-[12.5px] text-ink-3">{when(l.createdAt)}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </>
  )
}

export function CollectorTable({ collectors, selectedId, onSelect, className }: { collectors: Collector[]; selectedId?: string | null; onSelect?: (id: string) => void; className?: string }) {
  return (
    <>
    <ul className={cn('divide-y divide-line sm:hidden', className)}>
      {collectors.map((c) => (
        <li key={c.id}>
          <button
            type="button"
            disabled={!onSelect}
            onClick={onSelect ? () => onSelect(c.id) : undefined}
            aria-pressed={onSelect ? selectedId === c.id : undefined}
            className={cn('flex w-full items-center gap-3 px-4 py-3 text-left disabled:cursor-default', selectedId === c.id && 'bg-accent-soft')}
          >
            <Avatar name={c.name} size="sm" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[15px] font-semibold text-ink">{c.name}</span>
              <span className="block text-[13px] text-ink-3">
                <span className="data-mono">{c.id}</span>, <span className="tabular">{c.phone}</span>
              </span>
            </span>
            <UnitStatusBadge online={c.online} />
          </button>
        </li>
      ))}
    </ul>
    <table className={cn('hidden w-full min-w-[520px] text-left text-[14px] sm:table', className)}>
      <thead className="sticky top-0 z-10 bg-muted text-[11.5px] uppercase tracking-[0.06em] text-ink-3 shadow-[inset_0_-1px_0_var(--et-line)]">
        <tr>
          <th scope="col" className="py-2.5 pl-5 pr-3 font-semibold">{COLLECTORS.columns.info}</th>
          <th scope="col" className="px-3 py-2.5 font-semibold">{COLLECTORS.columns.id}</th>
          <th scope="col" className="px-3 py-2.5 font-semibold">Status</th>
          <th scope="col" className="py-2.5 pl-3 pr-5 text-right font-semibold">{COLLECTORS.columns.phone}</th>
        </tr>
      </thead>
      <tbody>
        {collectors.map((c) => {
          const active = selectedId === c.id
          return (
            <tr
              key={c.id}
              onClick={onSelect ? () => onSelect(c.id) : undefined}
              aria-selected={onSelect ? active : undefined}
              className={cn('border-b border-line transition-colors last:border-b-0', onSelect && 'cursor-pointer', active ? 'bg-accent-soft' : 'hover:bg-hover')}
            >
              <td className="py-2 pl-5 pr-3">
                <span className="flex items-center gap-3">
                  <Avatar name={c.name} size="sm" />
                  {onSelect ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelect(c.id)
                      }}
                      className="truncate text-left font-semibold text-ink hover:text-accent-text"
                    >
                      {c.name}
                    </button>
                  ) : (
                    <span className="truncate font-semibold text-ink">{c.name}</span>
                  )}
                </span>
              </td>
              <td className="data-mono px-3 py-2 text-[13px] text-ink-2">{c.id}</td>
              <td className="px-3 py-2">
                <UnitStatusBadge online={c.online} />
              </td>
              <td className="tabular py-2 pl-3 pr-5 text-right text-ink-2">{c.phone}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
    </>
  )
}
