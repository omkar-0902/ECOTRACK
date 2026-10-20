/** Layout and text primitives for the public site only. */
import type { ReactNode } from 'react'
import { CircleDashed, CircleCheck } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { Status } from './content'

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8', className)}>{children}</div>
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--pub-forest)]', className)}>{children}</p>
}

const TONE = {
  white: 'bg-canvas',
  field: 'bg-[var(--pub-field)]',
  muted: 'bg-muted',
} as const

export function Band({ tone = 'white', children, className, labelledBy, id }: { tone?: keyof typeof TONE; children: ReactNode; className?: string; labelledBy?: string; id?: string }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn('py-16 sm:py-20 lg:py-24', TONE[tone], className)}>
      <Container>{children}</Container>
    </section>
  )
}

export function Heading({ id, eyebrow, title, body, className, level = 2 }: { id?: string; eyebrow?: string; title: ReactNode; body?: ReactNode; className?: string; level?: 2 | 3 }) {
  const H = level === 2 ? 'h2' : 'h3'
  return (
    <div className={cn('max-w-2xl', className)}>
      {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
      <H id={id} className={cn('font-bold text-ink', level === 2 ? 'text-[clamp(28px,3vw,40px)] leading-[1.12]' : 'text-[24px] leading-8')}>
        {title}
      </H>
      {body && <p className="mt-4 text-[17px] leading-[1.6] text-ink-2">{body}</p>}
    </div>
  )
}

/** "In this build" or "Planned": shown wherever a capability is described. */
export function StatusPill({ status, className }: { status: Status; className?: string }) {
  return status === 'available' ? (
    <span className={cn('inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-ok-soft px-2.5 py-1 text-[12px] font-semibold text-ok-text', className)}>
      <CircleCheck aria-hidden className="size-3.5" />
      In this build
    </span>
  ) : (
    <span className={cn('inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-dashed border-line-strong px-2.5 py-1 text-[12px] font-semibold text-ink-2', className)}>
      <CircleDashed aria-hidden className="size-3.5" />
      Planned
    </span>
  )
}

/** Opening block for the inner public pages. */
export function PageHead({ eyebrow, title, body, children, className }: { eyebrow: string; title: ReactNode; body: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <section className={cn('border-b border-line bg-canvas', className)}>
      <Container className="py-14 sm:py-16 lg:py-20">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-4 max-w-4xl text-[clamp(34px,4.2vw,56px)] font-bold leading-[1.06] text-ink">{title}</h1>
        <p className="mt-5 max-w-2xl text-[18px] leading-[1.6] text-ink-2">{body}</p>
        {children}
      </Container>
    </section>
  )
}
