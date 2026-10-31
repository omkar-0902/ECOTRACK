import { useId } from 'react'

/**
 * Illustrations for modules the product marks as under construction. They
 * show the idea being built (a route, a chart blueprint) and never carry
 * numbers, progress percentages or anything that reads as live data.
 * Animations are CSS only (et-* keyframes in global.css) and stop under
 * prefers-reduced-motion, leaving the finished drawing.
 */

function Dots({ id }: { id: string }) {
  return (
    <>
      <defs>
        <pattern id={id} width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.1" fill="var(--et-line-strong)" />
        </pattern>
      </defs>
      <rect width="280" height="180" rx="16" fill={`url(#${id})`} opacity="0.7" />
    </>
  )
}

/** Reward System: a collection route drawing itself towards a reward marker that is still being built. */
export function RouteUnderConstruction({ className }: { className?: string }) {
  const id = useId()
  const route = 'M40 138 C 70 138 80 96 112 96 S 150 118 170 118 S 204 86 214 76'
  const nodes = [
    { x: 40, y: 138, n: 1 },
    { x: 112, y: 96, n: 2 },
    { x: 170, y: 118, n: 3 },
  ]
  return (
    <svg aria-hidden viewBox="0 0 280 180" className={className}>
      <Dots id={`${id}-dots`} />
      {/* The planned route, then the drawn part */}
      <path d={route} fill="none" stroke="var(--et-line-strong)" strokeWidth="2" strokeDasharray="4 6" strokeLinecap="round" />
      <path d={route} pathLength={1} className="et-draw" fill="none" stroke="var(--et-accent)" strokeWidth="3" strokeLinecap="round" />
      {nodes.map((p) => (
        <g key={p.n}>
          <circle cx={p.x} cy={p.y} r="8" fill="var(--et-panel)" stroke="var(--et-line-strong)" strokeWidth="1.5" />
          <circle cx={p.x} cy={p.y} r="4.5" fill="var(--et-accent)" className={`et-node-${p.n}`} />
        </g>
      ))}
      {/* Reward marker: an outline under construction */}
      <circle cx="232" cy="60" r="27" fill="var(--et-accent-soft)" />
      <circle cx="232" cy="60" r="27" fill="none" stroke="var(--et-accent-text)" strokeWidth="1.5" strokeDasharray="5 5" className="et-spin-slow" />
      <g fill="none" stroke="var(--et-accent-text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="232" cy="55" r="8" />
        <path d="M227 62 L224 74 L232 70 L240 74 L237 62" />
      </g>
    </svg>
  )
}

const BARS = [44, 70, 58, 92, 76, 104, 86]

/** Reports engine: blueprint columns rising on a chart frame, with a calibration line sweeping across. */
export function ChartUnderConstruction({ className }: { className?: string }) {
  const id = useId()
  return (
    <svg aria-hidden viewBox="0 0 280 180" className={className}>
      <Dots id={`${id}-dots`} />
      <g stroke="var(--et-line-strong)" strokeWidth="1" strokeDasharray="3 5">
        <line x1="36" y1="46" x2="252" y2="46" />
        <line x1="36" y1="96" x2="252" y2="96" />
      </g>
      <path d="M36 28 V146 H252" fill="none" stroke="var(--et-ink-3)" strokeWidth="1.5" strokeLinecap="round" />
      {BARS.map((h, i) => (
        <rect
          key={i}
          x={50 + i * 29}
          y={146 - h}
          width="18"
          height={h}
          rx="3"
          fill="var(--et-accent-soft)"
          stroke="var(--et-accent-text)"
          strokeWidth="1.25"
          strokeDasharray="3 3"
          className="et-rise"
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
      <line x1="44" y1="30" x2="44" y2="146" stroke="var(--et-accent)" strokeWidth="2" strokeLinecap="round" className="et-sweep" opacity="0.7" />
    </svg>
  )
}
