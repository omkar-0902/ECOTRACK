/**
 * The homepage product family: the real municipal console beside concept
 * screens for the planned resident and crew apps.
 *
 * Phone screens are drawn at a 220px reference width and sized in container
 * query units (cqw), so each one scales cleanly to whatever width it is given.
 * At 220px, 1px ≈ 0.4545cqw (11px text = 5cqw).
 */
import type { ReactNode } from 'react'
import { Bell, Check, CheckCircle2, ChevronRight, Leaf, MapPin, Navigation, Truck } from 'lucide-react'
import { useData } from '@/store/StoreProvider'
import { logsToday } from '@/store/selectors'
import type { CollectionLog } from '@/types/domain'
import { cn } from '@/lib/cn'
import { StatusPill } from './ui'
import { ProductWindow, useReportingDay } from './visuals'
import { formatPercent, percent } from '@/lib/metrics'

/* ------------------------------------------------------------------ frame */

/** A modern smartphone: thin dark bezel, island, soft reflection. */
export function Phone({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn('[container-type:inline-size]', className)}>
      <div role="img" aria-label={label} className="relative rounded-[15cqw] bg-[#0b0d0c] p-[2.6cqw] shadow-[0_30px_60px_-18px_rgb(0_0_0/0.7),0_0_0_1px_rgb(255_255_255/0.14)]">
        <div aria-hidden className="relative aspect-[9/19.5] overflow-hidden rounded-[12.5cqw]">
          {children}
          <span className="absolute left-1/2 top-[2.6cqw] h-[6.8cqw] w-[27cqw] -translate-x-1/2 rounded-full bg-black" />
          <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgb(255_255_255/0.14),transparent_38%)]" />
        </div>
      </div>
    </div>
  )
}

function StatusBar({ dark }: { dark?: boolean }) {
  return (
    <div className={cn('flex items-center justify-between px-[7cqw] pt-[3.2cqw] text-[4.6cqw] font-semibold', dark ? 'text-white' : 'text-[#111513]')}>
      <span>9:41</span>
      <span className="flex items-center gap-[1.2cqw]">
        <span className="flex items-end gap-[0.6cqw]">
          {[1.6, 2.4, 3.2, 4].map((h) => (
            <span key={h} className="w-[0.9cqw] rounded-[0.4cqw] bg-current" style={{ height: `${h}cqw` }} />
          ))}
        </span>
        <span className="h-[3.6cqw] w-[6.4cqw] rounded-[1cqw] border-[0.5cqw] border-current p-[0.4cqw]">
          <span className="block h-full w-3/4 rounded-[0.4cqw] bg-current" />
        </span>
      </span>
    </div>
  )
}

/* --------------------------------------------------------------- resident */

