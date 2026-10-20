import { Zap } from 'lucide-react'
import { cn } from '@/lib/cn'

/** The ECOTRACK mark: a lightning bolt on a brand-green tile. */
export function BrandMark({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const box = { sm: 'size-7 rounded-md', md: 'size-9 rounded-lg', lg: 'size-14 rounded-lg' }[size]
  const icon = { sm: 'size-3.5', md: 'size-[18px]', lg: 'size-6' }[size]
  return (
    <span aria-hidden className={cn('grid shrink-0 place-items-center bg-brand text-brand-ink', box, className)}>
      <Zap className={cn(icon, 'fill-current')} strokeWidth={1.5} />
    </span>
  )
}

/** Two-tone wordmark from the original identity: ECO in ink (white on night), TRACK in green. */
export function Wordmark({ className, tone = 'default' }: { className?: string; tone?: 'default' | 'night' }) {
  return (
    <span className={cn('text-[19px] font-bold leading-none tracking-[0.03em]', tone === 'night' ? 'text-on-night' : 'text-ink', className)}>
      ECO<span className={tone === 'night' ? 'text-brand' : 'text-accent-text'}>TRACK</span>
    </span>
  )
}

export function Brand({ compact, className, tone = 'default' }: { compact?: boolean; className?: string; tone?: 'default' | 'night' }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <BrandMark />
      {!compact && <Wordmark tone={tone} />}
    </span>
  )
}
