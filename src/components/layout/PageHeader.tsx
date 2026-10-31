import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Shared console width and gutters: 16 / 24 px, then 24 / 32 px on wide screens. */
const FRAME = 'mx-auto w-full max-w-[1800px] px-4 sm:px-6 xl:px-8'

/**
 * Console page frame: the title row sits directly on the workspace (no band,
 * no rule), so the page reads as one surface in both themes. On desktop (lg+) the workspace fills the space below the
 * toolbar, with long lists scrolling in their own region; below lg, pages take
 * their natural height.
 */
export function Page({ title, subtitle, actions, children, className }: { title: string; subtitle: string; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className="flex flex-col lg:min-h-0 lg:flex-1">
      <header className="shrink-0">
        <div className={cn(FRAME, 'flex flex-wrap items-end justify-between gap-x-8 gap-y-3 pt-5 lg:pt-[clamp(14px,2.2vh,22px)]')}>
          <div className="min-w-0">
            <h1 className="text-[clamp(22px,1.6vw,26px)] font-semibold leading-[1.2] tracking-[-0.015em] text-ink">{title}</h1>
            <p className="mt-0.5 text-[13.5px] leading-5 text-ink-2">{subtitle}</p>
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
        </div>
      </header>
      <div className={cn(FRAME, 'flex flex-col gap-4 py-4 lg:min-h-0 lg:flex-1 lg:py-[clamp(12px,1.8vh,20px)]', className)}>{children}</div>
    </div>
  )
}

/** A white card on the workspace. `fill` makes it take the remaining height on desktop. */
export function Panel({ children, className, label, fill }: { children: ReactNode; className?: string; label?: string; fill?: boolean }) {
  return (
    <section aria-label={label} className={cn('relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-line bg-panel shadow-e1', fill && 'lg:min-h-0 lg:flex-1', className)}>
      {children}
    </section>
  )
}

/** Card header row: title, optional meta, optional actions. */
export function PanelHeader({ title, meta, actions, id }: { title: string; meta?: ReactNode; actions?: ReactNode; id?: string }) {
  return (
    <header className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line px-5 py-3">
      <div className="flex min-w-0 items-baseline gap-3">
        <h2 id={id} className="text-[15px] font-semibold leading-6 tracking-[-0.01em] text-ink">
          {title}
        </h2>
        {meta && <span className="truncate text-[14px] text-ink-3">{meta}</span>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  )
}

/**
 * Notice for modules the product marks as under construction. `art` is an
 * illustration from ConstructionArt; without it the icon is shown in a circle.
 */
export function ModuleNotice({ icon, art, title, body, status }: { icon: ReactNode; art?: ReactNode; title: string; body: string; status: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      {art ? (
        <div className="w-full max-w-[340px] text-ink-3">{art}</div>
      ) : (
        <span className="grid size-20 place-items-center rounded-full bg-accent-soft text-accent-text [&>svg]:size-8">{icon}</span>
      )}
      <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-warn-soft px-3 py-1 text-[12.5px] font-semibold text-warn-text ring-1 ring-inset ring-warn/25">
        <span aria-hidden className="relative inline-flex size-2">
          <span className="et-ping absolute inset-0 rounded-full bg-warn" />
          <span className="relative size-2 rounded-full bg-warn" />
        </span>
        {status}
      </p>
      <h2 className="mt-4 text-h3 text-ink">{title}</h2>
      <p className="mt-3 max-w-md text-body text-ink-2">{body}</p>
    </div>
  )
}

/** Empty state for lists and tables. */
export function EmptyState({ icon, title, body, action }: { icon: ReactNode; title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-muted text-ink-3">{icon}</span>
      <p className="mt-1 text-[16px] font-bold text-ink">{title}</p>
      {body && <p className="max-w-sm text-[14px] leading-5 text-ink-2">{body}</p>}
      {action}
    </div>
  )
}

/** Shown while a console page's code loads: the page frame with quiet placeholders. */
export function PageSkeleton() {
  return (
    <div role="status" aria-label="Loading page" className="flex flex-col lg:min-h-0 lg:flex-1">
      <div className="shrink-0">
        <div className={cn(FRAME, 'pt-5')}>
          <div className="h-6 w-56 animate-pulse rounded-md bg-sunken" />
          <div className="mt-2 h-4 w-80 max-w-full animate-pulse rounded bg-sunken" />
        </div>
      </div>
      <div className={cn(FRAME, 'grid gap-4 py-4 lg:flex-1 lg:grid-cols-[1.6fr_1fr]')}>
        <div className="h-64 animate-pulse rounded-xl bg-panel lg:h-auto" />
        <div className="h-64 animate-pulse rounded-xl bg-panel lg:h-auto" />
      </div>
    </div>
  )
}
