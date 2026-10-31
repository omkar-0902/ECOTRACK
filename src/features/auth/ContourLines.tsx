import { cn } from '@/lib/cn'

// Flowing contour lines behind the sign-in panel: a topographic nod to the
// field work EcoTrack supports. Generated once; purely decorative.
const CONTOURS = Array.from({ length: 22 }, (_, i) => {
  const y = 430 + i * 15
  return `M -60 ${y} C 320 ${y - 190 + i * 7} 720 ${y + 170 - i * 5} 1080 ${y - 30} S 1480 ${y - 210 + i * 6} 1700 ${y - 70}`
})

export function ContourLines({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}>
      <g fill="none" stroke="white" strokeOpacity="0.075" strokeWidth="1" vectorEffect="non-scaling-stroke">
        {CONTOURS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  )
}
