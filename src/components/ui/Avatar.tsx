import { cn } from '@/lib/cn'

/** "Alex Rivera" -> "AR": the first letters of the first two words. */
function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('')
}

/** Initials tile: light green field, dark green initials. */
export function Avatar({ name, size = 'md', className }: { name: string; size?: 'sm' | 'md'; className?: string }) {
  return (
    <span aria-hidden className={cn('inline-grid shrink-0 place-items-center rounded-lg bg-accent-soft font-semibold text-accent-text', size === 'sm' ? 'size-8 text-[11.5px]' : 'size-10 text-[13px]', className)}>
      {initials(name)}
    </span>
  )
}
