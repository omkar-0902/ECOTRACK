/**
 * Public-site copy describing what this build of EcoTrack actually does.
 * Original product language (content/original.ts) is reused where it is
 * accurate; claims the implementation does not support (automatic dispatch,
 * satellite telemetry, partner municipalities, performance statistics) are
 * deliberately not repeated here.
 */
import { Activity, Award, LayoutGrid, Map, Users, type LucideIcon } from 'lucide-react'

export const PUBLIC_NAV = [
  { to: '/overview', label: 'Overview' },
  { to: '/features', label: 'Features' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/preview', label: 'Preview' },
] as const

export const OVERVIEW = {
  eyebrow: 'Smart waste management platform',
  title: ['The waste operations', 'command center for', 'municipal teams.'],
  body: 'EcoTrack brings collection activity, field collectors and reporting into one console, so operations teams can see what was collected today, what was missed, and who is in the field.',
  // From the original "Problem" section (website_screenshots/desktop/02).
  problemTitle: 'Built for the problems cities actually have',
  problems: [
    { title: 'Missed pickups', body: 'Collections that fall through without anyone noticing.' },
    { title: 'No field visibility', body: 'No view of where collectors are or which work is done.' },
    { title: 'No data to decide with', body: 'Decisions made on guesswork instead of records.' },
    { title: 'Uncoordinated teams', body: 'Shifts and handoffs run on phone calls and paper.' },
  ],
} as const

export type Capability = {
  id: 'dashboard' | 'tracker' | 'reports' | 'collectors' | 'rewards'
  icon: LucideIcon
  name: string
  route: string
  summary: string
  points: string[]
  status: 'available' | 'planned'
}

export const CAPABILITIES: Capability[] = [
  {
    id: 'dashboard',
    icon: LayoutGrid,
    name: 'Operations Dashboard',
    route: '/dashboard',
    summary: "A single overview of today's collection activity, calculated from the day's collection logs.",
    points: [
      "Today's pickup requests, completed, not collected and still-active counts",
      'Collection breakdown by status for the current day',
      'Shift timing: set deployment start and operations cease, then commit or reset',
    ],
    status: 'available',
  },
  {
    id: 'tracker',
    icon: Map,
    name: 'Live Tracker',
    route: '/tracking',
    summary: 'An interactive map of collector units at their last reported positions, with online and offline status.',
    points: [
      'Pan, zoom and select a unit to focus it on the map',
      'Online and offline unit counts at a glance',
      'Collectors without a reported position are listed, not guessed',
    ],
    status: 'available',
  },
  {
    id: 'reports',
    icon: Activity,
    name: 'Collection Reports',
    route: '/reports',
    summary: 'Detailed logs of collection requests and activities, filterable and exportable.',
    points: [
      'Search by address or log ID',
      'Filter by date range, status and sector',
      'Completed, pending and missed totals for the current filter',
      'Export the filtered logs as a CSV file',
    ],
    status: 'available',
  },
  {
    id: 'collectors',
    icon: Users,
    name: 'Collector Management',
    route: '/collectors',
    summary: 'Register and oversee on-ground waste collection personnel.',
    points: [
      'Register a collector with a name and phone number',
      'A unique ECO-ID credential is generated on registration',
      'Search the roster by name, ECO-ID or phone number',
    ],
    status: 'available',
  },
  {
    id: 'rewards',
    icon: Award,
    name: 'Reward System',
    route: '/rewards',
    summary: 'Incentivizing sustainable waste management. This module is under construction and not yet available.',
    points: ['Planned for a future deployment cycle'],
    status: 'planned',
  },
]

/** The real sequence of work in the console, in the order an operations team does it. */
export const WORKFLOW = [
  { title: 'Sign in', body: 'An administrator signs in to the command center with their Network ID.', where: 'Sign-in dialog', capability: null },
  { title: 'Register collectors', body: 'Field collectors are added to the roster and receive an ECO-ID.', where: 'Collectors', capability: 'collectors' },
  { title: 'Set the shift', body: 'Deployment start and operations cease times are configured and committed.', where: 'Dashboard', capability: 'dashboard' },
  { title: 'Monitor the field', body: "Today's counts and collector positions are reviewed as work progresses.", where: 'Dashboard, Live Tracker', capability: 'tracker' },
  { title: 'Review and export', body: 'Collection logs are filtered, reviewed and exported as CSV.', where: 'Collection Reports', capability: 'reports' },
] as const
