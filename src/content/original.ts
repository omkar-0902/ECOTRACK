/**
 * Original ECOTRACK product content, transcribed from the baseline screenshots in
 * /website_screenshots (captured 2026-10-13). Every string here is visible in the
 * referenced capture. Nothing in this file is invented; if a value was not legible
 * or never captured, it is deliberately absent.
 *
 * Source key: D = website_screenshots/desktop, M = website_screenshots/mobile.
 */

// ---------------------------------------------------------------- landing (D/01–07)

export const LANDING_NAV = ['Problem', 'Features', 'How it works', 'Preview'] as const

export const HERO = {
  eyebrow: 'Smart waste management platform',
  title: ['The Intelligent', 'Waste Operations', 'Command Center'],
  body: 'EcoTrack empowers municipal operations teams with real-time pickup tracking, automated collector dispatch, live field maps, and a citizen rewards engine — all in one unified dashboard.',
  // D/07 (crop): stat badges under the hero image
  stats: [
    { value: '98%', label: 'Collection rate' },
    { value: '4.2K+', label: 'Daily pickups' },
    { value: '< 8min', label: 'Avg response' },
  ],
  // D/07 (crop): row beneath the stat badges
  municipalities: ['Municipal Corp. Delhi', 'BMC Mumbai', 'BBMP Bengaluru', 'GHMC Hyderabad'],
} as const

export const PROBLEM = {
  eyebrow: 'The problem',
  title: ['Cities are drowning in', 'unmanaged waste'],
  body: 'Manual operations, disconnected teams, and zero real-time visibility make urban waste management a costly, inefficient daily crisis.',
  items: [
    { title: 'Missed Pickups', body: 'Collectors skip routes with zero accountability. Garbage piles up while supervisors remain unaware.' },
    { title: 'No Field Visibility', body: "No live view of where collectors are, which zones are done, or what's been missed until it's too late." },
    { title: 'Zero Data Insights', body: 'Decisions run on guesswork. Without analytics, budget is wasted and efficiency tanks across zones.' },
    { title: 'Uncoordinated Teams', body: 'Routes, shifts, and handoffs managed via phone calls and paper logs — a recipe for operational chaos.' },
  ],
} as const

export const SOLUTION = {
  eyebrow: 'The solution',
  title: ['One platform.', 'Total control.'],
  body: 'EcoTrack closes the loop from citizen request to verified pickup — every step tracked, logged, and optimized.',
  steps: [
    { title: 'Citizen Request', body: 'Pickup raised via app or web portal' },
    { title: 'Smart Dispatch', body: 'Nearest collector auto-assigned' },
    { title: 'Live Field Tracking', body: 'Real-time location on operations map' },
    { title: 'Reward & Close', body: 'Points issued, collection logged' },
  ],
} as const

export const FEATURES = {
  eyebrow: 'Features',
  title: ['Built for cities.', 'Engineered for speed.'],
  body: 'Every feature was designed around the real operational challenges faced by municipal teams every single day.',
  items: [
    { tag: 'Real-time', title: 'Live Field Tracker', body: "Satellite-linked map shows every active collector's position, route progress, and zone coverage in real time." },
    { tag: 'Team', title: 'Collector Management', body: 'Register field operatives, generate secure ECO-ID credentials, assign shifts, and maintain a full personnel roster.' },
    { tag: 'Analytics', title: 'Performance Analytics', body: 'Visual breakdowns of rates, missed pickups, active requests, and completion trends — every decision data-backed.' },
    { tag: 'Engagement', title: 'Citizen Rewards Engine', body: 'Citizens earn points for verified pickup completions, driving engagement and regular waste reporting across the city.' },
  ],
} as const

