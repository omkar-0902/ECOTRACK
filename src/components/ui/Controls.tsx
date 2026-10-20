import { useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { cn } from '@/lib/cn'

const CONTROL =
  'h-11 w-full rounded-lg border border-line-strong bg-panel text-[16px] text-ink sm:h-10 sm:text-[14px] placeholder:text-ink-3 transition-colors hover:border-ink-3 focus:border-accent focus:outline-none focus-visible:outline-none focus:ring-[3px] focus:ring-accent-soft'

export function SearchInput({ label, value, onChange, placeholder, className }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <label className={cn('relative block min-w-0', className)}>
      <span className="sr-only">{label}</span>
      <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-3" />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cn(CONTROL, 'pl-9 pr-3')} />
    </label>
  )
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  icon,
  className,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  icon?: ReactNode
  className?: string
}) {
  return (
    <label className={cn('relative block min-w-0', className)}>
      <span className="sr-only">{label}</span>
      {icon && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3">{icon}</span>}
      <select value={value} onChange={(e) => onChange(e.target.value)} className={cn(CONTROL, 'appearance-none pr-9', icon ? 'pl-9' : 'pl-3')}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-3" />
    </label>
  )
}

/** Labelled text field with optional leading icon, hint and inline error wired to aria-describedby. */
export function TextField({
  label,
  icon,
  hint,
  error,
  className,
  ...input
}: { label: string; icon?: ReactNode; hint?: string; error?: string | null } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId()
  const hintId = `${id}-hint`
  const errId = `${id}-err`
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-[14px] font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        {icon && <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3">{icon}</span>}
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={[hint && hintId, error && errId].filter(Boolean).join(' ') || undefined}
          {...input}
          className={cn(CONTROL, 'h-11', icon ? 'pl-10' : 'pl-3.5', 'pr-3.5 aria-[invalid=true]:border-crit')}
        />
      </div>
      {hint && !error && (
        <p id={hintId} className="text-[12px] text-ink-3">
          {hint}
        </p>
      )}
      {error && (
        <p id={errId} role="alert" className="text-[13px] text-crit-text">
          {error}
        </p>
      )}
    </div>
  )
}