/** Resident app concept: what the proposal says residents can do. */
export function ResidentAppScreen() {
  return (
    <div className="flex h-full flex-col bg-[#f6f8f5] text-[#111513]">
      <StatusBar />
      <div className="flex items-center justify-between px-[6cqw] pt-[5cqw]">
        <span className="flex items-center gap-[1.6cqw] text-[5.6cqw] font-bold text-[#1a6b35]">
          <Leaf className="size-[5.4cqw]" />
          EcoTrack
        </span>
        <span className="relative grid size-[8.6cqw] place-items-center rounded-full bg-white shadow-[0_1px_3px_rgb(0_0_0/0.12)]">
          <Bell className="size-[4.4cqw]" />
          <span className="absolute right-[1.6cqw] top-[1.4cqw] size-[1.8cqw] rounded-full bg-[#48b340]" />
        </span>
      </div>
      <p className="px-[6cqw] pt-[3.6cqw] text-[8cqw] font-bold leading-[1.15]">Your collection</p>

      {/* Arrival notice */}
      <div className="mx-[5cqw] mt-[3.6cqw] flex gap-[2.6cqw] rounded-[4cqw] bg-[#1a6b35] p-[3.6cqw] text-white">
        <Truck className="mt-[0.4cqw] size-[5.4cqw] shrink-0" />
        <div>
          <p className="text-[4.8cqw] font-bold leading-tight">The crew is near</p>
          <p className="mt-[0.8cqw] text-[4cqw] leading-snug text-white/80">Please bring your waste out now.</p>
        </div>
      </div>

      {/* Service area */}
      <div className="relative mx-[5cqw] mt-[3cqw] h-[38cqw] overflow-hidden rounded-[4cqw] bg-[#e7f0e3]">
        <svg viewBox="0 0 200 76" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
          {[25, 60, 95, 130, 165].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="76" stroke="#ffffff" strokeWidth="2.5" />
          ))}
          {[18, 46].map((y) => (
            <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="#ffffff" strokeWidth="2.5" />
          ))}
          <circle cx="112" cy="36" r="27" fill="#48b340" fillOpacity="0.14" stroke="#48b340" strokeDasharray="3 3" />
          <path d="M20 66 L60 46 L95 46 L112 36" fill="none" stroke="#1a6b35" strokeWidth="2" strokeDasharray="4 3" />
          <rect x="52" y="40" width="14" height="9" rx="2" fill="#1a6b35" />
          <circle cx="112" cy="36" r="5.5" fill="#1a6b35" stroke="#ffffff" strokeWidth="2" />
        </svg>
        <span className="absolute bottom-[2.2cqw] left-[2.6cqw] rounded-full bg-white px-[2.4cqw] py-[0.8cqw] text-[3.8cqw] font-semibold shadow-[0_1px_2px_rgb(0_0_0/0.12)]">Your pickup area</span>
      </div>

      <div className="mx-[5cqw] mt-[3cqw] flex items-center justify-center gap-[2cqw] rounded-[4cqw] bg-[#48b340] py-[3.4cqw] text-[5cqw] font-bold text-[#0d1f0b]">
        <MapPin className="size-[5cqw]" />
        Request a pickup
      </div>

      <div className="mx-[5cqw] mt-[3cqw] grid grid-cols-2 gap-[2.6cqw]">
        <div className="rounded-[3.6cqw] bg-white p-[3cqw] shadow-[0_1px_2px_rgb(0_0_0/0.08)]">
          <p className="text-[3.8cqw] text-[#5d6660]">Last pickup</p>
          <p className="mt-[0.6cqw] flex items-center gap-[1cqw] text-[4.4cqw] font-bold text-[#1a6b35]">
            <CheckCircle2 className="size-[4.2cqw]" />
            Confirmed
          </p>
        </div>
        <div className="rounded-[3.6cqw] bg-white p-[3cqw] shadow-[0_1px_2px_rgb(0_0_0/0.08)]">
          <p className="text-[3.8cqw] text-[#5d6660]">Eco Points</p>
          <p className="mt-[0.6cqw] text-[5.4cqw] font-bold leading-none">240</p>
        </div>
      </div>

      <p className="px-[6cqw] pt-[4cqw] text-[4.2cqw] font-semibold text-[#5d6660]">Recent pickups</p>
      <ul className="mx-[5cqw] mt-[1.6cqw] flex flex-col gap-[2cqw]">
        {[
          { day: 'Monday', note: 'Collected and confirmed' },
          { day: 'Thursday', note: 'Collected and confirmed' },
        ].map((r) => (
          <li key={r.day} className="flex items-center gap-[2.6cqw] rounded-[3.4cqw] bg-white px-[3.2cqw] py-[2.6cqw]">
            <span className="grid size-[7cqw] shrink-0 place-items-center rounded-full bg-[#e6f4e3] text-[#1a6b35]">
              <Check className="size-[3.8cqw]" strokeWidth={3} />
            </span>
            <span className="min-w-0">
              <span className="block text-[4.4cqw] font-semibold">{r.day}</span>
              <span className="block text-[3.6cqw] text-[#5d6660]">{r.note}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ------------------------------------------------------------------- crew */

const STOP_STYLE: Record<CollectionLog['status'], { label: string; cls: string }> = {
  completed: { label: 'Done', cls: 'bg-[#e6f4e3] text-[#1a6b35]' },
  pending: { label: 'To collect', cls: 'bg-[#fdf1db] text-[#8a5300]' },
  missed: { label: 'Missed', cls: 'bg-[#fde7e5] text-[#b42318]' },
}

/** Crew app concept, filled from the same sample collection logs as the console. */
export function CrewAppScreen() {
  const logs = useData((d) => d.logs)
  const shift = useData((d) => d.shift)
  const day = useReportingDay(logs)
  const today = logsToday(logs, day.at).sort((a, b) => a.createdAt - b.createdAt)
  const done = today.filter((l) => l.status === 'completed').length
  const next = today.find((l) => l.status === 'pending')
  const list = today.filter((l) => l !== next).slice(-4).reverse()
  const pct = percent(done, today.length)

  return (
    <div className="flex h-full flex-col bg-[#f2f4f1] text-[#111513]">
      <div className="bg-[#0d2a1b] pb-[4.6cqw] text-white">
        <StatusBar dark />
        <div className="flex items-center justify-between px-[6cqw] pt-[5cqw]">
          <div>
            <p className="text-[4cqw] text-white/65">
              Shift {shift.start}–{shift.end}
            </p>
            <p className="text-[7.4cqw] font-bold leading-tight">Today's route</p>
          </div>
          <span className="grid size-[9cqw] place-items-center rounded-full bg-[#48b340] text-[#0d1f0b]">
            <Navigation className="size-[4.6cqw]" />
          </span>
        </div>
        <div className="mx-[6cqw] mt-[3.4cqw]">
          <div className="flex justify-between text-[4cqw] text-white/75">
            <span>
              {done} of {today.length} stops done
            </span>
            <span className="font-semibold text-[#8be07f]">{formatPercent(pct)}</span>
          </div>
          <div className="mt-[1.4cqw] h-[1.8cqw] overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-[#48b340]" style={{ width: `${pct ?? 0}%` }} />
          </div>
        </div>
      </div>

      {next && (
        <div className="mx-[5cqw] -mt-[2.4cqw] rounded-[4cqw] bg-white p-[3.6cqw] shadow-[0_6px_16px_-6px_rgb(0_0_0/0.25)]">
          <p className="text-[3.8cqw] font-semibold uppercase tracking-[0.06em] text-[#8a5300]">Next stop</p>
          <p className="mt-[1cqw] text-[5.4cqw] font-bold leading-snug">{next.address}</p>
          <p className="text-[4cqw] text-[#5d6660]">{next.sector}</p>
          <div className="mt-[3cqw] flex items-center justify-center gap-[1.6cqw] rounded-[3.4cqw] bg-[#1a6b35] py-[3.4cqw] text-[5cqw] font-bold text-white">
            <Check className="size-[5cqw]" strokeWidth={3} />
            Mark collected
          </div>
        </div>
      )}

      <p className="px-[6cqw] pt-[4cqw] text-[4.2cqw] font-semibold text-[#5d6660]">Recent stops</p>
      <ul className="mx-[5cqw] mt-[1.6cqw] flex flex-col gap-[2cqw]">
        {list.map((l) => (
          <li key={l.id} className="flex items-center gap-[2.6cqw] rounded-[3.4cqw] bg-white px-[3.2cqw] py-[2.6cqw]">
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[4.4cqw] font-semibold">{l.address}</span>
              <span className="block text-[3.6cqw] text-[#5d6660]">{l.sector}</span>
            </span>
            <span className={cn('shrink-0 rounded-full px-[2.2cqw] py-[0.8cqw] text-[3.6cqw] font-semibold', STOP_STYLE[l.status].cls)}>{STOP_STYLE[l.status].label}</span>
          </li>
        ))}
      </ul>
      <p className="mt-auto flex items-center justify-center gap-[1cqw] pb-[5cqw] pt-[2cqw] text-[3.8cqw] font-semibold text-[#1a6b35]">
        Full route
        <ChevronRight className="size-[3.8cqw]" />
      </p>
    </div>
  )
}

/* -------------------------------------------------------------- showcase */

function Caption({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-[var(--pub-on-dark-2)]', className)}>{children}</p>
}

export const RESIDENT_LABEL = 'Resident app concept: an alert that the collection crew is near, a map of the pickup area, a Request a pickup button, the last pickup confirmed and Eco Points.'
export const CREW_LABEL = "Crew app concept: today's route with progress, the next stop with a Mark collected button, and recent stops."

/**
 * Desktop (lg+): the console as the operational anchor, with the two phones
 * stepped in front of its right edge. Every position is a percentage of the
 * stage, so the arrangement keeps its proportions at any width.
 * Below lg: console first, then the two phones side by side.
 */
export function HeroShowcase() {
  return (
    <div className="min-w-0">
      {/* Desktop stage */}
      <div className="relative hidden aspect-[4/3] lg:block">
        <div className="absolute left-0 top-[13%] isolate w-[55%]">
          <ProductWindow mapClassName="h-[clamp(200px,17vw,300px)]" />
          <Caption>
            <StatusPill status="available" dark /> Municipal console, sample data
          </Caption>
        </div>
        <div className="absolute left-[51%] top-[19%] z-10 w-[25%]">
          <Phone label={RESIDENT_LABEL}>
            <ResidentAppScreen />
          </Phone>
          <Caption className="justify-center">
            <StatusPill status="planned" dark /> Resident app
          </Caption>
        </div>
        <div className="absolute right-0 top-0 w-[25%]">
          <Phone label={CREW_LABEL}>
            <CrewAppScreen />
          </Phone>
          <Caption className="justify-center">
            <StatusPill status="planned" dark /> Crew app
          </Caption>
        </div>
      </div>

      {/* Tablet and mobile */}
      <div className="lg:hidden">
        <ProductWindow />
        <Caption>
          <StatusPill status="available" dark /> Municipal console, sample data
        </Caption>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:mx-auto sm:max-w-[520px] sm:gap-8">
          <div>
            <Phone label={RESIDENT_LABEL}>
              <ResidentAppScreen />
            </Phone>
            <Caption className="justify-center">
              <StatusPill status="planned" dark /> Resident app
            </Caption>
          </div>
          <div className="pt-8">
            <Phone label={CREW_LABEL}>
              <CrewAppScreen />
            </Phone>
            <Caption className="justify-center">
              <StatusPill status="planned" dark /> Crew app
            </Caption>
          </div>
        </div>
      </div>
    </div>
  )
}
