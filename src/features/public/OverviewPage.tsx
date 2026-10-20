import { ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { usePublicActions } from './PublicLayout'
import { AUDIENCES, COLLECTOR_FEATURES, CONSOLE_FEATURES, IMPACT, PRINCIPLES, PROBLEMS, PRODUCT_LINE, RESIDENT_FEATURES, TAGLINE } from './site/content'
import { Band, Container, Eyebrow, Heading, StatusPill } from './site/ui'
import { ConsoleCard, GeofenceMap, ResidentPhone } from './site/visuals'

const WHAT_THEY_DO: Record<(typeof AUDIENCES)[number]['id'], string[]> = {
  residents: RESIDENT_FEATURES.map((f) => f.title),
  collectors: COLLECTOR_FEATURES.map((f) => f.title),
  municipal: CONSOLE_FEATURES.filter((f) => f.status === 'available').map((f) => f.title),
}

export default function OverviewPage() {
  const { openSignIn } = usePublicActions()

  return (
    <>
      {/* Hero: the promise, and the three parts that deliver it */}
      <section className="relative overflow-hidden border-b border-line bg-canvas">
        <div aria-hidden className="pub-grid absolute inset-y-0 right-0 hidden w-[52%] [mask-image:linear-gradient(to_right,transparent,black_30%)] lg:block" />
        <Container className="relative grid items-center gap-14 py-14 sm:py-16 lg:min-h-[calc(100dvh-68px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12 lg:py-16">
          <div className="min-w-0">
            <Eyebrow>EcoTrack · {PRODUCT_LINE}</Eyebrow>
            <h1 className="mt-5 text-[clamp(38px,4.6vw,62px)] font-bold leading-[1.04] text-ink">
              Right pickup, at the right place, <span className="text-[var(--pub-forest)]">at the right time.</span>
            </h1>
            <p className="mt-6 max-w-[560px] text-[18px] leading-[1.6] text-ink-2">
              EcoTrack connects the three people behind every collection: the resident who needs a pickup, the collector on the route, and the municipal team that answers for the result.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to="/how-it-works" variant="primary" size="lg" icon={<ArrowRight aria-hidden className="size-4" />} trailingIcon>
                See how it works
              </ButtonLink>
              <Button variant="secondary" size="lg" onClick={openSignIn}>
                Sign in to the console
              </Button>
            </div>
            <ul aria-label="What exists today" className="mt-10 grid max-w-[560px] gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
              {AUDIENCES.map((a) => (
                <li key={a.id} className="flex flex-col gap-2 bg-panel px-4 py-3.5">
                  <span className="text-[14px] font-semibold text-ink">{a.product}</span>
                  <StatusPill status={a.status} className="self-start" />
                </li>
              ))}
            </ul>
          </div>

          <HeroStage />
        </Container>
      </section>

      {/* Problem statement, slide 2 */}
      <Band labelledBy="problems-title">
        <Heading id="problems-title" eyebrow="The problem" title="Waste collection breaks down in five places." body="Each one is felt on the street long before it shows up in a report." />
        <ol className="mt-12 grid overflow-hidden rounded-xl border border-line sm:grid-cols-2 lg:grid-cols-5">
          {PROBLEMS.map((p, i) => (
            <li key={p.title} className="flex flex-col border-b border-line p-6 last:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0 lg:[&:nth-child(odd)]:border-r">
              <span className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-full bg-crit-soft text-crit-text">
                  <p.icon aria-hidden strokeWidth={1.75} className="size-5" />
                </span>
                <span className="tabular text-[13px] font-semibold text-ink-3">{String(i + 1).padStart(2, '0')}</span>
              </span>
              <h3 className="mt-5 text-[18px] font-bold text-ink">{p.title}</h3>
              <p className="mt-1.5 text-[15px] leading-[1.55] text-ink-2">{p.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 rounded-xl bg-muted px-6 py-4 text-[16px] text-ink">
          <span className="font-bold">The impact: </span>
          {IMPACT}
        </p>
      </Band>

      {/* The three people, slide 4 */}
      <Band tone="field" labelledBy="people-title">
        <Heading id="people-title" eyebrow="Who it's for" title="One system, three people." body="EcoTrack is designed around the people who make a collection happen, with a part of the product for each." />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {AUDIENCES.map((a) => (
            <article key={a.id} className="flex flex-col rounded-xl border border-line bg-panel p-7">
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-12 place-items-center rounded-xl bg-[var(--pub-mint)] text-[var(--pub-forest)]">
                  <a.icon aria-hidden strokeWidth={1.75} className="size-6" />
                </span>
                <StatusPill status={a.status} />
              </div>
              <h3 className="mt-5 text-[22px] font-bold text-ink">{a.name}</h3>
              <p className="mt-1.5 text-[15px] leading-[1.55] text-ink-2">{a.need}</p>
              <p className="mt-6 text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-3">{a.product}</p>
              <ul className="mt-3 flex flex-col gap-2.5 border-t border-line pt-4">
                {WHAT_THEY_DO[a.id].map((t) => (
                  <li key={t} className="flex gap-2.5 text-[15px] text-ink">
                    <Check aria-hidden strokeWidth={2.5} className="mt-1 size-4 shrink-0 text-[var(--pub-forest)]" />
                    {t}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <ButtonLink to="/features" variant="outline" size="lg" className="mt-10" icon={<ArrowRight aria-hidden className="size-4" />} trailingIcon>
          Explore the features
        </ButtonLink>
      </Band>

      {/* Design goals, slides 6 and 10 */}
      <Band labelledBy="principles-title">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <Heading id="principles-title" eyebrow="Design goals" title="Made for the cities that need it most." body="The proposal sets out how EcoTrack should work in practice. These are design goals, not measured results." />
          <ul className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <li key={p.title} className="bg-panel p-7">
                <p.icon aria-hidden strokeWidth={1.75} className="size-6 text-[var(--pub-forest)]" />
                <h3 className="mt-4 text-[18px] font-bold text-ink">{p.title}</h3>
                <p className="mt-1.5 text-[15px] leading-[1.55] text-ink-2">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Band>

      {/* Closing */}
      <section className="border-t border-line bg-[var(--pub-field)]">
        <Container className="flex flex-col items-start justify-between gap-6 py-12 lg:flex-row lg:items-center">
          <div>
            <p className="text-[clamp(22px,2.4vw,30px)] font-bold leading-tight text-ink">See the parts of EcoTrack side by side.</p>
            <p className="mt-2 text-[16px] text-ink-2">{TAGLINE}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink to="/preview" variant="primary" size="lg" icon={<ArrowRight aria-hidden className="size-4" />} trailingIcon>
              Open the preview
            </ButtonLink>
            <Button variant="secondary" size="lg" onClick={openSignIn}>
              Sign in
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}

/** Geofence concept map, with the resident app concept beside it and the real console beneath. */
function HeroStage() {
  return (
    <div className="relative min-w-0 lg:pb-[150px] lg:pl-[132px]">
      <div>
        <GeofenceMap legend={false} animated />
        <p className="mt-2 text-right text-[12px] text-ink-3">Collector geofencing concept · Planned</p>
      </div>
      <div className="mt-8 flex flex-col items-center gap-8 sm:flex-row sm:items-end lg:mt-0">
        <ResidentPhone className="lg:absolute lg:-left-6 lg:top-14 lg:w-[196px]" />
        <div className="w-full min-w-0 lg:absolute lg:bottom-0 lg:right-0 lg:w-[70%]">
          <ConsoleCard />
          <p className="mt-2 flex items-center gap-2 text-[12px] text-ink-3">
            <StatusPill status="available" /> Municipal console, demo data
          </p>
        </div>
      </div>
    </div>
  )
}
