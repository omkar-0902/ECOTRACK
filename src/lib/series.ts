/**
 * Chart datasets built from collection logs: counts per hour (today) or per
 * day, stacked by status. Buckets with no logs are real zeros (the period is
 * covered, nothing was logged); the chart's empty state handles "no logs".
 *
 * Kept free of runtime imports so `node --test` can run it directly.
 */
import type { CollectionLog, LogStatus } from '@/types/domain'

export type SeriesRange = 'today' | '7d' | '30d' | 'all'

export type StatusBucket = Record<LogStatus, number> & { key: number; label: string }

/** Local midnight of the day containing ts. */
export function startOfDay(ts: number): number {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

/** Local midnight `days` calendar days before ts; safe across daylight-saving changes. */
export function daysBefore(ts: number, days: number): number {
  const d = new Date(startOfDay(ts))
  d.setDate(d.getDate() - days)
  return d.getTime()
}

const dayLabel = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })

/** The earliest log timestamp, without spreading a large array into Math.min. */
function earliest(logs: readonly CollectionLog[], fallback: number): number {
  let min = fallback
  for (const l of logs) if (l.createdAt < min) min = l.createdAt
  return min
}

/**
 * One bucket per hour of today up to now, or one per calendar day of the
 * range. Logs outside the buckets (for example, timestamps later than now)
 * are left out rather than guessed into a neighbouring bucket.
 */
export function statusSeries(logs: readonly CollectionLog[], range: SeriesRange, now: number): StatusBucket[] {
  const buckets = new Map<number, StatusBucket>()
  const empty = (key: number, label: string): StatusBucket => ({ key, label, completed: 0, pending: 0, missed: 0 })

  if (range === 'today') {
    const midnight = startOfDay(now)
    for (let h = 0; h <= new Date(now).getHours(); h++) buckets.set(h, empty(h, `${String(h).padStart(2, '0')}:00`))
    for (const l of logs) {
      if (startOfDay(l.createdAt) !== midnight) continue
      const b = buckets.get(new Date(l.createdAt).getHours())
      if (b) b[l.status]++
    }
  } else {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : Math.round((startOfDay(now) - startOfDay(earliest(logs, now))) / 86_400_000) + 1
    for (let i = days - 1; i >= 0; i--) {
      const key = daysBefore(now, i)
      buckets.set(key, empty(key, dayLabel.format(key)))
    }
    for (const l of logs) {
      const b = buckets.get(startOfDay(l.createdAt))
      if (b) b[l.status]++
    }
  }
  return [...buckets.values()].sort((a, b) => a.key - b.key)
}
