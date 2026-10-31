/**
 * Shift timing maths: validation, duration and whether the current time falls
 * inside the configured shift window. The rules match setShiftTiming: both
 * times are 24-hour "HH:MM" and must differ. An end earlier than the start is
 * an overnight shift (for example 22:00 to 06:00), which is allowed.
 *
 * Kept free of runtime imports so `node --test` can run it directly.
 */
import type { ShiftTiming } from '@/types/domain'

export const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/
const DAY_MIN = 24 * 60

/** Minutes after midnight, or null for anything that isn't a valid "HH:MM". */
export function toMinutes(hhmm: string): number | null {
  if (!TIME_PATTERN.test(hhmm)) return null
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export type ShiftProblem = 'format' | 'same'

/** Why a shift can't be saved, or null when it can. */
export function shiftProblem(shift: ShiftTiming): ShiftProblem | null {
  if (toMinutes(shift.start) === null || toMinutes(shift.end) === null) return 'format'
  if (shift.start === shift.end) return 'same'
  return null
}

/** Shift length in minutes (overnight-aware), or null when the timing is invalid. */
export function shiftDuration(shift: ShiftTiming): number | null {
  if (shiftProblem(shift)) return null
  return (toMinutes(shift.end)! - toMinutes(shift.start)! + DAY_MIN) % DAY_MIN
}

/** True when the shift ends on the following day. */
export function isOvernight(shift: ShiftTiming): boolean {
  return !shiftProblem(shift) && toMinutes(shift.end)! < toMinutes(shift.start)!
}

export type ShiftWindow = { state: 'invalid' } | { state: 'within'; endsIn: number } | { state: 'outside'; startsIn: number }

/**
 * Where the given local time sits relative to the configured shift hours.
 * This is derived from the clock and the saved timing only; it says nothing
 * about whether any crew has actually started work.
 */
export function shiftWindow(shift: ShiftTiming, now: Date | number): ShiftWindow {
  const length = shiftDuration(shift)
  if (length === null) return { state: 'invalid' }
  const d = new Date(now)
  const minute = d.getHours() * 60 + d.getMinutes()
  const sinceStart = (minute - toMinutes(shift.start)! + DAY_MIN) % DAY_MIN
  return sinceStart < length ? { state: 'within', endsIn: length - sinceStart } : { state: 'outside', startsIn: DAY_MIN - sinceStart }
}

/** "12 h", "8 h 30 min", "45 min". */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m} min`
  return m === 0 ? `${h} h` : `${h} h ${m} min`
}

/** "06:00 AM" from "06:00"; the input is returned unchanged if it isn't valid. */
export function format12(hhmm: string): string {
  const total = toMinutes(hhmm)
  if (total === null) return hhmm
  const h = Math.floor(total / 60)
  const m = total % 60
  return `${String(((h + 11) % 12) + 1).padStart(2, '0')}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}
