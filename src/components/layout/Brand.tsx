import { cn } from '@/lib/cn'
import { MARK, WORDMARK, WORDMARK_ECO, WORDMARK_TRACK } from './brandPaths'

/**
 * The EcoTrack mark: a geofence ring open at the upper right, a leaf growing
 * out through the gap, and a tracked point on the ring. Shown on the night
 * tile (the app icon), so it reads the same on light and dark surfaces.
 * Source files: public/brand/*.svg.
 */
export function BrandMark({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const box = { sm: 'size-7', md: 'size-9', lg: 'size-14' }[size]
  return (
    <svg aria-hidden viewBox="0 0 48 48" className={cn('shrink-0', box, className)}>
      <rect width="48" height="48" rx="12" fill="#0F1411" />
      <g transform="translate(-3.36 -3.36) scale(1.14)">
        <path d={MARK.ring} fill="none" stroke="#F4F7F4" strokeWidth="3.6" strokeLinecap="round" />
        <path d={MARK.leaf} fill="#43C34B" />
        <circle cx={MARK.node.cx} cy={MARK.node.cy} r={MARK.node.r} fill="#43C34B" />
      </g>
      {/* A hairline keeps the tile's edge visible on the night frame */}
      <rect x="0.5" y="0.5" width="47" height="47" rx="11.5" fill="none" stroke="#ffffff" strokeOpacity="0.1" />
    </svg>
  )
}

/** Outlined ECOTRACK wordmark: ECO in ink (white on night), TRACK in green. */
export function Wordmark({ className, tone = 'default' }: { className?: string; tone?: 'default' | 'night' }) {
  return (
    <svg aria-hidden viewBox={`0 0 ${WORDMARK.width} ${WORDMARK.height}`} className={cn('h-[15px] w-auto shrink-0', className)}>
      <g className={tone === 'night' ? 'fill-on-night' : 'fill-ink'}>
        {WORDMARK_ECO.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g className={tone === 'night' ? 'fill-brand' : 'fill-accent-text'}>
        {WORDMARK_TRACK.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  )
}

/** Mark and wordmark together. The accessible name comes from the surrounding link. */
export function Brand({ compact, className, tone = 'default' }: { compact?: boolean; className?: string; tone?: 'default' | 'night' }) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <BrandMark />
      {!compact && <Wordmark tone={tone} />}
      <span className="sr-only">EcoTrack</span>
    </span>
  )
}
