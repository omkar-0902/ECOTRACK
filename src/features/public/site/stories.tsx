/**
 * Visual stories for the homepage: the street-level problem, the real console
 * at full size, and the two planned phone experiences.
 */
import { lazy, Suspense } from 'react'
import { motion } from 'motion/react'
import { Check, Clock3, House, X } from 'lucide-react'
import { useData } from '@/store/StoreProvider'
import { logsToday } from '@/store/selectors'
import { BrandMark } from '@/components/layout/Brand'
import { DemoTag, LogStatusBadge } from '@/components/ui/Status'
import { cn } from '@/lib/cn'
import { CREW_LABEL, CrewAppScreen, Phone, RESIDENT_LABEL, ResidentAppScreen } from './showcase'
import { Counts, useReportingDay } from './visuals'

const UnitMap = lazy(() => import('@/features/views/UnitMap').then((m) => ({ default: m.UnitMap })))

/* ------------------------------------------------------------ the street */

type Mark = 'unknown' | 'done' | 'pending' | 'missed'
// One street, two rows of homes. The same street, with and without a record.
const STREET: Mark[][] = [
  ['done', 'done', 'pending', 'done', 'missed', 'done'],
  ['done', 'missed', 'done', 'done', 'pending', 'done'],
]

const BADGE: Record<Mark, { cls: string; icon: React.ReactNode }> = {
  unknown: { cls: 'bg-[var(--pub-unknown)] text-white', icon: <span className="text-[11px] font-bold leading-none">?</span> },
  done: { cls: 'bg-[#2e8a3a] text-white', icon: <Check strokeWidth={3} className="size-3" /> },
  pending: { cls: 'bg-[#c7850b] text-white', icon: <Clock3 strokeWidth={2.5} className="size-3" /> },
  missed: { cls: 'bg-[#c63a32] text-white', icon: <X strokeWidth={3} className="size-3" /> },
}

const MARK_LABEL: Record<Mark, string> = { unknown: 'Unknown', done: 'Collected', pending: 'Pending', missed: 'Missed' }

