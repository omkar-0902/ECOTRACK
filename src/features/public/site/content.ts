/**
 * Public-site copy, drawn directly from the EcoTrack proposal deck
 * (public/EcoTrack_Vamos_v2 2.pptx, Team Vamos) and checked against this repository.
 *
 * Status vocabulary used everywhere on the public site:
 *   'available' — implemented in this web build (the municipal console)
 *   'planned'   — documented in the proposal deck, planned for companion apps / future phases
 *
 * All figures, comparisons, and workflows are taken directly from the proposal slides.
 */
import {
  Bell,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  Coins,
  Fuel,
  Gift,
  LayoutGrid,
  Map,
  MapPin,
  Navigation,
  Percent,
  RefreshCw,
  Route,
  ShieldAlert,
  Smartphone,
  Trash2,
  TrendingDown,
  TrendingUp,
  Truck,
  Users,
  WifiOff,
  type LucideIcon,
} from 'lucide-react'

export type Status = 'available' | 'planned'

export const TAGLINE = 'Right pickup, at the right place, at the right time.'
export const PRODUCT_LINE = 'Smart Garbage Management System'
export const TEAM_CREDIT = 'Team Vamos'
export const CLOSING_LINE =
  'EcoTrack transforms waste collection from a blind, manual process into a smart, coordinated and accountable system — improving efficiency, reducing waste, and making cities cleaner.'

/** Slide 2 — Problem Statement & Macro Waste Statistics */
export const MACRO_STATS = [
  { value: '150K+', label: 'Tons waste / day', note: 'generated across Indian cities', icon: Trash2 },
  { value: '25%', label: 'Missed pickup rate', note: 'under blind, manual collection rounds', icon: Percent },
  { value: '₹22.5L', label: 'Monthly loss / city', note: 'due to uncoordinated logistics & rework', icon: CircleDollarSign },
] as const

export const PROBLEMS: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Trash2, title: 'Missed pickups', body: 'Collectors skip routes with zero accountability. Garbage piles up while supervisors remain unaware.' },
  { icon: Bell, title: 'No arrival alerts', body: 'Residents have no notice when collectors approach, so waste is not out and trucks leave empty-handed.' },
  { icon: Route, title: 'Inefficient routes', body: 'Trucks follow rigid static rounds instead of real-time demand, burning fuel on empty streets.' },
  { icon: MapPin, title: 'Illegal dumping', body: 'Missed and neglected waste overflows onto streets, drains, and vacant municipal plots.' },
  { icon: ClipboardCheck, title: 'No accountability', body: 'Manual paper logs and phone calls cannot prove which households were serviced, by whom, or when.' },
]
export const IMPACT = 'Unhygienic environments, poor city cleanliness & inefficient municipal operations.'

/** Slide 4 — Target Market & Analysis */
export const AUDIENCES: {
  id: 'residents' | 'collectors' | 'municipal'
  icon: LucideIcon
  name: string
  need: string
  product: string
  focus: string
  status: Status
}[] = [
  {
    id: 'residents',
    icon: Building2,
    name: 'Urban Residents',
    need: 'Apartments & gated communities needing reliable, predictable waste pickup.',
    product: 'Resident companion app',
    focus: 'On-demand requests, geofenced alerts, and gamified Eco Points incentives.',
    status: 'planned',
  },
  {
    id: 'collectors',
    icon: Truck,
    name: 'Garbage Collectors',
    need: 'Municipal workers needing optimized, demand-based navigation with minimal friction.',
    product: 'Collector mobile app',
    focus: 'Large-button offline-first UI, turn-by-turn stop order, and mandatory stop check-ins.',
    status: 'planned',
  },
  {
    id: 'municipal',
    icon: LayoutGrid,
    name: 'Municipal Corporations',
    need: 'City authorities needing operational accountability, live fleet visibility, and analytics.',
    product: 'Municipal command console',
    focus: 'Real-time telemetry, shift scheduling, audit-ready logs, and CSV report exports.',
    status: 'available',
  },
]

