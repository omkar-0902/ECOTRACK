import type { ReactNode } from 'react'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { useData } from '@/store/StoreProvider'
import { useNow } from '@/hooks/useNow'
import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { DemoTag } from '@/components/ui/Status'
import { CollectorTable, LogTable, MetricStrip, StatusMix } from '@/features/views/OpsViews'
import { cn } from '@/lib/cn'
import { UnitMap } from '@/features/views/UnitMap'
import { REWARDS } from '@/content/original'
import { usePublicActions } from './PublicLayout'
import { COLLECTOR_FEATURES, CONSOLE_FEATURES, GEOFENCE_STEPS, RESIDENT_FEATURES } from './site/content'
import { Band, Container, Eyebrow, Heading, PageHead, StatusPill } from './site/ui'
import { GeofenceMap, ResidentPhone } from './site/visuals'

const GROUPS = [
  { label: 'For residents', count: RESIDENT_FEATURES.length, status: 'planned' as const },
  { label: 'For collectors', count: COLLECTOR_FEATURES.length, status: 'planned' as const },
  { label: 'For the municipal team', count: CONSOLE_FEATURES.filter((f) => f.status === 'available').length, status: 'available' as const },
]

export default function FeaturesPage() {
  const { openSignIn } = usePublicActions()
  const [dashboard, tracker, reports, collectors, rewards] = CONSOLE_FEATURES

  return (
    <>
      <PageHead
        eyebrow="Features"
        title={
          <>
            Every part of EcoTrack, <span className="text-[var(--pub-forest)]">and where it stands.</span>
          </>
        }
        body="Features are grouped by the person who uses them. Each group is marked: the municipal console works in this build; the resident and collector apps are described in the EcoTrack proposal and not built yet."
      >
        <ul aria-label="Feature groups" className="mt-10 grid max-w-4xl gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
          {GROUPS.map((g) => (
            <li key={g.label} className="flex items-center justify-between gap-3 bg-panel px-5 py-4">
              <span>
                <span className="block text-[15px] font-semibold text-ink">{g.label}</span>
                <span className="text-[13px] text-ink-3">{g.count} capabilities</span>
              </span>
              <StatusPill status={g.status} />
            </li>
          ))}
        </ul>
      </PageHead>

      {/* Residents */}
      <Band tone="field" labelledBy="residents-title">
        <div className="grid gap-12 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-20">
          <div className="flex justify-center lg:sticky lg:top-28 lg:self-start">
            <ResidentPhone />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Eyebrow>For residents</Eyebrow>
              <StatusPill status="planned" />
            </div>
            <Heading id="residents-title" title="A pickup on request, and a reason to take part." className="mt-3" body="The resident app, as described in the EcoTrack proposal. It turns waiting for a fixed round into a request the city can see." />
            <ol className="mt-10 flex flex-col">
              {RESIDENT_FEATURES.map((f, i) => (
                <li key={f.title} className="grid grid-cols-[48px_minmax(0,1fr)] gap-5 border-t border-[color-mix(in_srgb,var(--pub-forest)_18%,transparent)] py-6">
                  <span className="grid size-12 place-items-center rounded-full bg-panel text-[var(--pub-forest)] shadow-e1">
                    <f.icon aria-hidden strokeWidth={1.75} className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-[19px] font-bold text-ink">
                      <span className="tabular mr-2 text-[var(--pub-forest)]">{String(i + 1).padStart(2, '0')}</span>
                      {f.title}
                    </h3>
                    <p className="mt-1 text-[16px] leading-[1.55] text-ink-2">{f.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Band>

      {/* Collectors */}
      <Band labelledBy="collectors-title">
        <div className="flex flex-wrap items-center gap-3">
          <Eyebrow>For collectors</Eyebrow>
          <StatusPill status="planned" />
        </div>
        <Heading id="collectors-title" title="Routes built from real requests, not fixed rounds." className="mt-3" body="The collector side of the proposal: geofenced pickup zones on a live map, and a deliberately simple app that keeps the record current." />
        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-14">
          <GeofenceMap animated />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {COLLECTOR_FEATURES.map((f) => (
              <li key={f.title} className="flex gap-4 rounded-xl border border-line p-5">
                <f.icon aria-hidden strokeWidth={1.75} className="mt-0.5 size-6 shrink-0 text-[var(--pub-forest)]" />
                <div>
                  <h3 className="text-[17px] font-bold text-ink">{f.title}</h3>
                  <p className="mt-1 text-[15px] leading-[1.5] text-ink-2">{f.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-10 rounded-xl bg-[var(--pub-field)] p-6">
          <p className="text-[14px] font-bold text-ink">How geofencing works</p>
          <ol className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:gap-0">
            {GEOFENCE_STEPS.map((s, i) => (
              <li key={s} className="flex items-center gap-3 md:flex-1">
                <span className="flex flex-1 items-center gap-3 rounded-lg bg-panel px-4 py-3 text-[14px] font-semibold text-ink shadow-e1">
                  <span className="tabular grid size-7 shrink-0 place-items-center rounded-full bg-[var(--pub-forest)] text-[12px] font-bold text-white">{i + 1}</span>
                  {s}
                </span>
                {i < GEOFENCE_STEPS.length - 1 && <ChevronRight aria-hidden className="hidden size-5 shrink-0 text-[var(--pub-forest)] md:mx-1 md:block" />}
              </li>
            ))}
          </ol>
        </div>
      </Band>

      {/* Municipal console */}
      <Band tone="muted" labelledBy="console-title">
        <div className="flex flex-wrap items-center gap-3">
          <Eyebrow>For the municipal team</Eyebrow>
          <StatusPill status="available" />
        </div>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
          <Heading id="console-title" title="The console that runs in this build." body="Four working modules on the same collection logs and collector records. The previews below are the console's own components with the demo dataset." />
          <Button variant="primary" size="lg" onClick={openSignIn} icon={<ArrowRight aria-hidden className="size-4" />} trailingIcon>
            Sign in to the console
          </Button>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:items-start">
          <ModuleCard feature={dashboard} preview={<DashboardPreview />} />
          <ModuleCard feature={tracker} preview={<TrackerPreview />} />
          <ModuleCard feature={reports} preview={<ReportsPreview />} className="lg:col-span-2" />
          <ModuleCard feature={collectors} preview={<CollectorsPreview />} className="lg:col-span-2" />
        </div>
        <article className="mt-6 flex flex-col gap-4 rounded-xl border border-dashed border-line-strong bg-panel p-6 sm:flex-row sm:items-center">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-warn-soft text-warn-text">
            <rewards.icon aria-hidden strokeWidth={1.75} className="size-6" />
          </span>
          <div className="flex-1">
            <h3 className="text-[18px] font-bold text-ink">{rewards.title}</h3>
            <p className="mt-1 text-[15px] text-ink-2">
              Where residents' Eco Points would be managed. The console shows this module as under construction: “{REWARDS.notice.status}”.
            </p>
          </div>
          <StatusPill status="planned" />
        </article>
      </Band>

      <section className="border-t border-line bg-canvas">
        <Container className="flex flex-col items-start justify-between gap-6 py-12 lg:flex-row lg:items-center">
          <p className="max-w-2xl text-[clamp(22px,2.4vw,30px)] font-bold leading-tight text-ink">See how the three parts work together on a single pickup.</p>
          <ButtonLink to="/how-it-works" variant="primary" size="lg" icon={<ArrowRight aria-hidden className="size-4" />} trailingIcon>
            How it works
          </ButtonLink>
        </Container>
      </section>
    </>
  )
}

function ModuleCard({ feature: f, preview, className }: { feature: (typeof CONSOLE_FEATURES)[number]; preview: ReactNode; className?: string }) {
  return (
    <article className={cn('flex min-w-0 flex-col overflow-hidden rounded-xl border border-line bg-panel', className)}>
      <div className="flex items-start gap-4 p-6">
        <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-[var(--pub-mint)] text-[var(--pub-forest)]">
          <f.icon aria-hidden strokeWidth={1.75} className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[19px] font-bold text-ink">{f.title}</h3>
          <p className="mt-1 text-[15px] leading-[1.5] text-ink-2">{f.body}</p>
        </div>
        <span className="hidden sm:block">
          <DemoTag />
        </span>
      </div>
      <div className="border-t border-line bg-muted p-3">
        <div className="overflow-hidden rounded-lg border border-line bg-panel">{preview}</div>
      </div>
    </article>
  )
}

function DashboardPreview() {
  const logs = useData((d) => d.logs)
  const now = useNow(60_000)
  return (
    <>
      <MetricStrip logs={logs} now={now} compact />
      <div className="border-t border-line px-4 py-3">
        <StatusMix logs={logs} now={now} />
      </div>
    </>
  )
}

function TrackerPreview() {
  const collectors = useData((d) => d.collectors)
  return (
    <div className="relative h-[200px]">
      <UnitMap collectors={collectors} interactive={false} className="absolute inset-0" />
    </div>
  )
}

function ReportsPreview() {
  const logs = useData((d) => d.logs)
  const now = useNow(60_000)
  return <LogTable logs={[...logs].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3)} now={now} showDate />
}

function CollectorsPreview() {
  const list = useData((d) => d.collectors)
  return <CollectorTable collectors={list.slice(0, 3)} />
}

