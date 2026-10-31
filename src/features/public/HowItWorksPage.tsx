import { ArrowRight, Bell, Building2, CheckCircle2, MapPin, type LucideIcon } from 'lucide-react'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { cn } from '@/lib/cn'
import { JOURNEY, TODAY_STEPS } from './site/content'
import { Container, PageHead, StatusPill } from './site/ui'
import { ConsoleCard, GeofenceMap } from './site/visuals'

const STEP_ICON: LucideIcon[] = [MapPin, Bell, CheckCircle2, Building2]

export default function HowItWorksPage() {
  return (
    <>
      <PageHead eyebrow="How it works" title="From a request to a record." body="Four steps, from the resident's doorstep to the city's record." />

      {/* The four steps */}
      <section aria-labelledby="steps-title" className="bg-canvas py-24 lg:py-28">
        <Container>
          <h2 id="steps-title" className="sr-only">
            The four steps
          </h2>
          <ol className="relative grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            <span aria-hidden className="absolute left-[12.5%] right-[12.5%] top-10 hidden h-0.5 bg-[linear-gradient(to_right,var(--pub-ring)_66%,var(--pub-forest)_66%)] lg:block" />
            {JOURNEY.map((s, i) => {
              const Icon = STEP_ICON[i]
              return (
                <li key={s.n} className="relative flex flex-col items-start lg:items-center lg:text-center">
                  <span className={cn('relative grid size-20 place-items-center rounded-full border-[6px] border-canvas', s.status === 'available' ? 'bg-[var(--pub-forest)] text-white' : 'bg-[var(--pub-mint)] text-[var(--pub-forest)]')}>
                    <Icon aria-hidden strokeWidth={1.75} className="size-8" />
                  </span>
                  <p className="mt-6 text-[14px] font-semibold text-[var(--pub-forest)]">{s.who}</p>
                  <h3 className="mt-2 flex-1 text-[22px] font-bold leading-snug text-ink">{s.title}</h3>
                  <StatusPill status={s.status} className="mt-5" />
                </li>
              )
            })}
          </ol>
        </Container>
      </section>

      {/* Service areas */}
      <section aria-labelledby="areas-title" className="bg-[var(--pub-warm)] py-24 lg:py-28">
        <Container className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-[5vw]">
          <div>
            <StatusPill status="planned" />
            <h2 id="areas-title" className="mt-6 text-[clamp(30px,3.2vw,48px)] font-bold leading-[1.08] tracking-[-0.015em] text-ink">
              Collection, organised by area.
            </h2>
            <p className="mt-5 max-w-[440px] text-[19px] leading-[1.6] text-ink-2">When the crew reaches an area with a request, residents there know it is near.</p>
          </div>
          <GeofenceMap animated />
        </Container>
      </section>

      {/* Today */}
      <section aria-labelledby="today-title" className="bg-canvas py-24 lg:py-28">
        <Container className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-[5vw]">
          <div>
            <StatusPill status="available" />
            <h2 id="today-title" className="mt-6 text-[clamp(30px,3.2vw,48px)] font-bold leading-[1.08] tracking-[-0.015em] text-ink">
              Step four works today.
            </h2>
            <ol className="mt-10 grid max-w-[560px] gap-3 sm:grid-cols-2">
              {TODAY_STEPS.map((t, i) => (
                <li key={t} className="flex items-center gap-4 rounded-xl border border-line bg-panel px-5 py-4">
                  <span className="tabular grid size-9 shrink-0 place-items-center rounded-full bg-[var(--pub-mint)] text-[15px] font-bold text-[var(--pub-forest)]">{i + 1}</span>
                  <span className="text-[16px] font-semibold text-ink">{t}</span>
                </li>
              ))}
            </ol>
          </div>
          <ConsoleCard />
        </Container>
      </section>

      <section className="pub-dark">
        <Container className="flex flex-col items-start justify-between gap-6 py-16 lg:flex-row lg:items-center">
          <p className="max-w-2xl text-[clamp(24px,2.6vw,36px)] font-bold leading-tight text-[var(--pub-on-dark)]">See every part of EcoTrack.</p>
          <ButtonLink to="/preview" variant="primary" size="lg" icon={<ArrowRight aria-hidden className="size-4" />} trailingIcon>
            See the product
          </ButtonLink>
        </Container>
      </section>
    </>
  )
}
