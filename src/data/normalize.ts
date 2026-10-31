/**
 * Adapters from untrusted records (browser storage today, an API response
 * later) to the domain types the UI renders. Records that can't be trusted
 * are dropped and counted, never patched with invented values.
 *
 * Accepted input per log:      { id, address, sector, status, createdAt }
 * Accepted input per collector: { id, name, phone, registeredAt, online?, position? }
 * Timestamps may be epoch milliseconds or ISO 8601 strings.
 *
 * Kept free of runtime imports so `node --test` can run it directly.
 */
import type { CollectionLog, Collector, LatLng, LogStatus } from '@/types/domain'

export interface NormalizeReport {
  /** Records kept. */
  accepted: number
  /** Records dropped because a required field was missing or invalid. */
  rejected: number
  /** Records dropped because a later record had the same id. */
  duplicates: number
}

const STATUSES: ReadonlySet<string> = new Set<LogStatus>(['completed', 'pending', 'missed'])
const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)
const text = (v: unknown): string | null => (typeof v === 'string' && v.trim() !== '' ? v.trim() : null)

/** Epoch ms from a number or an ISO string; null when it isn't a real time. */
export function toTimestamp(v: unknown): number | null {
  const ts = typeof v === 'number' ? v : typeof v === 'string' && v.trim() !== '' ? Date.parse(v) : NaN
  return Number.isFinite(ts) ? ts : null
}

function toPosition(v: unknown): LatLng | null {
  if (!isRecord(v)) return null
  const { lat, lng } = v
  if (typeof lat !== 'number' || typeof lng !== 'number' || !Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return Math.abs(lat) <= 90 && Math.abs(lng) <= 180 ? { lat, lng } : null
}

/** Keeps the last record for each id (a later record is treated as the update). */
function dedupe<T extends { id: string }>(items: T[]): { items: T[]; duplicates: number } {
  const byId = new Map<string, T>()
  for (const item of items) byId.set(item.id, item)
  return { items: [...byId.values()], duplicates: items.length - byId.size }
}

export function normalizeLogs(raw: unknown): { logs: CollectionLog[]; report: NormalizeReport } {
  const list = Array.isArray(raw) ? raw : []
  const kept: CollectionLog[] = []
  for (const r of list) {
    if (!isRecord(r)) continue
    const id = text(r.id)
    const createdAt = toTimestamp(r.createdAt)
    if (!id || createdAt === null || typeof r.status !== 'string' || !STATUSES.has(r.status)) continue
    kept.push({ id, address: text(r.address) ?? '', sector: text(r.sector) ?? 'Unassigned', status: r.status as LogStatus, createdAt })
  }
  const { items, duplicates } = dedupe(kept)
  return { logs: items, report: { accepted: items.length, rejected: list.length - kept.length, duplicates } }
}

export function normalizeCollectors(raw: unknown): { collectors: Collector[]; report: NormalizeReport } {
  const list = Array.isArray(raw) ? raw : []
  const kept: Collector[] = []
  for (const r of list) {
    if (!isRecord(r)) continue
    const id = text(r.id)
    const name = text(r.name)
    const registeredAt = toTimestamp(r.registeredAt)
    if (!id || !name || registeredAt === null) continue
    kept.push({
      id,
      name,
      phone: text(r.phone) ?? '',
      registeredAt,
      // Only an explicit true counts as online; a missing flag is not a report of activity.
      online: r.online === true,
      position: toPosition(r.position),
    })
  }
  const { items, duplicates } = dedupe(kept)
  return { collectors: items, report: { accepted: items.length, rejected: list.length - kept.length, duplicates } }
}
