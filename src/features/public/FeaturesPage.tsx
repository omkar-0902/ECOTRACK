import type { ReactNode } from 'react'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { useData } from '@/store/StoreProvider'
import { useNow } from '@/hooks/useNow'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { DemoTag } from '@/components/ui/Status'
import { CollectorTable, LogTable } from '@/features/views/OpsViews'
import { cn } from '@/lib/cn'
import { NEXT, STORIES, type Story } from './site/content'
import { PhonePair } from './site/stories'
import { Container, PageHead, StatusPill } from './site/ui'
import { ProductWindow } from './site/visuals'

export default function FeaturesPage() {
  return (
    <>
      <PageHead eyebrow="Features" title="Built for the people who run collection." body="Three things city teams can do with EcoTrack today, and what comes next." />

      {STORIES.map((s, i) => (
        <StorySection key={s.id} story={s} flip={i % 2 === 1} tone={i % 2 === 1 ? 'warm' : 'white'} />
      ))}

      {/* Coming next */}
      <section aria-labelledby="next-title" className="overflow-hidden bg-[var(--pub-field)] py-24 lg:py-28">
        <Container className="grid items-center gap-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-[5vw]">
          <div>
            <StatusPill status="planned" />
            <h2 id="next-title" className="mt-6 text-[clamp(30px,3.2vw,48px)] font-bold leading-[1.08] tracking-[-0.015em] text-ink">
              Coming next: apps for residents and crews.
            </h2>
            <div className="mt-10 grid max-w-[520px] gap-8 sm:grid-cols-2">
              {[
                { who: 'Resident app', items: NEXT.resident },
                { who: 'Crew app', items: NEXT.crew },
              ].map((g) => (
                <div key={g.who}>
                  <p className="text-[15px] font-semibold text-ink">{g.who}</p>
                  <ul className="mt-3 flex flex-col gap-2 text-[15px] text-ink-2">
                    {g.items.map((t) => (
                      <li key={t} className="flex gap-2.5">
                        <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--pub-leaf)]" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <Link to="/preview?for=resident" className="mt-10 inline-flex items-center gap-1.5 text-[16px] font-semibold text-[var(--pub-forest)] hover:underline">
              See the app concepts
              <ChevronRight aria-hidden className="size-4" />
            </Link>
          </div>
          <PhonePair />
        </Container>
      </section>

      <section className="pub-dark">
        <Container className="flex flex-col items-start justify-between gap-6 py-16 lg:flex-row lg:items-center">
          <p className="max-w-2xl text-[clamp(24px,2.6vw,36px)] font-bold leading-tight text-[var(--pub-on-dark)]">See how a pickup becomes a record.</p>
          <ButtonLink to="/how-it-works" variant="primary" size="lg" icon={<ArrowRight aria-hidden className="size-4" />} trailingIcon>
            How it works
          </ButtonLink>
        </Container>
      </section>
    </>
  )
}

function StorySection({ story: s, flip, tone }: { story: Story; flip: boolean; tone: 'white' | 'warm' }) {
  return (
    <section aria-labelledby={`story-${s.id}`} className={cn('py-24 lg:py-28', tone === 'warm' ? 'bg-[var(--pub-warm)]' : 'bg-canvas')}>
      <Container className={cn('grid items-center gap-14 lg:gap-[5vw]', flip ? 'lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]' : 'lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]')}>
        <div className={cn('min-w-0', flip && 'lg:order-2')}>
          <span className="grid size-12 place-items-center rounded-xl bg-[var(--pub-mint)] text-[var(--pub-forest)]">
            <s.icon aria-hidden strokeWidth={1.75} className="size-6" />
          </span>
          <h2 id={`story-${s.id}`} className="mt-7 text-[clamp(30px,3.2vw,48px)] font-bold leading-[1.08] tracking-[-0.015em] text-ink">
            {s.title}
          </h2>
          <p className="mt-5 max-w-[460px] text-[19px] leading-[1.6] text-ink-2">{s.body}</p>
          <ul className="mt-8 flex flex-col gap-3">
            {s.points.map((p) => (
              <li key={p.text} className="flex items-center gap-3 text-[16px] font-medium text-ink">
                <p.icon aria-hidden strokeWidth={1.75} className="size-5 text-[var(--pub-forest)]" />
                {p.text}
              </li>
            ))}
          </ul>
          <StatusPill status="available" className="mt-8" />
        </div>
        <div className={cn('min-w-0', flip && 'lg:order-1')}>
          <StoryVisual id={s.id} />
        </div>
      </Container>
    </section>
  )
}

function Frame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <figure className="min-w-0 overflow-hidden rounded-2xl border border-line bg-panel shadow-[0_40px_80px_-30px_rgb(17_21_19/0.35)]">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-muted px-5 py-3">
        <figcaption className="text-[14px] font-semibold text-ink">{title}</figcaption>
        <DemoTag label="Sample data" />
      </div>
      <div className="overflow-x-auto">{children}</div>
    </figure>
  )
}

function StoryVisual({ id }: { id: Story['id'] }) {
  const logs = useData((d) => d.logs)
  const collectors = useData((d) => d.collectors)
  const now = useNow(60_000)
  if (id === 'day') return <ProductWindow mapClassName="h-[260px] sm:h-[340px]" />
  if (id === 'record')
    return (
      <Frame title="Collection records">
        <LogTable logs={[...logs].sort((a, b) => b.createdAt - a.createdAt).slice(0, 7)} now={now} showDate />
      </Frame>
    )
  return (
    <Frame title="Collector roster">
      <CollectorTable collectors={collectors.slice(0, 6)} />
    </Frame>
  )
}
