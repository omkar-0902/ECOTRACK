import { ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { usePublicActions } from './PublicLayout'
import {
  AUDIENCES,
  CLOSING_LINE,
  COLLECTOR_FEATURES,
  CONSOLE_FEATURES,
  COST_ADVANTAGES,
  IMPACT,
  MACRO_STATS,
  MARKET_SCOPE,
  OUTCOMES_KPIS,
  PRINCIPLES,
  PROBLEMS,
  PRODUCT_LINE,
  RESIDENT_FEATURES,
  TEAM_CREDIT,
} from './site/content'
import { Band, Container, Eyebrow, Heading, StatusPill } from './site/ui'
import { CitySkylineBackdrop, ConsoleCard, FinancialImpactWidget, GeofenceMap, ResidentPhone } from './site/visuals'

const WHAT_THEY_DO: Record<(typeof AUDIENCES)[number]['id'], string[]> = {
  residents: RESIDENT_FEATURES.map((f) => f.title),
  collectors: COLLECTOR_FEATURES.map((f) => f.title),
  municipal: CONSOLE_FEATURES.filter((f) => f.status === 'available').map((f) => f.title),
}

export default function OverviewPage() {
  const { openSignIn } = usePublicActions()

  return (
    <>
      {/* Hero: The promise and the three-stakeholder bridge */}
      <section className="relative overflow-hidden border-b border-line bg-canvas">
        <div aria-hidden className="pub-grid absolute inset-y-0 right-0 hidden w-[54%] [mask-image:linear-gradient(to_right,transparent,black_25%)] lg:block" />
        <CitySkylineBackdrop />
        <Container className="relative grid items-center gap-12 py-12 sm:py-16 lg:min-h-[calc(100dvh-68px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14 lg:py-16">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <Eyebrow>EcoTrack · {PRODUCT_LINE}</Eyebrow>
              <span className="rounded-md border border-line bg-muted px-2 py-0.5 text-[11px] font-semibold text-ink-3">
                {TEAM_CREDIT}
              </span>
            </div>

            <h1 className="mt-4 text-[clamp(36px,4.4vw,60px)] font-extrabold leading-[1.05] tracking-tight text-ink">
              Right pickup, at the right place, <span className="text-[var(--pub-forest)]">at the right time.</span>
            </h1>

            <p className="mt-5 max-w-[560px] text-[17px] leading-[1.6] text-ink-2">
              EcoTrack connects the three people behind every municipal collection: the resident who requests a pickup, the collector on the route, and the city authority answering for the result.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to="/how-it-works" variant="primary" size="lg" icon={<ArrowRight aria-hidden className="size-4" />} trailingIcon>
                See how it works
              </ButtonLink>
              <Button variant="secondary" size="lg" onClick={openSignIn}>
                Sign in to the console
              </Button>
            </div>

            {/* Macro Stats from Slide 2 */}
            <div className="mt-10 grid max-w-[580px] grid-cols-3 divide-x divide-line rounded-xl border border-line bg-panel p-2 shadow-xs">
              {MACRO_STATS.map((s) => (
                <div key={s.label} className="px-3.5 py-2">
                  <p className="tabular text-[20px] sm:text-[24px] font-extrabold text-[var(--pub-forest)]">{s.value}</p>
                  <p className="text-[12px] font-semibold text-ink leading-tight">{s.label}</p>
                  <p className="mt-0.5 text-[10px] text-ink-3 leading-tight hidden sm:block">{s.note}</p>
                </div>
              ))}
            </div>

            {/* What exists today indicators */}
            <ul aria-label="Product readiness" className="mt-6 grid max-w-[580px] gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
              {AUDIENCES.map((a) => (
                <li key={a.id} className="flex flex-col gap-1.5 bg-panel px-3.5 py-2.5">
                  <span className="text-[13px] font-semibold text-ink">{a.product}</span>
                  <StatusPill status={a.status} className="self-start text-[11px]" />
                </li>
              ))}
            </ul>
          </div>

          <HeroStage />
        </Container>
      </section>

      {/* Problem Statement — Slide 2 */}
      <Band labelledBy="problems-title">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Heading
            id="problems-title"
            eyebrow="The problem · Slide 2"
            title="Waste collection breaks down in five places."
            body="Manual scheduling, disconnected teams, and lack of real-time visibility turn urban waste management into a costly, inefficient crisis."
          />
          <div className="rounded-xl border border-crit-soft bg-crit-soft/30 px-5 py-3 text-right">
            <span className="text-[12px] font-bold uppercase tracking-wider text-crit-text">National Scale Deficit</span>
            <p className="tabular text-[26px] font-black text-crit-text">25% Missed</p>
            <p className="text-[12px] text-ink-3">Pickups skipped under blind rounds</p>
          </div>
        </div>

        <ol className="mt-10 grid overflow-hidden rounded-xl border border-line sm:grid-cols-2 lg:grid-cols-5">
          {PROBLEMS.map((p, i) => (
            <li
              key={p.title}
              className="flex flex-col border-b border-line p-6 last:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0"
            >
              <span className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-full bg-crit-soft text-crit-text">
                  <p.icon aria-hidden strokeWidth={1.75} className="size-5" />
                </span>
                <span className="tabular text-[13px] font-semibold text-ink-3">0{i + 1}</span>
              </span>
              <h3 className="mt-5 text-[17px] font-bold text-ink">{p.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.55] text-ink-2">{p.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl bg-muted px-6 py-4 border border-line">
          <p className="text-[15px] text-ink">
            <span className="font-bold text-ink">Operational Impact: </span>
            {IMPACT}
          </p>
          <span className="shrink-0 rounded-md bg-panel px-3 py-1 text-[13px] font-semibold text-crit-text border border-line">
            ₹22.5L monthly municipal drain per city
          </span>
        </div>
      </Band>

      {/* Financial Impact Model — Slide 7 & 8 */}
      <Band tone="field" labelledBy="financial-title">
        <Heading
          id="financial-title"
          eyebrow="Financial Impact & Cost Advantage · Slides 7 & 8"
          title="From daily operational drain to measurable municipal savings."
          body="Eliminating blind rounds and sensor hardware drastically reduces re-dispatch expenses and truck fuel consumption."
        />

        <div className="mt-10">
          <FinancialImpactWidget />
        </div>

        {/* 4 Cost Advantages */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {COST_ADVANTAGES.map((c) => (
            <div key={c.title} className="rounded-xl border border-line bg-panel p-5 shadow-xs">
              <span className="grid size-10 place-items-center rounded-lg bg-[var(--pub-mint)] text-[var(--pub-forest)]">
                <c.icon aria-hidden strokeWidth={1.75} className="size-5" />
              </span>
              <h4 className="mt-3.5 text-[16px] font-bold text-ink">{c.title}</h4>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-2">{c.body}</p>
            </div>
          ))}
        </div>
      </Band>

      {/* Target Market Personas — Slide 4 */}
      <Band labelledBy="people-title">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Heading
            id="people-title"
            eyebrow="Target Personas · Slide 4"
            title="One coordinated platform. Three distinct stakeholders."
            body="Every tier of the waste collection loop has dedicated tooling designed for their specific operating environment."
          />
          <ButtonLink to="/features" variant="outline" size="lg" icon={<ArrowRight aria-hidden className="size-4" />} trailingIcon>
            Explore all capabilities
          </ButtonLink>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {AUDIENCES.map((a) => (
            <article key={a.id} className="flex flex-col justify-between rounded-xl border border-line bg-panel p-7 shadow-xs">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-12 place-items-center rounded-xl bg-[var(--pub-mint)] text-[var(--pub-forest)]">
                    <a.icon aria-hidden strokeWidth={1.75} className="size-6" />
                  </span>
                  <StatusPill status={a.status} />
                </div>
                <h3 className="mt-5 text-[21px] font-bold text-ink">{a.name}</h3>
                <p className="mt-2 text-[14px] leading-[1.55] text-ink-2">{a.need}</p>
                <div className="mt-4 rounded-lg bg-muted px-3.5 py-2.5 text-[12px] text-ink-2">
                  <span className="font-semibold text-ink">Deck Focus: </span>
                  {a.focus}
                </div>
              </div>

              <div className="mt-6 border-t border-line pt-4">
                <p className="text-[12px] font-bold uppercase tracking-wider text-ink-3">{a.product}</p>
                <ul className="mt-2.5 flex flex-col gap-2">
                  {WHAT_THEY_DO[a.id].map((t) => (
                    <li key={t} className="flex items-start gap-2 text-[14px] text-ink">
                      <Check aria-hidden strokeWidth={2.5} className="mt-0.5 size-4 shrink-0 text-[var(--pub-forest)]" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        {/* Market Scope / Drivers from Slide 4 */}
        <div className="mt-8 rounded-xl border border-line bg-muted p-6">
          <p className="text-[13px] font-bold uppercase tracking-wider text-[var(--pub-forest)]">
            Market Scope & Nationwide Tailwinds (Slide 4)
          </p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {MARKET_SCOPE.map((m) => (
              <div key={m.title}>
                <h4 className="text-[15px] font-bold text-ink">{m.title}</h4>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-2">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Band>

      {/* Feasibility & Design Goals — Slide 6 & 10 */}
      <Band tone="field" labelledBy="principles-title">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16 items-center">
          <div>
            <Heading
              id="principles-title"
              eyebrow="Implementation Feasibility · Slide 6"
              title="Engineered for real-world Indian city constraints."
              body="No expensive IoT hardware, zero custom sensors, and resilient under poor mobile network coverage. Built to scale rapidly across municipal corporations."
            />
            <div className="mt-6 rounded-xl border border-line bg-panel p-5">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[var(--pub-forest)]">
                Slide 10 · Adoption Strategy
              </span>
              <p className="mt-1 text-[14px] leading-relaxed text-ink-2">
                Start with a single municipal zone pilot to prove verifiable collection rate and cost KPIs, then expand corporately under established municipal contracts.
              </p>
            </div>
          </div>

          <ul className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 shadow-xs">
            {PRINCIPLES.map((p) => (
              <li key={p.title} className="bg-panel p-6">
                <p.icon aria-hidden strokeWidth={1.75} className="size-6 text-[var(--pub-forest)]" />
                <h4 className="mt-3.5 text-[17px] font-bold text-ink">{p.title}</h4>
                <p className="mt-1.5 text-[14px] leading-[1.5] text-ink-2">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Band>

      {/* Slide 9 Target Outcomes & Measurable KPIs */}
      <Band labelledBy="outcomes-title">
        <Heading
          id="outcomes-title"
          eyebrow="Target Outcomes · Slide 9"
          title="Verifiable efficiency improvements across the city."
          body="Projected outcomes achieved by closing the loop between citizen request and verified municipal collection."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {OUTCOMES_KPIS.map((o) => (
            <div key={o.label} className="rounded-xl border border-line bg-panel p-6 shadow-xs flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[var(--pub-mint)] text-[var(--pub-forest)]">
                <o.icon aria-hidden strokeWidth={1.75} className="size-6" />
              </span>
              <div>
                <p className="tabular text-[24px] font-extrabold text-[var(--pub-forest)]">{o.metric}</p>
                <h4 className="text-[16px] font-bold text-ink">{o.label}</h4>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-2">{o.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Band>

      {/* Closing Call to Action */}
      <section className="border-t border-line bg-canvas">
        <Container className="flex flex-col items-start justify-between gap-6 py-14 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-[clamp(22px,2.4vw,32px)] font-bold leading-tight text-ink">
              Experience the EcoTrack platform across every touchpoint.
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
              {CLOSING_LINE}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink to="/preview" variant="primary" size="lg" icon={<ArrowRight aria-hidden className="size-4" />} trailingIcon>
              Open interactive preview
            </ButtonLink>
            <Button variant="secondary" size="lg" onClick={openSignIn}>
              Sign in to console
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}

/** Geofence concept map, with resident app concept beside it and real console beneath */
function HeroStage() {
  return (
    <div className="relative min-w-0 lg:pb-[140px] lg:pl-[120px]">
      <div>
        <GeofenceMap legend={false} animated />
        <p className="mt-2 text-right text-[12px] text-ink-3">Collector geofencing radar · Deck Slide 3</p>
      </div>
      <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:items-end lg:mt-0">
        <ResidentPhone className="lg:absolute lg:-left-4 lg:top-10 lg:w-[208px]" />
        <div className="w-full min-w-0 lg:absolute lg:bottom-0 lg:right-0 lg:w-[74%]">
          <ConsoleCard />
          <p className="mt-2 flex items-center gap-2 text-[12px] text-ink-3">
            <StatusPill status="available" /> Municipal console · Live interactive demo data
          </p>
        </div>
      </div>
    </div>
  )
}

