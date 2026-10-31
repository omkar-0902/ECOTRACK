/**
 * Derived metrics for the console: shares, percentages and status breakdowns.
 * Every figure the UI shows as a percentage comes from here, so one set of
 * rules covers division by zero, rounding and "unknown" versus a real 0 %.
 *
 * Kept free of runtime imports so `node --test` can run it directly.
 */
import type { CollectionLog, LogStatus } from '@/types/domain'

/** The log statuses, in the order the UI lists them. */
export const LOG_STATUSES: readonly LogStatus[] = ['completed', 'pending', 'missed']

const valid = (n: number) => Number.isFinite(n) && n >= 0

/**
 * part / total as a fraction between 0 and 1, or null when the share is
 * undefined: no total, or an invalid (negative, NaN, infinite) input.
 * Null means "unknown"; callers show a dash, never 0 %.
 */
export function share(part: number, total: number): number | null {
  if (!valid(part) || !valid(total) || total === 0) return null
  return Math.min(1, part / total)
}

/** Whole-number percentage of part in total, or null when unknown. */
export function percent(part: number, total: number): number | null {
  const s = share(part, total)
  return s === null ? null : Math.round(s * 100)
}

/**
 * Whole percentages for parts of one total that always add up to exactly 100
 * (largest-remainder method), so a legend never reads 99 % or 101 %. The
 * total is the sum of the parts. Returns null when there is nothing to divide.
 */
export function percentParts(counts: readonly number[]): number[] | null {
  if (counts.length === 0 || !counts.every(valid)) return null
  const total = counts.reduce((a, b) => a + b, 0)
  if (total === 0) return null
  const raw = counts.map((c) => (c / total) * 100)
  const out = raw.map(Math.floor)
  let left = 100 - out.reduce((a, b) => a + b, 0)
  const order = raw.map((r, i) => ({ i, frac: r - Math.floor(r) })).sort((a, b) => b.frac - a.frac || a.i - b.i)
  for (const { i } of order) {
    if (left <= 0) break
    out[i]++
    left--
  }
  return out
}

/** "62%", or the fallback (an en dash) when the value is unknown. */
export function formatPercent(value: number | null, fallback = '–'): string {
  return value === null ? fallback : `${value}%`
}

export interface StatusBreakdown {
  /** Number of logs counted. All statuses are eligible: the denominator is every log in the set. */
  total: number
  counts: Record<LogStatus, number>
  /** Whole percentages that sum to 100, or null when there are no logs. */
  percents: Record<LogStatus, number> | null
}

/** Counts and percentages by status for one set of logs. */
export function statusBreakdown(logs: readonly CollectionLog[]): StatusBreakdown {
  const counts: Record<LogStatus, number> = { completed: 0, pending: 0, missed: 0 }
  for (const l of logs) if (l.status in counts) counts[l.status]++
  const total = counts.completed + counts.pending + counts.missed
  const parts = percentParts(LOG_STATUSES.map((s) => counts[s]))
  return {
    total,
    counts,
    percents: parts ? { completed: parts[0], pending: parts[1], missed: parts[2] } : null,
  }
}
