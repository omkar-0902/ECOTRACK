import { ArrowRight, Building2, Radar, Truck, UserRound, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { WORKFLOW } from '@/content/product'
import { cn } from '@/lib/cn'
import { usePublicActions } from './PublicLayout'
import { FLOW, GEOFENCE_STEPS } from './site/content'
import { Band, Container, Eyebrow, Heading, PageHead, StatusPill } from './site/ui'
import { GeofenceMap } from './site/visuals'

const LANES: { role: (typeof FLOW)[number]['role']; label: string; icon: LucideIcon }[] = [
  { role: 'Resident', label: 'Resident', icon: UserRound },
  { role: 'System', label: 'Geofence', icon: Radar },
  { role: 'Collector', label: 'Collector', icon: Truck },
  { role: 'Municipal', label: 'Municipal team', icon: Building2 },
]

/** What each person experiences at each geofencing stage (slide 3). */
const GEOFENCE_DETAIL = [
  'The resident drops a pin where the waste is and requests a pickup.',
  'The collector’s truck crosses into the geofenced zone around that pin.',
  'The resident gets an automatic “collector is near” notification.',
  'The waste is brought out while the truck is still in the zone.',
  'The pickup is confirmed, closing the request for both sides.',
]

export default function HowItWorksPage() {
  const { openSignIn } = usePublicActions()
  return (
    <>
      <PageHead
        eyebrow="How it works"
        title={
          <>
            One pickup, <span className="text-[var(--pub-forest)]">followed from request to record.</span>
          </>
        }
        body="The EcoTrack proposal describes five steps that pass a single pickup between the resident, the geofence, the collector and the municipal team. Here is who does what, and which part runs in this build today."
      />

      {/* Swimlanes */}
      <Band labelledBy="flow-title">
        <Heading id="flow-title" eyebrow="The flow" title="Who acts at each step" />

        {/* Desktop: lanes by role, steps by column */}
        <div className="mt-12 hidden overflow-hidden rounded-xl border border-line lg:block">
          <div className="grid grid-cols-[180px_repeat(5,minmax(0,1fr))] border-b border-line bg-muted">
            <div className="px-5 py-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-3">Step</div>
            {FLOW.map((s, i) => (
              <div key={s.n} className="relative flex items-center justify-center py-4">
                {i > 0 && <span aria-hidden className="absolute left-0 right-1/2 top-1/2 h-0.5 bg-[var(--pub-ring)]" />}
                {i < FLOW.length - 1 && <span aria-hidden className="absolute left-1/2 right-0 top-1/2 h-0.5 bg-[var(--pub-ring)]" />}
                <span className="tabular relative grid size-9 place-items-center rounded-full bg-[var(--pub-forest)] text-[15px] font-bold text-white">{s.n}</span>
              </div>
            ))}
          </div>
          <div role="list" aria-label="Steps by role">
            {LANES.map((lane, li) => (
              <div key={lane.role} className={cn('grid grid-cols-[180px_repeat(5,minmax(0,1fr))]', li > 0 && 'border-t border-line', li % 2 === 1 ? 'bg-[var(--pub-field)]' : 'bg-canvas')}>
                <div className="flex items-center gap-3 border-r border-line px-5 py-6">
                  <span className="grid size-9 place-items-center rounded-lg bg-[var(--pub-mint)] text-[var(--pub-forest)]">
                    <lane.icon aria-hidden strokeWidth={1.75} className="size-[18px]" />
                  </span>
                  <span className="text-[15px] font-bold text-ink">{lane.label}</span>
                </div>
                {FLOW.map((s) =>
                  s.role === lane.role ? (
                    <div key={s.n} role="listitem" className="p-3">
                      <article className="h-full rounded-lg border border-line bg-panel p-4 shadow-e1">
                        <p className="sr-only">
                          Step {s.n}, {lane.label}:
                        </p>
                        <h3 className="text-[16px] font-bold leading-snug text-ink">{s.title}</h3>
                        <p className="mt-1.5 text-[14px] leading-[1.5] text-ink-2">{s.body}</p>
                        <StatusPill status={s.status} className="mt-3" />
                      </article>
                    </div>
                  ) : (
                    <div key={s.n} aria-hidden />
                  ),
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile and tablet: the same steps in order, tagged by role */}
        <ol className="mt-10 flex flex-col gap-4 lg:hidden">
          {FLOW.map((s) => {
            const lane = LANES.find((l) => l.role === s.role)!
            return (
              <li key={s.n} className="grid grid-cols-[40px_minmax(0,1fr)] gap-4">
                <span className="tabular grid size-10 place-items-center rounded-full bg-[var(--pub-forest)] text-[15px] font-bold text-white">{s.n}</span>
                <article className="rounded-lg border border-line bg-panel p-4">
                  <p className="flex items-center gap-2 text-[13px] font-semibold text-[var(--pub-forest)]">
                    <lane.icon aria-hidden className="size-4" />
                    {lane.label}
                  </p>
                  <h3 className="mt-1 text-[17px] font-bold text-ink">{s.title}</h3>
                  <p className="mt-1 text-[15px] text-ink-2">{s.body}</p>
                  <StatusPill status={s.status} className="mt-3" />
                </article>
              </li>
            )
          })}
        </ol>
      </Band>

      {/* Geofencing, slide 3 */}
      <Band tone="field" labelledBy="geofence-title">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Eyebrow>Inside steps 1 to 4</Eyebrow>
              <StatusPill status="planned" />
            </div>
            <Heading id="geofence-title" className="mt-3" title="How the geofence ties the resident to the truck." />
            <ol className="mt-8 flex flex-col gap-4">
              {GEOFENCE_STEPS.map((s, i) => (
                <li key={s} className="grid grid-cols-[32px_minmax(0,1fr)] gap-4">
                  <span className="tabular grid size-8 place-items-center rounded-full border-2 border-[var(--pub-forest)] text-[13px] font-bold text-[var(--pub-forest)]">{i + 1}</span>
                  <div>
                    <h3 className="text-[17px] font-bold text-ink">{s}</h3>
                    <p className="mt-0.5 text-[15px] leading-[1.5] text-ink-2">{GEOFENCE_DETAIL[i]}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <GeofenceMap animated className="rounded-xl bg-canvas p-3 shadow-e2" />
        </div>
      </Band>

      {/* What runs today */}
      <Band labelledBy="today-title">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Eyebrow>Step 5, today</Eyebrow>
              <StatusPill status="available" />
            </div>
            <Heading id="today-title" className="mt-3" title="What the municipal console does in this build." body="Without the resident and collector apps, the console works from the collection logs and collector records it holds: a labelled demo dataset stored in your browser." />
            <Button variant="primary" size="lg" className="mt-8" onClick={openSignIn} icon={<ArrowRight aria-hidden className="size-4" />} trailingIcon>
              Sign in to the console
            </Button>
          </div>
          <ol className="overflow-hidden rounded-xl border border-line">
            {WORKFLOW.map((s, i) => (
              <li key={s.title} className="flex items-start gap-4 border-b border-line bg-panel px-6 py-5 last:border-b-0">
                <span className="tabular mt-0.5 text-[14px] font-bold text-[var(--pub-forest)]">{String(i + 1).padStart(2, '0')}</span>
                <div className="flex-1">
                  <h3 className="text-[17px] font-bold text-ink">{s.title}</h3>
                  <p className="mt-0.5 text-[15px] text-ink-2">{s.body}</p>
                </div>
                <span className="hidden shrink-0 rounded-md bg-muted px-2.5 py-1 text-[12px] font-medium text-ink-2 sm:block">{s.where}</span>
              </li>
            ))}
          </ol>
        </div>
      </Band>

      <section className="border-t border-line bg-[var(--pub-field)]">
        <Container className="flex flex-col items-start justify-between gap-6 py-12 lg:flex-row lg:items-center">
          <p className="max-w-2xl text-[clamp(22px,2.4vw,30px)] font-bold leading-tight text-ink">See the resident app concept and the console side by side.</p>
          <ButtonLink to="/preview" variant="primary" size="lg" icon={<ArrowRight aria-hidden className="size-4" />} trailingIcon>
            Open the preview
          </ButtonLink>
        </Container>
      </section>
    </>
  )
}
