import type { ReactNode } from 'react'
import { FlaskConical } from 'lucide-react'
import type { LogStatus } from '@/types/domain'
import { cn } from '@/lib/cn'

export const LOG_STATUS_LABEL: Record<LogStatus, string> = { completed: 'Completed', pending: 'Pending', missed: 'Missed' }

const TONE = {
  ok: { text: 'text-ok-text', bg: 'bg-ok-soft ring-ok/25', dot: 'bg-ok' },
  warn: { text: 'text-warn-text', bg: 'bg-warn-soft ring-warn/30', dot: 'bg-warn' },
  crit: { text: 'text-crit-text', bg: 'bg-crit-soft ring-crit/25', dot: 'bg-crit' },
  neutral: { text: 'text-ink-2', bg: 'bg-maint-soft ring-line-strong', dot: 'bg-ink-3' },
} as const
export type Tone = keyof typeof TONE

export const LOG_TONE: Record<LogStatus, Tone> = { completed: 'ok', pending: 'warn', missed: 'crit' }

/** Status pill: dot + label, so meaning never relies on colour alone. */
export function StatusBadge({ tone, children, className }: { tone: Tone; children: ReactNode; className?: string }) {
  const t = TONE[tone]
  return (
    <span className={cn('inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-[12px] font-medium ring-1 ring-inset', t.bg, t.text, className)}>
      <span aria-hidden className={cn('size-1.5 rounded-full', t.dot)} />
      {children}
    </span>
  )
}

export function LogStatusBadge({ status }: { status: LogStatus }) {
  return <StatusBadge tone={LOG_TONE[status]}>{LOG_STATUS_LABEL[status]}</StatusBadge>
}

export function UnitStatusBadge({ online }: { online: boolean }) {
  return <StatusBadge tone={online ? 'ok' : 'neutral'}>{online ? 'Online' : 'Offline'}</StatusBadge>
}

export function toneDot(tone: Tone) {
  return TONE[tone].dot
}
export function toneText(tone: Tone) {
  return TONE[tone].text
}

/**
 * Marks records that come from the bundled demo dataset rather than a live
 * source. Shown wherever those records appear.
 */
export function DemoTag({ className, label = 'Demo data', tone = 'default' }: { className?: string; label?: string; tone?: 'default' | 'night' }) {
  return (
    <span
      title="These records come from the bundled demo dataset. No live municipal data source is connected."
      className={cn('inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-sm border border-dashed px-2 text-[12px] font-medium', tone === 'night' ? 'border-white/30 text-on-night-2' : 'border-line-strong bg-panel text-ink-2', className)}
    >
      <FlaskConical aria-hidden className={cn('size-3.5', tone === 'night' ? 'text-brand' : 'text-ink-3')} />
      {label}
    </span>
  )
}
