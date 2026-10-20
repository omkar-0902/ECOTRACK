import type { ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { cn } from '@/lib/cn'
import { BUTTON_BASE, BUTTON_SIZE, BUTTON_VARIANT } from './Button'

/** A router link styled as a button, for calls to action that navigate. */
export function ButtonLink({
  variant = 'secondary',
  size = 'md',
  icon,
  trailingIcon,
  className,
  children,
  ...rest
}: LinkProps & { variant?: keyof typeof BUTTON_VARIANT; size?: keyof typeof BUTTON_SIZE; icon?: ReactNode; trailingIcon?: boolean; className?: string; children: ReactNode }) {
  return (
    <Link className={cn(BUTTON_BASE, BUTTON_VARIANT[variant], BUTTON_SIZE[size], trailingIcon && 'flex-row-reverse', className)} {...rest}>
      {icon}
      {children}
    </Link>
  )
}
