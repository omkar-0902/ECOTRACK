/**
 * Public-site copy, written for customers rather than engineers. Kept short on
 * purpose: the product visuals carry most of the story.
 *
 * Sources: the EcoTrack proposal deck (public/EcoTrack_Vamos_v2 2.pptx) for the
 * product vision, and this repository for what actually works today.
 *
 * Availability vocabulary used everywhere on the public site:
 *   'available' — works today in the municipal console (with labelled sample data)
 *   'planned'   — part of the EcoTrack product plan, not built yet
 *
 * No statistics, savings or outcome figures appear on the public site: the deck's
 * projections have no stated sources or assumptions.
 */
import { CalendarClock, ClipboardCheck, FileDown, LayoutGrid, Map, Smartphone, Truck, Users, type LucideIcon } from 'lucide-react'

export type Status = 'available' | 'planned'

export const PRODUCT_LINE = 'Smart waste collection for cities'

export const HERO = {
  title: ['Smarter waste collection.', 'Cleaner cities.'],
  body: 'EcoTrack helps city teams see what has been collected, catch missed pickups early and coordinate collection crews with clear accountability.',
}

export const MISSION = 'Every street collected. Every collection accounted for.'

/** Design goals from the proposal, in a few words each. Goals, not results. */
export const PRINCIPLES: { icon: LucideIcon; label: string }[] = [
  { icon: Smartphone, label: 'No new hardware' },
  { icon: Truck, label: 'Simple for crews' },
  { icon: Map, label: 'Built for real streets' },
  { icon: Users, label: 'Start with one zone' },
]

/* ---------------------------------------------------------------- features */

export type Story = {
  id: 'day' | 'record' | 'crews'
  icon: LucideIcon
  title: string
  body: string
  points: { icon: LucideIcon; text: string }[]
}

/** Three product stories, each backed by a working console screen. */
export const STORIES: Story[] = [
  {
    id: 'day',
    icon: LayoutGrid,
    title: 'See the collection day as it happens.',
    body: 'Requests, collections and misses, and where every collector is.',
    points: [
      { icon: LayoutGrid, text: "Today's counts and collection rate" },
      { icon: Map, text: 'Collectors on a map, online or offline' },
    ],
  },
  {
    id: 'record',
    icon: ClipboardCheck,
    title: 'Keep a record of every pickup.',
    body: 'Find any collection by date, status or area, and take it with you.',
    points: [
      { icon: ClipboardCheck, text: 'Search and filter every collection' },
      { icon: FileDown, text: 'Export to a spreadsheet in one click' },
    ],
  },
  {
    id: 'crews',
    icon: Users,
    title: 'Organise the people who do the work.',
    body: 'One roster for your crews, and one place to set the shift.',
    points: [
      { icon: Users, text: 'Register collectors and issue IDs' },
      { icon: CalendarClock, text: 'Set when collection starts and ends' },
    ],
  },
]

/** Planned capabilities, as they appear on the phone concepts. */
export const NEXT = {
  resident: ['Request a pickup', 'Alert when the crew is near', 'Confirm the collection', 'Earn Eco Points'],
  crew: ['Route built from requests', 'Next stop at a glance', 'Mark each stop collected'],
} as const

/* ------------------------------------------------------------ how it works */

export const JOURNEY: { n: number; who: string; title: string; status: Status }[] = [
  { n: 1, who: 'Resident', title: 'A pickup is requested', status: 'planned' },
  { n: 2, who: 'Resident and crew', title: 'The crew is guided there, and residents are told it is near', status: 'planned' },
  { n: 3, who: 'Crew', title: 'The collection is confirmed on the spot', status: 'planned' },
  { n: 4, who: 'City team', title: 'The city sees and keeps the record', status: 'available' },
]

/** What the console does today, in the order a city team uses it. */
export const TODAY_STEPS = ['Register your collectors', 'Set the shift', 'Follow the day', 'Review and export'] as const

/* ----------------------------------------------------------------- preview */

export const PREVIEW_NOTES = {
  dashboard: "Today's requests, collections and misses, and the share collected.",
  tracker: 'Collectors on the map, online or offline. Positions are sample data.',
  reports: 'Every collection, newest first. In the console you can filter and export them.',
  collectors: 'The collector roster, with IDs and contact numbers.',
} as const