export const HOW_IT_WORKS = {
  eyebrow: 'How it works',
  title: ['Up and running', 'in four steps.'],
  steps: [
    { title: 'City Admin Logs In', body: "Access the EcoTrack Command Center via secure login. Role-based access ensures each team member sees only what's relevant to them." },
    { title: 'Collector Fleet Registered', body: 'Field collectors are onboarded with auto-generated ECO-IDs. Shift timings configured and operatives are deployment-ready instantly.' },
    { title: 'Pickup Requests Flow In', body: 'Citizens submit requests through the companion app.' },
    { title: 'Live Operations Begin', body: 'The live map activates. Monitor every collector, track completions in real time, generate end-of-day reports — no spreadsheets needed.' },
  ],
} as const

/** D/05, D/07 (crop): the static "Dashboard preview" illustration on the landing page. */
export const PREVIEW = {
  eyebrow: 'Dashboard preview',
  title: ['See it in', 'action.'],
  body: 'A real-time command center giving operations teams total situational awareness — from pickup queue to live collector maps.',
  url: 'ecotrack.app/dashboard',
  heading: 'Operations Dashboard',
  subheading: "Real-time overview for today's collection activity",
  date: 'Friday, May 2, 2026',
  kpis: [
    { value: '87', label: 'Pickup requests', tag: 'Total', tone: 'accent' },
    { value: '62', label: 'Collected today', tag: 'Collected', tone: 'accent' },
    { value: '11', label: 'Not collected', tag: 'Missed', tone: 'crit' },
    { value: '14', label: 'Active now', tag: 'Live', tone: 'warn' },
  ],
  summary: [
    { label: 'Collected', value: 71, tone: 'accent' },
    { label: 'Active', value: 16, tone: 'warn' },
    { label: 'Missed', value: 13, tone: 'crit' },
  ],
  collectionRate: '71%',
  collectors: [
    { name: 'Michael Chen', id: 'ECO-C-4921', done: 8 },
    { name: 'Sarah Jenkins', id: 'ECO-C-8832', done: 6 },
    { name: 'Raj Patel', id: 'ECO-C-2247', done: 11 },
  ],
} as const

/** D/05: the six-figure band below the preview. */
export const IMPACT_BAND = [
  { value: '98%', label: 'Collection rate', note: 'across all active zones' },
  { value: '4.2K+', label: 'Pickups per day', note: 'average across deployments' },
  { value: '< 8min', label: 'Avg response time', note: 'from request to dispatch' },
  { value: '3x', label: 'Efficiency increase', note: 'vs. manual operations' },
  { value: '62+', label: 'Active collectors', note: 'manageable from one dashboard' },
  { value: '0', label: 'Spreadsheets needed', note: "everything's automated" },
] as const

export const CTA = {
  title: ['Ready to transform', "your city's operations?"],
  body: 'Join municipal teams using EcoTrack to manage waste collection at scale — with real-time intelligence, not guesswork.',
  primary: 'Get started now',
  secondary: 'Login to dashboard',
  assurances: ['Secure & private', 'No setup required', 'Municipal-grade reliability', 'Scales with your city'],
} as const

export const FOOTER = {
  legal: 'EcoTrack Infrastructure Solutions © 2026',
  tagline: 'Built for smart cities',
} as const

// ---------------------------------------------------------------- authentication (D/08, M/05)

export const LOGIN = {
  title: 'Welcome Back',
  subtitle: 'Sign in to access your command center',
  email: 'Network ID (Email)',
  key: 'Security Access Key',
  remember: 'Remember device',
  submit: 'Access system',
  panelTitle: 'Welcome back!',
  panelBody: "Your city's waste operations command center is live and ready.",
  panelList: ['Live Collector Tracking', 'Real-Time Pickup Queue', 'Performance Analytics', 'Citizen Rewards Engine'],
} as const

/** D/10, D/23: the signed-in account shown in the header and profile menu. */
export const ACCOUNT = {
  name: 'Alex Rivera',
  role: 'Administrator',
  email: 'alex.rivera@ecotrack.io',
} as const

/** D/23: "Recent alerts" panel. Relative times are shown exactly as captured. */
export const RECENT_ALERTS = [
  { id: 'low-efficiency', title: 'Low Efficiency', when: '10m ago', tone: 'warn' },
  { id: 'target-achieved', title: 'Target Achieved', when: '1h ago', tone: 'ok' },
  { id: 'maintenance', title: 'Maintenance', when: '3h ago', tone: 'info' },
] as const