export const MARKET_SCOPE = [
  { title: 'Smart City Expansion', body: 'Rapid expansion of urban digitization initiatives across Indian municipalities.' },
  { title: 'Ubiquitous Smartphone Access', body: 'Over 85% mobile device penetration among frontline sanitation workers.' },
  { title: 'Swachh Bharat & Digital India', body: 'National policy mandates and funding tied to measurable cleanliness benchmarks.' },
  { title: 'Tier 1 to Tier 3 Fit', body: 'Tier 1 cities optimize complex routing; Tier 2 and Tier 3 cities digitize manual paper logs.' },
] as const

/** Slide 3 — Resident Capabilities */
export const RESIDENT_FEATURES: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Smartphone, title: 'Request pickup via app', body: 'Submit an instant collection request from a smartphone instead of waiting for erratic rounds.' },
  { icon: MapPin, title: 'Mark garbage on map', body: 'Pin the exact geo-location and waste category so collectors arrive at the precise doorstep.' },
  { icon: Bell, title: 'Notified when collector arrives', body: 'Receive an automatic arrival notification the moment the collection truck enters your neighborhood geofence zone.' },
  { icon: CheckCircle2, title: 'Confirm pickup done', body: 'Two-way handshake verification: resident confirms handover, closing the active ticket.' },
  { icon: Coins, title: 'Earn Eco Points', body: 'Earn gamified reward points for verified handovers and compliant waste segregation.' },
]

/** Slides 3, 6, 10 — Collector Capabilities */
export const COLLECTOR_FEATURES: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Map, title: 'Live geofencing map', body: 'Visual zone geofences highlight pickup clusters with live radar entry triggers.' },
  { icon: Navigation, title: 'Optimized live route', body: 'Dynamic turn-by-turn route updates prioritizing active, verified resident requests.' },
  { icon: RefreshCw, title: 'Forced status updates', body: 'Mandatory status check-in at each stop ensures live accountability and audit trails.' },
  { icon: WifiOff, title: 'Minimal offline-first UI', body: 'High-contrast, large-button mobile interface designed for low-connectivity Tier 2/3 environments.' },
]

/** Verified Municipal Console Capabilities */
export const CONSOLE_FEATURES: { icon: LucideIcon; title: string; body: string; status: Status }[] = [
  { icon: LayoutGrid, title: 'Operations Dashboard', body: "Live metrics for today's pickup requests, completed collections, missed stops, active streams, and shift window management.", status: 'available' },
  { icon: Map, title: 'Live Fleet Tracker', body: 'Interactive map displaying all registered collector units at their last reported coordinates, online/standby status, and sector assignments.', status: 'available' },
  { icon: ClipboardCheck, title: 'Collection Reports', body: 'Comprehensive, searchable historical logs filterable by sector, status, and date range, with one-click CSV data export.', status: 'available' },
  { icon: Users, title: 'Collector Management', body: 'Roster management for on-ground sanitation operatives with auto-generated ECO-ID credentials and contact records.', status: 'available' },
  { icon: Gift, title: 'Reward System', body: 'Citizen Eco Points engine and community cleanliness leaderboard (currently staged under maintenance).', status: 'planned' },
]

/** Slide 3 — How Geo-Fencing Works (5-Stage Sequence) */
export const GEOFENCE_STEPS = [
  { step: 1, title: 'Resident pins location', desc: 'Citizen drops an exact GPS pin on the companion app when waste is ready for pickup.' },
  { step: 2, title: 'Truck enters geo-zone', desc: 'Collection vehicle crosses the virtual perimeter established around the neighborhood zone.' },
  { step: 3, title: 'Auto notification', desc: 'System fires an immediate high-priority push alert notifying resident that collector is nearby.' },
  { step: 4, title: 'Resident ready', desc: 'Resident brings out segregated bins while truck is actively within the local perimeter.' },
  { step: 5, title: 'Pickup confirmed', desc: 'Collector logs physical collection and resident confirms, crediting Eco Points.' },
] as const

