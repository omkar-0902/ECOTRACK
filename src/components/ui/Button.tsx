import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'outline' | 'accent' | 'secondary' | 'ghost' | 'light' | 'danger' | 'danger-ghost'
type Size = 'sm' | 'md' | 'lg' | 'xl'

export const BUTTON_VARIANT: Record<Variant, string> = {
  /** Brand green with near-black text (6.7:1); one per view. */
  primary: 'bg-accent text-accent-ink hover:bg-accent-hover',
  /** Green outline: the secondary call to action on light surfaces. */
  outline: 'border border-accent-text text-accent-text hover:bg-accent-soft',
  accent: 'border border-accent-text text-accent-text hover:bg-accent-soft',
  secondary: 'bg-panel text-ink border border-line-strong hover:bg-hover hover:border-ink-3',
  ghost: 'text-ink-2 hover:text-ink hover:bg-hover',
  /** White outline for night surfaces. */
  light: 'border border-white/70 text-on-night hover:bg-white/10 hover:border-white',
  danger: 'bg-crit-text text-white hover:brightness-110',
  'danger-ghost': 'text-crit-text hover:bg-crit-soft',
}
export const BUTTON_SIZE: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px] gap-1.5 rounded-md',
  md: 'h-10 px-4 text-[14px] gap-2 rounded-lg',
  lg: 'h-12 px-6 text-[15px] gap-2 rounded-lg',
  /** Public-site calls to action: 56px, uppercase, as in the reference. */
  xl: 'h-14 px-8 text-[15px] gap-2.5 rounded-lg uppercase tracking-[0.04em] font-semibold',
}
export const BUTTON_BASE =
  'inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap font-medium transition-[background-color,border-color,color,filter] duration-150 disabled:opacity-45 [touch-action:manipulation]'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: ReactNode
  /** Places the icon after the label. */
  trailingIcon?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'secondary', size = 'md', loading, icon, trailingIcon, className, children, disabled, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(BUTTON_BASE, BUTTON_VARIANT[variant], BUTTON_SIZE[size], trailingIcon && 'flex-row-reverse', className)}
      {...rest}
    >
      {loading ? <Loader2 aria-hidden className="size-4 animate-spin" /> : icon}
      {children}
    </button>
  )
})

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible name — required because the button has no visible text. */
  label: string
  size?: 'sm' | 'md'
  variant?: 'ghost' | 'secondary' | 'night'
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, size = 'md', variant = 'ghost', className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'relative inline-grid shrink-0 place-items-center rounded-lg transition-colors duration-150 disabled:opacity-40 [touch-action:manipulation]',
        size === 'sm' ? 'size-8' : 'size-10',
        variant === 'ghost' && 'text-ink-2 hover:bg-hover hover:text-ink',
        variant === 'secondary' && 'border border-line-strong bg-panel text-ink hover:bg-hover',
        variant === 'night' && 'text-on-night-2 hover:bg-white/10 hover:text-on-night',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
})
