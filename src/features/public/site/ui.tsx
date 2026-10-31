/** Layout and text primitives for the public site only. */
import type { ReactNode } from 'react'
import { CircleDashed, CircleCheck } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { Status } from './content'

/**
 * The public page column. On desktop the gutters are 4% of the viewport, so the
 * content uses about 92% of the width, capped at 1760px on very wide screens.
 */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-[1760px] px-5 sm:px-8 lg:px-[4vw]', className)}>{children}</div>
}

/** Short label above a heading: sentence case, with a brand-green rule. */
export function Eyebrow({ children, className, dark }: { children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <p className={cn('inline-flex items-center gap-2.5 text-[14px] font-semibold', dark ? 'text-[var(--pub-leaf-text)]' : 'text-[var(--pub-forest)]', className)}>
      <span aria-hidden className="h-0.5 w-6 rounded-full bg-[var(--pub-leaf)]" />
      {children}
    </p>
  )
}

/** "Available now" or "Planned": shown wherever a capability is described. */
export function StatusPill({ status, className, dark }: { status: Status; className?: string; dark?: boolean }) {
  return status === 'available' ? (
    <span className={cn('inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-semibold', dark ? 'bg-[rgb(72_179_64/0.16)] text-[var(--pub-leaf-text)]' : 'bg-ok-soft text-ok-text', className)}>
      <CircleCheck aria-hidden className="size-3.5" />
      Available now
    </span>
  ) : (
    <span className={cn('inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-dashed px-2.5 py-1 text-[12px] font-semibold', dark ? 'border-[var(--pub-glass-line)] text-[var(--pub-on-dark-2)]' : 'border-line-strong text-ink-2', className)}>
      <CircleDashed aria-hidden className="et-spin-slow size-3.5" />
      Planned
    </span>
  )
}

/** Dark opening block shared by the inner public pages. */
export function PageHead({ eyebrow, title, body, children }: { eyebrow: string; title: ReactNode; body: ReactNode; children?: ReactNode }) {
  return (
    <section className="pub-dark relative overflow-hidden">
      <div aria-hidden className="pub-streets absolute inset-0 [mask-image:linear-gradient(to_left,black,transparent_75%)]" />
      <Container className="relative py-14 sm:py-16 lg:py-20">
        <Eyebrow dark>{eyebrow}</Eyebrow>
        <h1 className="mt-5 max-w-4xl text-[clamp(36px,4.2vw,64px)] font-bold leading-[1.05] tracking-[-0.015em] text-[var(--pub-on-dark)]">{title}</h1>
        <p className="mt-6 max-w-2xl text-[19px] leading-[1.6] text-[var(--pub-on-dark-2)]">{body}</p>
        {children}
      </Container>
    </section>
  )
}
