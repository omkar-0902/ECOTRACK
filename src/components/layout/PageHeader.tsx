import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Console page frame: a white header band (title, subtitle, actions) over the
 * muted workspace. On desktop (lg+) the workspace fills the space below the
 * toolbar, with long lists scrolling in their own region; below lg, pages take
 * their natural height.
 */
export function Page({ title, subtitle, actions, children, className }: { title: string; subtitle: string; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className="flex flex-col lg:min-h-0 lg:flex-1">
      <header className="shrink-0 border-b border-line bg-canvas">
        <div className="mx-auto flex w-full max-w-[1480px] flex-wrap items-center justify-between gap-x-8 gap-y-4 px-4 py-6 sm:px-6 lg:px-8 lg:py-[clamp(16px,2.6vh,26px)]">
          <div className="min-w-0">
            <h1 className="text-[clamp(26px,2.2vw,32px)] font-bold leading-[1.15] text-ink">{title}</h1>
            <p className="mt-1.5 text-[15px] leading-[22px] text-ink-2">{subtitle}</p>
          </div>
          {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
        </div>
      </header>
      <div className={cn('mx-auto flex w-full max-w-[1480px] flex-col gap-5 px-4 py-5 sm:px-6 lg:min-h-0 lg:flex-1 lg:gap-6 lg:px-8 lg:py-[clamp(16px,2.6vh,28px)]', className)}>{children}</div>
    </div>
  )
}

/** A white card on the workspace. `fill` makes it take the remaining height on desktop. */
export function Panel({ children, className, label, fill }: { children: ReactNode; className?: string; label?: string; fill?: boolean }) {
  return (
    <section aria-label={label} className={cn('relative flex min-w-0 flex-col overflow-hidden rounded-lg border border-line bg-panel shadow-e1', fill && 'lg:min-h-0 lg:flex-1', className)}>
      {children}
    </section>
  )
}

/** Card header row: title, optional meta, optional actions. */
export function PanelHeader({ title, meta, actions, id }: { title: string; meta?: ReactNode; actions?: ReactNode; id?: string }) {
  return (
    <header className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line px-6 py-4">
      <div className="flex min-w-0 items-baseline gap-3">
        <h2 id={id} className="text-[17px] font-bold leading-6 text-ink">
          {title}
        </h2>
        {meta && <span className="truncate text-[14px] text-ink-3">{meta}</span>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  )
}

/** Notice for modules the product marks as under construction. */
export function ModuleNotice({ icon, title, body, status }: { icon: ReactNode; title: string; body: string; status: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <span className="grid size-20 place-items-center rounded-full bg-accent-soft text-accent-text [&>svg]:size-8">{icon}</span>
      <h2 className="mt-7 text-h3 text-ink">{title}</h2>
      <p className="mt-3 max-w-md text-body text-ink-2">{body}</p>
      <p className="mt-7 inline-flex items-center gap-2 rounded-sm bg-warn-soft px-3 py-1.5 text-[13px] font-semibold text-warn-text">
        <span aria-hidden className="size-2 rounded-full bg-warn" />
        {status}
      </p>
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
