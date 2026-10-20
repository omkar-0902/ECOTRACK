/**
 * Public-site copy, drawn from the EcoTrack proposal deck
 * (public/EcoTrack_Vamos_v2 2.pptx, Team Vamos) and checked against this repository.
 *
 * Status vocabulary used everywhere on the public site:
 *   'available' — implemented in this web build (the municipal console)
 *   'planned'   — documented in the proposal, not implemented in this build
 *
 * Projected figures from the deck (savings, KPI percentages, market sizes) are
 * deliberately not repeated: they are estimates, not measured results.
 */
import { Bell, Building2, CheckCircle2, ClipboardCheck, Coins, Gift, LayoutGrid, Map, MapPin, Navigation, RefreshCw, Route, Smartphone, Trash2, Truck, Users, WifiOff, type LucideIcon } from 'lucide-react'

export type Status = 'available' | 'planned'

export const TAGLINE = 'Right pickup, at the right place, at the right time.'
export const PRODUCT_LINE = 'Smart Garbage Management System'
export const CLOSING_LINE =
  'EcoTrack transforms waste collection from a blind, manual process into a smart, coordinated and accountable system.'

/** Slide 2 — Problem Statement. */
export const PROBLEMS: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Trash2, title: 'Missed pickups', body: 'Scheduled collections that never happen, with no record that they were missed.' },
  { icon: Bell, title: 'No arrival alerts', body: 'Residents have no way of knowing when the collector is close, so waste is not ready.' },
  { icon: Route, title: 'Inefficient routes', body: 'Collectors follow fixed rounds instead of where pickups are actually needed.' },
  { icon: MapPin, title: 'Illegal dumping', body: 'Uncollected waste ends up on streets and open plots.' },
  { icon: ClipboardCheck, title: 'No accountability', body: 'Nobody can show which pickups were done, by whom, and when.' },
]
export const IMPACT = 'Unhygienic environments, poor city cleanliness and inefficient municipal operations.'

/** Slide 4 — Target Market: the three groups EcoTrack is designed for. */
export const AUDIENCES: { id: 'residents' | 'collectors' | 'municipal'; icon: LucideIcon; name: string; need: string; product: string; status: Status }[] = [
  { id: 'residents', icon: Building2, name: 'Urban residents', need: 'Apartments and gated communities needing reliable pickup.', product: 'Resident app', status: 'planned' },
  { id: 'collectors', icon: Truck, name: 'Garbage collectors', need: 'Municipal workers needing optimised, demand-based routing.', product: 'Collector app', status: 'planned' },
  { id: 'municipal', icon: LayoutGrid, name: 'Municipal corporations', need: 'City authorities needing accountability and analytics dashboards.', product: 'Municipal console', status: 'available' },
]

/** Slide 3 — Resident capabilities, in the deck's order. */
export const RESIDENT_FEATURES: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Smartphone, title: 'Request pickup via app', body: 'Ask for a collection from the phone instead of waiting for a fixed round.' },
  { icon: Bell, title: 'Notified when the collector arrives', body: 'An automatic alert when the truck enters the resident’s geo-zone.' },
  { icon: MapPin, title: 'Mark garbage on the map', body: 'Pin the exact location of the waste so the collector knows where to go.' },
  { icon: CheckCircle2, title: 'Confirm pickup done', body: 'The resident confirms the collection, closing the request on both sides.' },
  { icon: Coins, title: 'Earn Eco Points', body: 'Points for taking part, the incentive behind the planned reward system.' },
]

/** Slides 3, 6 and 10 — collector-side capabilities. */
export const COLLECTOR_FEATURES: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Map, title: 'Live geofencing map', body: 'Pickup zones drawn as geofences, with the collector’s route between them.' },
  { icon: Navigation, title: 'Live route', body: 'The route follows the pickups that were actually requested.' },
  { icon: RefreshCw, title: 'Forced status update', body: 'Each stop has to be marked before the next, so the record is always current.' },
  { icon: WifiOff, title: 'Minimal, offline-first app', body: 'Large buttons and a simple screen that keeps working on poor connections.' },
]

/** What the municipal console in this build actually does (verified in the repository). */
export const CONSOLE_FEATURES: { icon: LucideIcon; title: string; body: string; status: Status }[] = [
  { icon: LayoutGrid, title: 'Operations Dashboard', body: "Today's pickup requests, collections and misses from the collection logs, plus shift timing.", status: 'available' },
  { icon: Map, title: 'Live Tracker', body: 'Collector units on a map at their last reported positions, online or offline. Demo positions in this build.', status: 'available' },
  { icon: ClipboardCheck, title: 'Collection Reports', body: 'Search and filter every collection log, and export the result as CSV.', status: 'available' },
  { icon: Users, title: 'Collector Management', body: 'Register collectors, issue ECO-IDs and search the roster.', status: 'available' },
  { icon: Gift, title: 'Reward System', body: 'Eco Points and leaderboards. Shown as under construction in the console.', status: 'planned' },
]

/** Slide 3 — "How Geo-Fencing Works". */
export const GEOFENCE_STEPS = ['Resident pins location', 'Truck enters geo-zone', 'Auto notification', 'Resident ready', 'Pickup confirmed'] as const

/** Slide 6 — "Implementation Approach", with the role that acts at each step. */
export const FLOW: { n: number; role: 'Resident' | 'System' | 'Collector' | 'Municipal'; title: string; body: string; status: Status }[] = [
  { n: 1, role: 'Resident', title: 'Resident requests pickup', body: 'A pickup is requested and the waste is pinned on the map.', status: 'planned' },
  { n: 2, role: 'System', title: 'Geofence detects arrival', body: 'When the truck enters the zone, the resident is notified automatically.', status: 'planned' },
  { n: 3, role: 'Collector', title: 'Collector gets a live route', body: 'The route is built from the requests that are actually open.', status: 'planned' },
  { n: 4, role: 'Collector', title: 'Forced status update', body: 'The collector marks each stop; the resident confirms the pickup.', status: 'planned' },
  { n: 5, role: 'Municipal', title: 'Admin gets analytics', body: 'Collections, misses and collector activity come together for the city team.', status: 'available' },
]

/** Slides 6 and 10 — design principles stated in the proposal (goals, not measured results). */
export const PRINCIPLES: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Smartphone, title: 'No new hardware', body: 'Runs on the smartphones residents and collectors already have. No bin sensors.' },
  { icon: WifiOff, title: 'Built for low bandwidth', body: 'Designed for Tier 2 and Tier 3 cities with patchy mobile data.' },
  { icon: Users, title: 'Minimal training', body: 'An ultra-simple collector interface with large buttons.' },
  { icon: Building2, title: 'Pilot first', body: 'Start with one municipal zone, prove the results, then expand city-wide.' },
]
