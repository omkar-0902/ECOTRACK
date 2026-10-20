/**
 * Building blocks for the public site. Pages alternate white and muted
 * sections between a night hero and a night call-to-action band.
 */
import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { cn } from '@/lib/cn'

/** The shared 1280px content column. */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8', className)}>{children}</div>
}

// Flowing contour lines behind night surfaces: a topographic nod to the field
// work EcoTrack supports. Generated once; purely decorative.
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

/** Small boxed label that opens a hero, on night surfaces. */
export function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2.5 rounded-lg border border-night-line bg-night-2 px-4 py-2 text-[14px] font-semibold leading-5 text-on-night">
      <span aria-hidden className="size-2 rounded-[2px] bg-brand" />
      {children}
    </p>
  )
}

/** Uppercase section label on light surfaces. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('text-[13px] font-semibold uppercase leading-4 tracking-[0.1em] text-accent-text', className)}>{children}</p>
}

/** A full-width page band. */
export function Section({ tone = 'white', children, className, labelledBy }: { tone?: 'white' | 'muted'; children: ReactNode; className?: string; labelledBy?: string }) {
  return (
    <section aria-labelledby={labelledBy} className={cn('py-16 lg:py-24', tone === 'muted' ? 'bg-muted' : 'bg-canvas', className)}>
      <Container>{children}</Container>
    </section>
  )
}

export function SectionHeading({ id, eyebrow, title, body, align = 'center', className }: { id?: string; eyebrow?: string; title: ReactNode; body?: ReactNode; align?: 'center' | 'left'; className?: string }) {
  return (
    <div className={cn(align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl', className)}>
      {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
      <h2 id={id} className="text-h2 text-ink">
        {title}
      </h2>
      {body && <p className={cn('mt-4 text-lead text-ink-2', align === 'center' && 'mx-auto max-w-2xl')}>{body}</p>}
    </div>
  )
}

/** Night page opener with the contour texture. */
export function NightBand({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cn('on-night relative isolate overflow-hidden bg-night', className)}>
      <ContourLines className="-z-10" />
      {children}
    </section>
  )
}

/** Closing call to action, shared by every public page. */
export function CtaBand({ title, body, onPrimary, secondary }: { title: string; body: string; onPrimary: () => void; secondary?: { to: string; label: string } }) {
  return (
    <NightBand>
      <Container className="flex flex-col items-center py-16 text-center lg:py-20">
        <h2 className="max-w-3xl text-h2 text-on-night">{title}</h2>
        <p className="mt-4 max-w-2xl text-lead text-on-night-2">{body}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button variant="primary" size="xl" onClick={onPrimary} icon={<ArrowRight aria-hidden className="size-[18px]" />} trailingIcon>
            Get started
          </Button>
          {secondary && (
            <ButtonLink to={secondary.to} variant="light" size="xl">
              {secondary.label}
            </ButtonLink>
          )}
        </div>
      </Container>
    </NightBand>
  )
}
