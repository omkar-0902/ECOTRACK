import { Link } from 'react-router'
import { ArrowRight, ChevronRight, ClipboardCheck, LayoutGrid, Map } from 'lucide-react'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { HERO, MISSION, NEXT, PRINCIPLES, PRODUCT_LINE } from './site/content'
import { enquiryChannel } from './site/config'
import { ContactForm } from './site/contact'
import { HeroShowcase } from './site/showcase'
import { ConsoleDemo, PhonePair, StatusKey, StreetAccounted, StreetRecord } from './site/stories'
import { Container, Eyebrow, StatusPill } from './site/ui'

const H2 = 'text-[clamp(32px,3.6vw,56px)] font-bold leading-[1.05] tracking-[-0.02em]'

export default function OverviewPage() {
  const canContact = enquiryChannel() !== null

  return (
    <>
      {/* Hero: the message, then the product family it describes */}
      <section className="pub-hero relative overflow-hidden">
        <div aria-hidden className="pub-streets absolute inset-y-0 right-0 w-full [mask-image:radial-gradient(ellipse_65%_80%_at_72%_50%,black_15%,transparent_75%)] lg:w-[70%]" />
        <Container className="relative grid items-center gap-12 pb-16 pt-12 sm:pt-16 lg:min-h-[min(calc(100dvh-68px),780px)] lg:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)] lg:gap-[3.5vw] lg:py-[clamp(32px,5vh,64px)]">
          <div className="min-w-0">
            <Eyebrow dark>{PRODUCT_LINE}</Eyebrow>
            <h1 className="mt-6 text-[clamp(44px,4.2vw,74px)] font-bold leading-[1] tracking-[-0.025em] text-[var(--pub-on-dark)]">
              {HERO.title[0]} <span className="text-[var(--pub-leaf-text)]">{HERO.title[1]}</span>
            </h1>
            <p className="mt-7 max-w-[520px] text-[clamp(17px,1.15vw,20px)] leading-[1.6] text-[var(--pub-on-dark-2)]">{HERO.body}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              {canContact ? (
                <a href="#contact" className="inline-flex h-12 items-center gap-2 rounded-lg bg-accent px-6 text-[15px] font-medium text-accent-ink transition-colors hover:bg-accent-hover">
                  Request a demo
                  <ArrowRight aria-hidden className="size-4" />
                </a>
              ) : (
                <ButtonLink to="/preview" variant="primary" size="lg" icon={<ArrowRight aria-hidden className="size-4" />} trailingIcon>
                  See the product
                </ButtonLink>
              )}
              <ButtonLink to={canContact ? '/preview' : '/how-it-works'} variant="light" size="lg">
                {canContact ? 'See the product' : 'How it works'}
              </ButtonLink>
            </div>
            <dl className="mt-10 grid max-w-[460px] grid-cols-2 gap-px overflow-hidden rounded-xl border border-[var(--pub-dark-line)] bg-[var(--pub-dark-line)] text-[14px]">
              <div className="bg-[var(--pub-charcoal)] px-4 py-3">
                <dt className="text-[var(--pub-on-dark-3)]">Available now</dt>
                <dd className="mt-0.5 font-semibold text-[var(--pub-on-dark)]">Municipal console</dd>
              </div>
              <div className="bg-[var(--pub-charcoal)] px-4 py-3">
                <dt className="text-[var(--pub-on-dark-3)]">Planned</dt>
                <dd className="mt-0.5 font-semibold text-[var(--pub-on-dark)]">Resident and crew apps</dd>
              </div>
            </dl>
          </div>

          <HeroShowcase />
        </Container>
      </section>

      {/* The everyday question */}
      <section aria-labelledby="question-title" className="bg-[var(--pub-warm)] py-24 lg:py-32">
        <Container>
          <div className="mb-14 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
            <h2 id="question-title" className={`${H2} text-ink`}>
              Was it collected?
            </h2>
            <p className="max-w-[560px] text-[19px] leading-[1.6] text-ink-2">Missed pickups go unnoticed until the waste piles up. EcoTrack gives every street a record.</p>
          </div>
          <StreetRecord />
          <div className="mt-6">
            <StatusKey />
          </div>
          <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[15px] text-ink-2">
            <StatusPill status="planned" />
            Residents checking their own pickup is part of the planned resident app.
            <Link to="/preview?for=resident" className="inline-flex items-center gap-1 font-semibold text-[var(--pub-forest)] hover:underline">
              See the concept
              <ChevronRight aria-hidden className="size-4" />
            </Link>
          </p>
        </Container>
      </section>

      {/* The product */}
      <section aria-labelledby="console-title" className="bg-[var(--pub-warm)] px-2 pb-2 sm:px-3 sm:pb-3 lg:px-4 lg:pb-4">
        <div className="pub-night relative overflow-hidden rounded-[20px] py-24 sm:rounded-[28px] lg:py-32">
          <div aria-hidden className="pub-streets absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_60%)]" />
          <Container className="relative">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-8">
              <div className="max-w-[760px]">
                <h2 id="console-title" className={`${H2} text-[var(--pub-on-dark)]`}>
                  Your whole collection day, <span className="text-[var(--pub-leaf-text)]">on one screen.</span>
                </h2>
              </div>
              <ul className="flex flex-wrap gap-x-7 gap-y-3 text-[16px] text-[var(--pub-on-dark-2)]">
                {[
                  { icon: LayoutGrid, text: 'Collections and misses' },
                  { icon: Map, text: 'Crews on the map' },
                  { icon: ClipboardCheck, text: 'A record you can export' },
                ].map((c) => (
                  <li key={c.text} className="inline-flex items-center gap-2.5">
                    <c.icon aria-hidden strokeWidth={1.75} className="size-5 text-[var(--pub-leaf-text)]" />
                    {c.text}
                  </li>
                ))}
              </ul>
            </div>
            <ConsoleDemo />
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <p className="flex items-center gap-3 text-[15px] text-[var(--pub-on-dark-2)]">
                <StatusPill status="available" dark /> Working today, shown here with sample data.
              </p>
              <Link to="/features" className="inline-flex items-center gap-1.5 text-[16px] font-semibold text-[var(--pub-leaf-text)] hover:underline">
                What the console does
                <ChevronRight aria-hidden className="size-4" />
              </Link>
            </div>
          </Container>
        </div>
      </section>

      {/* What comes next */}
      <section aria-labelledby="next-title" className="overflow-hidden bg-[var(--pub-field)] py-24 lg:py-32">
        <Container className="grid items-center gap-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-[5vw]">
          <div>
            <StatusPill status="planned" />
            <h2 id="next-title" className={`${H2} mt-6 text-ink`}>
              Residents and crews, <span className="text-[var(--pub-forest)]">in the loop.</span>
            </h2>
            <p className="mt-6 max-w-[520px] text-[19px] leading-[1.6] text-ink-2">Residents will know when the crew is near. Crews will see the next stop and confirm it on the spot.</p>
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

      {/* The ambition, and the next step */}
      <section id="contact" aria-labelledby="mission-title" className="pub-dark relative scroll-mt-[68px] overflow-hidden py-24 lg:py-32">
        <div aria-hidden className="pub-streets absolute inset-0 [mask-image:radial-gradient(ellipse_at_20%_30%,black_10%,transparent_65%)]" />
        <Container className="relative grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-[5vw]">
          <div>
            <h2 id="mission-title" className="max-w-[900px] text-[clamp(38px,4.6vw,76px)] font-bold leading-[1.02] tracking-[-0.025em] text-[var(--pub-on-dark)]">
              {MISSION.split('. ')[0]}. <span className="text-[var(--pub-leaf-text)]">{MISSION.split('. ')[1]}</span>
            </h2>
            <p className="mt-7 max-w-[560px] text-[19px] leading-[1.6] text-[var(--pub-on-dark-2)]">{canContact ? 'Tell us about your city. We would like to show you EcoTrack and hear what your teams need.' : 'See EcoTrack with sample data, or sign in to the console.'}</p>
            {!canContact && (
              <div className="mt-10">
                <ButtonLink to="/preview" variant="primary" size="lg" icon={<ArrowRight aria-hidden className="size-4" />} trailingIcon>
                  See the product
                </ButtonLink>
              </div>
            )}
            <div className="mt-14 border-t border-[var(--pub-dark-line)] pt-8">
              <p className="text-[14px] text-[var(--pub-on-dark-3)]">Design goals</p>
              <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-4">
                {PRINCIPLES.map((p) => (
                  <li key={p.label} className="inline-flex items-center gap-2.5 text-[16px] font-medium text-[var(--pub-on-dark)]">
                    <p.icon aria-hidden strokeWidth={1.75} className="size-5 text-[var(--pub-leaf-text)]" />
                    {p.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {canContact ? <ContactForm /> : <StreetAccounted />}
        </Container>
      </section>
    </>
  )
}