function HomeTile({ mark, order }: { mark: Mark; order?: number }) {
  const known = mark !== 'unknown'
  return (
    <motion.span
      title={MARK_LABEL[mark]}
      initial={order === undefined ? false : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.35, delay: (order ?? 0) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className={cn('relative grid aspect-square place-items-center rounded-xl transition-transform duration-200', known && 'hover:-translate-y-0.5', mark === 'unknown' ? 'bg-[var(--pub-paper)] text-[var(--pub-unknown)] opacity-80' : 'bg-[var(--pub-paper)] text-[var(--pub-paper-ink)] shadow-[0_1px_2px_rgb(0_0_0/0.08)]', mark === 'missed' && 'ring-2 ring-[#c63a32]/50')}>
      <House strokeWidth={1.6} className="size-[46%]" />
      <span className={cn('absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full ring-2 ring-[var(--pub-paper)]', BADGE[mark].cls)}>{BADGE[mark].icon}</span>
    </motion.span>
  )
}

function Street({ known }: { known: boolean }) {
  return (
    <div className="flex flex-col gap-3">
      {STREET.map((row, r) => (
        <div key={r} className="contents">
          <div className="grid grid-cols-6 gap-[clamp(8px,1.2vw,16px)]">
            {row.map((m, i) => (
              <HomeTile key={i} mark={known ? m : 'unknown'} order={known ? r * row.length + i : undefined} />
            ))}
          </div>
          {r === 0 && (
            <div aria-hidden className="relative h-6 rounded-md bg-[var(--pub-road)]">
              <span className="absolute inset-x-3 top-1/2 border-t-2 border-dashed border-white" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/** The same street twice: no record at all, then every home accounted for. Illustration. */
export function StreetRecord() {
  return (
    <figure className="grid gap-5 lg:grid-cols-2 lg:gap-8">
      <div className="rounded-3xl bg-[var(--pub-shade)] p-[clamp(20px,2.4vw,40px)]">
        <p className="mb-6 text-[15px] font-semibold text-[var(--pub-shade-ink)]">Without a record</p>
        <Street known={false} />
        <p className="mt-6 text-[15px] text-[var(--pub-shade-ink)]">Nobody can say which homes were served.</p>
      </div>
      <div className="rounded-3xl bg-[var(--pub-field)] p-[clamp(20px,2.4vw,40px)]">
        <p className="mb-6 text-[15px] font-semibold text-[var(--pub-forest)]">With EcoTrack</p>
        <Street known />
        <p className="mt-6 text-[15px] text-ink-2">Every home has a status the city can act on.</p>
      </div>
      <figcaption className="sr-only">Illustration: the same street of twelve homes. Without a record, every home is a question mark. With EcoTrack, each home shows collected, pending or missed.</figcaption>
    </figure>
  )
}

const STATUS_KEY: { mark: Exclude<Mark, 'unknown'>; meaning: string }[] = [
  { mark: 'done', meaning: 'The crew has logged this pickup as done.' },
  { mark: 'pending', meaning: 'The request is logged and still waiting for the crew.' },
  { mark: 'missed', meaning: 'The pickup was not made, and the record shows it.' },
]

/** What each status on a home means, in the same marks the illustration uses. */
export function StatusKey() {
  return (
    <dl className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
      {STATUS_KEY.map((k) => (
        <div key={k.mark} className="flex items-start gap-3.5 bg-panel px-5 py-5 sm:px-6">
          <span aria-hidden className={cn('mt-0.5 grid size-6 shrink-0 place-items-center rounded-full', BADGE[k.mark].cls)}>
            {BADGE[k.mark].icon}
          </span>
          <div>
            <dt className="text-[16px] font-semibold text-ink">{MARK_LABEL[k.mark]}</dt>
            <dd className="mt-1 text-[15px] leading-[1.55] text-ink-2">{k.meaning}</dd>
          </div>
        </div>
      ))}
    </dl>
  )
}

/** The closing image: the same street, every home accounted for. Illustration. */
export function StreetAccounted() {
  return (
    <figure className="grid grid-cols-4 gap-[clamp(10px,1.2vw,18px)] sm:grid-cols-6">
      {Array.from({ length: 12 }, (_, i) => (
        <span key={i} className="relative grid aspect-square place-items-center rounded-xl border border-[var(--pub-dark-line)] bg-[var(--pub-glass)] text-[var(--pub-on-dark-2)]">
          <House strokeWidth={1.5} className="size-[44%]" />
          <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-[var(--pub-leaf)] text-[#0d1f0b] ring-2 ring-[var(--pub-charcoal)]">
            <Check strokeWidth={3} className="size-3" />
          </span>
        </span>
      ))}
      <figcaption className="sr-only">Illustration: a street of twelve homes, each marked as collected.</figcaption>
    </figure>
  )
}

/* ------------------------------------------------------------ the console */

const timeFmt = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

/** The municipal console at full size: the day's counts, the collector map and the latest logs. Real components, sample data. */
export function ConsoleDemo() {
  const logs = useData((d) => d.logs)
  const collectors = useData((d) => d.collectors)
  const day = useReportingDay(logs)
  const latest = logsToday(logs, day.at)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 6)
  return (
    <figure className="overflow-hidden rounded-2xl border border-[var(--pub-shot-line)] bg-panel shadow-[0_50px_100px_-30px_rgb(0_0_0/0.7)]">
      <div className="flex items-center gap-3 border-b border-line bg-muted px-5 py-3">
        <BrandMark size="sm" />
        <figcaption className="min-w-0 flex-1 truncate text-[14px] font-semibold text-ink">Municipal console</figcaption>
        <DemoTag label="Sample data" />
      </div>
      <div className="border-b border-line">
        <Counts />
      </div>
      <div className="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="relative h-[300px] bg-[var(--et-map-bg)] lg:h-[400px]">
          <Suspense fallback={null}>
            <UnitMap collectors={collectors} interactive={false} className="absolute inset-0" />
          </Suspense>
        </div>
        <div className="border-t border-line lg:border-l lg:border-t-0">
          <p className="border-b border-line px-5 py-3 text-[14px] font-semibold text-ink">Latest collection logs</p>
          <ul className="divide-y divide-line">
            {latest.map((l) => (
              <li key={l.id} className="flex items-center gap-3 px-5 py-3">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-semibold text-ink">{l.address}</span>
                  <span className="block text-[13px] text-ink-3">
                    {l.sector} · {timeFmt.format(l.createdAt)}
                  </span>
                </span>
                <LogStatusBadge status={l.status} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------- the phones */

/** Resident and crew app concepts, side by side. */
export function PhonePair({ className }: { className?: string }) {
  return (
    <div className={cn('grid grid-cols-2 items-start gap-[clamp(16px,3vw,48px)]', className)}>
      <Phone label={RESIDENT_LABEL} className="w-full max-w-[280px] justify-self-end">
        <ResidentAppScreen />
      </Phone>
      <Phone label={CREW_LABEL} className="mt-[clamp(32px,5vw,72px)] w-full max-w-[280px]">
        <CrewAppScreen />
      </Phone>
    </div>
  )
}
