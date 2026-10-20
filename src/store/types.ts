import type { CollectionLog, Collector, ShiftTiming } from '@/types/domain'

/** Everything the console persists. It starts empty: no records are seeded. */
export interface AppData {
  version: number
  collectors: Collector[]
  logs: CollectionLog[]
  shift: ShiftTiming
  /** IDs of recent alerts the user has cleared. */
  clearedAlerts: string[]
}

export type CommandOutcome<T = void> = { ok: true; data: AppData; value: T } | { ok: false; error: string }
export type CommandResult<T = void> = { ok: true; value: T } | { ok: false; error: string }
