import { useData } from '@/store/StoreProvider'
import { useNow } from '@/hooks/useNow'
import { formatDuration, shiftWindow, type ShiftWindow } from '@/lib/shift'

/** Saved shift plus where the current time sits in it. Re-evaluated every minute. */
export function useShiftWindow() {
  const shift = useData((d) => d.shift)
  const now = useNow(60_000)
  return { shift, window: shiftWindow(shift, now) }
}

/** "In shift hours" / "Outside shift hours", with the time to the next change when `detail` is set. */
export function shiftWindowText(w: ShiftWindow, detail = false): string {
  if (w.state === 'invalid') return 'Shift timing needs attention'
  if (w.state === 'within') return detail ? `In shift hours, ends in ${formatDuration(w.endsIn)}` : 'In shift hours'
  return detail ? `Outside shift hours, starts in ${formatDuration(w.startsIn)}` : 'Outside shift hours'
}
