import type { CollectionLog, LogStatus } from '@/types/domain'
import { statusBreakdown } from '@/lib/metrics'
import { daysBefore, startOfDay, type SeriesRange } from '@/lib/series'

export { startOfDay }

export function logsToday(logs: CollectionLog[], now: number) {
  const from = startOfDay(now)
  return logs.filter((l) => l.createdAt >= from)
}

export type DateRange = SeriesRange

/** Logs from the start of the range's first calendar day (local time) onwards. */
export function inRange(logs: CollectionLog[], range: DateRange, now: number) {
  if (range === 'all') return logs
  if (range === 'today') return logsToday(logs, now)
  const from = daysBefore(now, (range === '7d' ? 7 : 30) - 1)
  return logs.filter((l) => l.createdAt >= from)
}

export function countByStatus(logs: CollectionLog[]): Record<LogStatus, number> {
  return statusBreakdown(logs).counts
}

/**
 * Dashboard figures, all derived from today's logs. The denominator for every
 * percentage is today's logs (all statuses). "Active" counts requests still
 * open (pending). Efficiency is the completed share; null when there are no
 * logs today, so the UI shows a dash rather than a misleading 0 %.
 */
export function dashboardMetrics(logs: CollectionLog[], now: number) {
  const b = statusBreakdown(logsToday(logs, now))
  return {
    requests: b.total,
    collected: b.counts.completed,
    missed: b.counts.missed,
    active: b.counts.pending,
    /** Whole percentages of today's logs, summing to 100; null with no logs. */
    percents: b.percents,
    efficiency: b.percents?.completed ?? null,
    hasData: b.total > 0,
  }
}
