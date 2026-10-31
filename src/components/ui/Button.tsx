import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'outline' | 'accent' | 'secondary' | 'ghost' | 'light' | 'inverse' | 'danger' | 'danger-ghost'
type Size = 'sm' | 'md' | 'lg' | 'xl'

export const BUTTON_VARIANT: Record<Variant, string> = {
  /** Brand green with near-black text (7.5:1); one per view. A fine top highlight, and a green lift on hover. */
  primary:
    'bg-accent text-accent-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.22),0_1px_2px_rgb(11_31_13/0.16)] hover:bg-accent-hover hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.22),0_6px_16px_-6px_rgb(35_122_43/0.55)] active:shadow-[inset_0_1px_2px_rgb(11_31_13/0.22)]',
  /** Green outline: the secondary call to action on light surfaces. */
  outline: 'border border-accent-text text-accent-text hover:bg-accent-soft active:bg-accent-tint',
  accent: 'border border-accent-text text-accent-text hover:bg-accent-soft active:bg-accent-tint',
  secondary: 'bg-panel text-ink border border-line-strong shadow-e1 hover:bg-hover hover:border-ink-3 active:bg-sunken',
  ghost: 'text-ink-2 hover:text-ink hover:bg-hover active:bg-sunken',
  /** Outline for night surfaces; public bands that turn light in the light theme remap the --btn-light-* variables. */
  light: 'border border-[color:var(--btn-light-line,rgb(255_255_255/0.7))] text-on-night hover:bg-[color:var(--btn-light-hover,rgb(255_255_255/0.1))] hover:border-[color:var(--btn-light-line-hover,#fff)]',
  /** Solid ink (charcoal in light, near-white in dark): a strong action that doesn't compete with the green one. */
  inverse: 'bg-ink text-canvas shadow-e1 hover:bg-ink/85 active:bg-ink/80',
  danger: 'bg-crit-text text-white hover:brightness-110 active:brightness-95',
  'danger-ghost': 'text-crit-text hover:bg-crit-soft active:bg-crit-soft',
}
export const BUTTON_SIZE: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px] gap-1.5 rounded-md',
  md: 'h-10 px-4 text-[14px] gap-2 rounded-lg',
  lg: 'h-12 px-6 text-[15px] gap-2 rounded-lg',
  /** Public-site calls to action: 56px, uppercase, as in the reference. */
  xl: 'h-13 px-7 text-[16px] gap-2.5 rounded-lg font-semibold',
}
/**
 * Shared interaction: colour and shadow ease over 150 ms; a 1 px press on
 * click; disabled buttons fade and stop responding to hover and press.
 */
export const BUTTON_BASE =
  'inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap font-medium transition-[background-color,border-color,color,box-shadow,filter,transform] duration-150 ease-out active:translate-y-px disabled:opacity-45 disabled:shadow-none disabled:active:translate-y-0 [touch-action:manipulation] [&_svg]:shrink-0'
/** A trailing arrow nudges forward on hover. */
export const BUTTON_TRAILING = 'flex-row-reverse [&>svg]:transition-transform [&>svg]:duration-200 [&:hover>svg]:translate-x-0.5'

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
      className={cn(BUTTON_BASE, BUTTON_VARIANT[variant], BUTTON_SIZE[size], trailingIcon && BUTTON_TRAILING, className)}
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
        'relative inline-grid shrink-0 place-items-center rounded-lg transition-[background-color,color,transform] duration-150 active:translate-y-px disabled:opacity-40 disabled:active:translate-y-0 [touch-action:manipulation]',
        size === 'sm' ? 'size-8' : 'size-10',
        variant === 'ghost' && 'text-ink-2 hover:bg-hover hover:text-ink',
        variant === 'secondary' && 'border border-line-strong bg-panel text-ink hover:bg-hover',
        variant === 'night' && 'text-on-night-2 hover:bg-[color:var(--night-hover,rgb(255_255_255/0.1))] hover:text-on-night',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
})