/** Slide 6 — 5-Step Operational Chain & Roles */
export const FLOW: { n: number; role: 'Resident' | 'System' | 'Collector' | 'Municipal'; title: string; body: string; status: Status }[] = [
  { n: 1, role: 'Resident', title: 'Resident requests pickup', body: 'A pickup request is logged and the waste location is pinned on the companion map.', status: 'planned' },
  { n: 2, role: 'System', title: 'Geofence detects arrival', body: 'When the collection truck breaches the zone radius, resident is alerted automatically.', status: 'planned' },
  { n: 3, role: 'Collector', title: 'Collector gets live route', body: 'The route is dynamically plotted according to confirmed, pending requests.', status: 'planned' },
  { n: 4, role: 'Collector', title: 'Forced status update', body: 'The operative checks in at the designated stop; ticket is verified and closed.', status: 'planned' },
  { n: 5, role: 'Municipal', title: 'Admin gets analytics', body: 'City supervisors monitor operational velocity, missed rate deficits, and roster status.', status: 'available' },
]

/** Slide 7 & 8 — Financial Impact & Cost Advantage */
export const FINANCIAL_COMPARISON = {
  headline: 'Financial impact analysis',
  subheading: 'Based on municipal baseline model for 1,000 households',
  withoutEcoTrack: {
    label: 'Without EcoTrack',
    missedRate: '20% – 30%',
    dailyCost: '₹75,000',
    frequency: 'Daily operational burn',
    notes: 'Uncoordinated rounds, repeat visits, emergency cleanup crews, and citizen grievance handling.',
  },
  withEcoTrack: {
    label: 'With EcoTrack',
    missedRate: '5% – 8%',
    dailyCost: '₹21,000',
    frequency: 'Daily operational cost',
    notes: 'Demand-driven routing, first-visit completions, and automated geofence verification.',
  },
  savings: {
    rateDrop: '60% – 75%',
    monthlyCitySavings: '₹16,20,000',
    fuelSavings: '20% – 30%',
    truckMonthlySavings: '₹3,000 – ₹4,500',
  },
} as const

export const COST_ADVANTAGES = [
  { icon: Smartphone, title: 'Zero dedicated hardware', body: 'Runs entirely on standard smartphones. Zero bin sensors, RFID tags, or expensive vehicle retrofits.' },
  { icon: Fuel, title: '20%–30% Fuel cost reduction', body: 'Eliminates blind cruising by guiding drivers strictly to open, verified pickup requests.' },
  { icon: TrendingDown, title: '70% Missed pickup cost drop', body: 'Drastically cuts municipal re-dispatch expenses, overflow cleanup, and penalties.' },
  { icon: CircleDollarSign, title: '₹16.2 Lakhs monthly savings', body: 'Projected net operational savings per municipal ward or mid-size city tier.' },
] as const

/** Slide 9 — Target Outcomes & Measurable KPIs */
export const OUTCOMES_KPIS = [
  { metric: '↓ 60–75%', label: 'Missed pickups', desc: 'Elimination of unserviced household bins across pilot wards.', icon: TrendingDown },
  { metric: '↑ 40%+', label: 'Successful collections', desc: 'Higher daily throughput with verified two-way handshakes.', icon: TrendingUp },
  { metric: '↓ 30%', label: 'Collector transit miles', desc: 'Optimized routing reduces unnecessary truck idling and route overlap.', icon: Route },
  { metric: '₹16.2L', label: 'Monthly city savings', desc: 'Recurring operating expenditure saved per municipal deployment zone.', icon: CircleDollarSign },
  { metric: 'Active', label: 'Eco Points engagement', desc: 'Citizens rewarded for prompt waste handover and segregation.', icon: Coins },
  { metric: 'Clean', label: 'Cleaner urban corridors', desc: 'Elimination of secondary roadside dumps and unhygienic waste piles.', icon: ShieldAlert },
] as const

/** Slide 6 & 10 — Feasibility & Deployment Principles */
export const PRINCIPLES: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Smartphone, title: 'No hardware capex', body: 'Existing smartphones only. Zero expensive sensor infrastructure or proprietary hardware.' },
  { icon: WifiOff, title: 'Low-bandwidth resilience', body: 'Engineered specifically for Tier 2 and Tier 3 Indian cities with intermittent mobile network coverage.' },
  { icon: Users, title: 'Minimal training required', body: 'Ultra-simplified, large-button collector interface requiring under 15 minutes of operator onboarding.' },
  { icon: Building2, title: 'Pilot-first scalability', body: 'Pilot in a single municipal ward to establish baseline KPIs, then scale across the entire corporation.' },
]

