import type { CollectionLog, LogStatus } from '@/types/domain'

const DAY = 86_400_000

export function startOfDay(ts: number) {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export function logsToday(logs: CollectionLog[], now: number) {
  const from = startOfDay(now)
  return logs.filter((l) => l.createdAt >= from)
}

export type DateRange = 'today' | '7d' | '30d' | 'all'

export function inRange(logs: CollectionLog[], range: DateRange, now: number) {
  if (range === 'all') return logs
  if (range === 'today') return logsToday(logs, now)
  const days = range === '7d' ? 7 : 30
  const from = startOfDay(now) - (days - 1) * DAY
  return logs.filter((l) => l.createdAt >= from)
}

export function countByStatus(logs: CollectionLog[]): Record<LogStatus, number> {
  const out: Record<LogStatus, number> = { completed: 0, pending: 0, missed: 0 }
  for (const l of logs) out[l.status]++
  return out
}

/**
 * Dashboard figures, all derived from today's logs. "Active" counts requests
 * still open (pending). Efficiency is completed / total, 0 when there is no data.
 */
export function dashboardMetrics(logs: CollectionLog[], now: number) {
  const today = logsToday(logs, now)
  const c = countByStatus(today)
  const total = today.length
  return {
    requests: total,
    collected: c.completed,
    missed: c.missed,
    active: c.pending,
    efficiency: total > 0 ? Math.round((c.completed / total) * 100) : 0,
    hasData: total > 0,
  }
}
