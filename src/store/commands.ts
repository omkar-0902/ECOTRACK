import type { Collector, ShiftTiming } from '@/types/domain'
import { shiftProblem } from '@/lib/shift'
import type { AppData, CommandOutcome } from './types'

const ok = <T>(data: AppData, value: T): CommandOutcome<T> => ({ ok: true, data, value })
const fail = (error: string): CommandOutcome<never> => ({ ok: false, error })

/** ECO-C-#### — the credential format used by the original product. Unique within this dataset. */
function generateCollectorId(existing: Collector[]): string | null {
  const taken = new Set(existing.map((c) => c.id))
  const buf = new Uint32Array(1)
  for (let i = 0; i < 50; i++) {
    crypto.getRandomValues(buf)
    const id = `ECO-C-${String(1000 + (buf[0] % 9000))}`
    if (!taken.has(id)) return id
  }
  return null
}

export function addCollector(data: AppData, input: { name: string; phone: string }, now: number): CommandOutcome<Collector> {
  const name = input.name.trim()
  const phone = input.phone.replace(/[\s-]/g, '')
  if (name.length < 2) return fail('Enter the collector’s full name.')
  if (!/^\+?\d{10,15}$/.test(phone)) return fail('Enter a phone number of 10 to 15 digits.')
  if (data.collectors.some((c) => c.phone === phone)) return fail('A collector with this phone number is already registered.')
  const id = generateCollectorId(data.collectors)
  if (!id) return fail('Could not generate a unique ECO-ID. Try again.')
  const collector: Collector = { id, name, phone, registeredAt: now, online: false, position: null }
  return ok({ ...data, collectors: [collector, ...data.collectors] }, collector)
}

/** Both times "HH:MM" and different; an end before the start is an overnight shift. */
export function setShiftTiming(data: AppData, shift: ShiftTiming): CommandOutcome<void> {
  const problem = shiftProblem(shift)
  if (problem === 'format') return fail('Enter both times as hours and minutes.')
  if (problem === 'same') return fail('Deployment start and operations cease must be different times.')
  return ok({ ...data, shift: { ...shift } }, undefined)
}

export function clearAlerts(data: AppData, ids: string[]): CommandOutcome<void> {
  return ok({ ...data, clearedAlerts: [...new Set([...data.clearedAlerts, ...ids])] }, undefined)
}