// ---------------------------------------------------------------- application (D/10–20)

export const NAV_LABELS = {
  dashboard: 'Dashboard',
  tracking: 'Live Tracker',
  reports: 'Collection Reports',
  rewards: 'Reward System',
  collectors: 'Collectors',
} as const

export const DASHBOARD = {
  title: 'Operations Dashboard',
  subtitle: "Real-time overview for today's collection activity",
  kpis: {
    requests: { label: 'Pickup requests', tag: 'Total' },
    collected: { label: 'Collected today', tag: 'Collected' },
    missed: { label: 'Not collected', tag: 'Missed' },
    active: { label: 'Active today', tag: 'Live' },
  },
  analytics: {
    title: 'Analytics Overview',
    subtitle: 'Live efficiency tracking',
    performance: 'Performance',
    rows: {
      collected: { label: 'Collected success', unit: 'units' },
      active: { label: 'Active operations', unit: 'streams' },
      missed: { label: 'Service deficit', unit: 'missed' },
    },
    yield: { eyebrow: 'Current yield', title: 'Optimized Pathing', scale: 'Efficiency scale' },
  },
  shift: {
    eyebrow: 'Configuration',
    title: 'Shift Timing',
    statusLabel: 'Status',
    status: 'Operational',
    start: { label: 'Deployment start', hint: 'Set the initial fleet activation time' },
    end: { label: 'Operations cease', hint: 'Automatic termination of field activity' },
    commit: 'Commit changes',
    reset: 'Reset',
  },
} as const

/**
 * D/10, D/13: both time inputs read "06:00", with the meridiem partly covered by
 * the clock button ("A…" and "P…" are legible), i.e. 06:00 AM and 06:00 PM.
 */
export const SHIFT_DEFAULTS = { start: '06:00', end: '18:00' } as const

export const TRACKING = {
  title: 'Collector Tracking',
  subtitle: 'Real-time monitoring of field collectors and their routes',
  panelTitle: 'Live Field Tracker',
  panelSubtitle: 'Real-time infrastructure overlay',
  linkActive: 'Satellite link active',
  legendTitle: 'Tracking core',
  online: { label: 'Unit online', sub: 'Real-time telemetry' },
  offline: { label: 'Unit offline', sub: 'Real-time telemetry' },
} as const

export const REPORTS = {
  title: 'Collection Reports',
  subtitle: 'Detailed logs of all collection requests and activities',
  export: 'Export data',
  search: 'Search address or ID…',
  dateDefault: 'Today',
  statusDefault: 'All status',
  sectorDefault: 'All sectors',
  summary: { completed: 'Completed', pending: 'Pending', missed: 'Missed', total: 'Total logs' },
  notice: {
    title: 'Under construction',
    body: 'The profound analytics and extensive collection reports engine is currently being forged. Premium insights available in the next deployment cycle.',
    status: 'Module maintenance active',
  },
} as const

export const REWARDS = {
  title: 'Reward System',
  subtitle: 'Incentivizing sustainable waste management records',
  notice: {
    title: 'Under construction',
    body: 'The gamified residential reward tracking system is currently being forged. Premium incentives and leaderboards available in the next deployment cycle.',
    status: 'Module maintenance active',
  },
} as const

export const COLLECTORS = {
  title: 'Manage Collectors',
  subtitle: 'Register and oversee on-ground waste collection personnel',
  add: 'Add collector',
  columns: { info: 'Collector info', id: 'Collector ID', phone: 'Contact number' },
  empty: 'No collectors registered in this zone',
  form: {
    title: 'Add Collector',
    subtitle: 'Register a new field operative to the system.',
    name: 'Full name',
    namePlaceholder: 'e.g. KAMLESH',
    phone: 'Phone number',
    phonePlaceholder: 'e.g. 1876543210',
    submit: 'Generate credentials',
  },
} as const
