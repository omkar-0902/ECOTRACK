import type { AppData } from '@/store/types'
import type { Collector, CollectionLog } from '@/types/domain'
import { SHIFT_DEFAULTS } from '@/content/original'
import { normalizeCollectors, normalizeLogs } from '@/data/normalize'

/**
 * Data-access boundary. The original product read its records from a REST
 * backend; that backend is not part of this workspace, so this implementation
 * persists only what the operator enters in this browser. Swap it for an API
 * client without touching the UI.
 */
export interface DataRepository {
  load(): LoadResult
  save(data: AppData): void
  clear(): void
}

export type LoadResult = { status: 'ok'; data: AppData } | { status: 'empty' } | { status: 'invalid'; reason: string }

export const DATA_VERSION = 5
const KEY = 'ecotrack:data'

// ── Demo seed data ──────────────────────────────────────────────────────────
// Provides a realistic, pre-populated dataset so every page of the console
// renders a meaningful, operational state on first launch.

const NOW = Date.now()
const H = 3_600_000
const D = 24 * H

const DEMO_COLLECTORS: Collector[] = [
  { id: 'ECO-C-1042', name: 'Marcus Osei', phone: '+14155550101', registeredAt: NOW - 30 * D, online: true,  position: { lat: 5.6037,  lng: -0.1870  } },
  { id: 'ECO-C-2387', name: 'Priya Nair',  phone: '+14155550102', registeredAt: NOW - 28 * D, online: true,  position: { lat: 5.6148,  lng: -0.2057  } },
  { id: 'ECO-C-3190', name: 'Diego Varela', phone: '+14155550103', registeredAt: NOW - 21 * D, online: false, position: { lat: 5.5913,  lng: -0.1695  } },
  { id: 'ECO-C-4561', name: 'Amara Diallo', phone: '+14155550104', registeredAt: NOW - 18 * D, online: true,  position: { lat: 5.6220,  lng: -0.1790  } },
  { id: 'ECO-C-5704', name: 'Jin-Ho Park',  phone: '+14155550105', registeredAt: NOW - 14 * D, online: true,  position: { lat: 5.5978,  lng: -0.2215  } },
  { id: 'ECO-C-6832', name: 'Fatima Al-Rashid', phone: '+14155550106', registeredAt: NOW - 10 * D, online: false, position: null },
  { id: 'ECO-C-7219', name: 'Kwame Asante', phone: '+14155550107', registeredAt: NOW - 7 * D,  online: true,  position: { lat: 5.5870,  lng: -0.1980  } },
  { id: 'ECO-C-8045', name: 'Ling Wei',     phone: '+14155550108', registeredAt: NOW - 3 * D,  online: false, position: null },
]

type LogEntry = { id: string; address: string; sector: string; status: CollectionLog['status']; offsetMs: number }

const LOG_TEMPLATES: LogEntry[] = [
  // Today – completed
  { id: 'LOG-8801', address: '14 Amowi Street, Labadi',        sector: 'Sector A', status: 'completed', offsetMs: -1 * H },
  { id: 'LOG-8802', address: '7 Ring Road East, Osu',          sector: 'Sector B', status: 'completed', offsetMs: -2 * H },
  { id: 'LOG-8803', address: '22 Cantonments Rd, Accra',        sector: 'Sector A', status: 'completed', offsetMs: -2.5 * H },
  { id: 'LOG-8804', address: '5 Boundary Road, Tesano',         sector: 'Sector C', status: 'completed', offsetMs: -3 * H },
  { id: 'LOG-8805', address: '31 Nungua Barrier, Nungua',       sector: 'Sector D', status: 'completed', offsetMs: -3.5 * H },
  { id: 'LOG-8806', address: '9 Laterbiokorshie Rd',            sector: 'Sector B', status: 'completed', offsetMs: -4 * H },
  { id: 'LOG-8807', address: '18 Mamprobi Road, Mamprobi',      sector: 'Sector C', status: 'completed', offsetMs: -5 * H },
  { id: 'LOG-8808', address: '3 Korle-Bu Rd, Korle-Bu',         sector: 'Sector A', status: 'completed', offsetMs: -5.5 * H },
  // Today – pending
  { id: 'LOG-8809', address: '11 Pig Farm Road, Abossey-Okai', sector: 'Sector B', status: 'pending',   offsetMs: -0.5 * H },
  { id: 'LOG-8810', address: '27 Dansoman Express Road',        sector: 'Sector D', status: 'pending',   offsetMs: -1.5 * H },
  { id: 'LOG-8811', address: '6 Lapaz New Road, Lapaz',         sector: 'Sector C', status: 'pending',   offsetMs: -2 * H },
  // Today – missed
  { id: 'LOG-8812', address: '44 Tema Station Rd, Tema',        sector: 'Sector D', status: 'missed',    offsetMs: -6 * H },
  { id: 'LOG-8813', address: '2 Spintex Rd, Baatsona',          sector: 'Sector B', status: 'missed',    offsetMs: -7 * H },
  // 2 days ago
  { id: 'LOG-8750', address: '15 Liberation Road, Accra',       sector: 'Sector A', status: 'completed', offsetMs: -2 * D - 1 * H },
  { id: 'LOG-8751', address: '8 Airport Rd, Kotoka',            sector: 'Sector B', status: 'completed', offsetMs: -2 * D - 2 * H },
  { id: 'LOG-8752', address: '3 Oxford St, Osu',                sector: 'Sector A', status: 'completed', offsetMs: -2 * D - 3 * H },
  { id: 'LOG-8753', address: '19 Kokomlemle Road',              sector: 'Sector C', status: 'completed', offsetMs: -2 * D - 4 * H },
  { id: 'LOG-8754', address: '24 Castle Rd, Ridge',             sector: 'Sector B', status: 'completed', offsetMs: -2 * D - 4.5 * H },
  { id: 'LOG-8755', address: '7 Haatso Junction, Haatso',       sector: 'Sector D', status: 'completed', offsetMs: -2 * D - 5 * H },
  { id: 'LOG-8756', address: '33 Taifa Road, Taifa',            sector: 'Sector C', status: 'missed',    offsetMs: -2 * D - 6 * H },
  { id: 'LOG-8757', address: '12 Achimota Road, Achimota',      sector: 'Sector A', status: 'pending',   offsetMs: -2 * D - 7 * H },
  // 5 days ago
  { id: 'LOG-8690', address: '1 Adabraka Road, Adabraka',       sector: 'Sector B', status: 'completed', offsetMs: -5 * D - 1 * H },
  { id: 'LOG-8691', address: '6 Kaneshie Market Rd',            sector: 'Sector C', status: 'completed', offsetMs: -5 * D - 2 * H },
  { id: 'LOG-8692', address: '20 East Legon Ave, East Legon',   sector: 'Sector A', status: 'completed', offsetMs: -5 * D - 3 * H },
  { id: 'LOG-8693', address: '5 North Industrial Area',         sector: 'Sector D', status: 'completed', offsetMs: -5 * D - 3.5 * H },
  { id: 'LOG-8694', address: '14 Makola Market Rd, Makola',     sector: 'Sector B', status: 'completed', offsetMs: -5 * D - 4 * H },
  { id: 'LOG-8695', address: '9 Dzorwulu Road, Dzorwulu',       sector: 'Sector A', status: 'missed',    offsetMs: -5 * D - 5 * H },
  { id: 'LOG-8696', address: '28 Asylum Down Rd',               sector: 'Sector C', status: 'completed', offsetMs: -5 * D - 6 * H },
  // 10 days ago
  { id: 'LOG-8600', address: '17 La Bawaleshie Rd, La',         sector: 'Sector D', status: 'completed', offsetMs: -10 * D - 1 * H },
  { id: 'LOG-8601', address: '3 Labone Crescent, Labone',       sector: 'Sector A', status: 'completed', offsetMs: -10 * D - 2 * H },
  { id: 'LOG-8602', address: '11 Kanda Highway, Kanda',         sector: 'Sector B', status: 'completed', offsetMs: -10 * D - 3 * H },
  { id: 'LOG-8603', address: '22 McCarthy Hill Rd',             sector: 'Sector C', status: 'missed',    offsetMs: -10 * D - 4 * H },
  { id: 'LOG-8604', address: '8 Community 7, Tema',             sector: 'Sector D', status: 'completed', offsetMs: -10 * D - 5 * H },
  { id: 'LOG-8605', address: '14 Agbogbloshie Rd',              sector: 'Sector B', status: 'completed', offsetMs: -10 * D - 6 * H },
  { id: 'LOG-8606', address: '5 Sakumono Rd, Sakumono',         sector: 'Sector A', status: 'completed', offsetMs: -10 * D - 7 * H },
  // 20 days ago
  { id: 'LOG-8500', address: '19 Gbawe Road, Gbawe',            sector: 'Sector C', status: 'completed', offsetMs: -20 * D - 1 * H },
  { id: 'LOG-8501', address: '4 Weija Road, Weija',             sector: 'Sector D', status: 'completed', offsetMs: -20 * D - 2 * H },
  { id: 'LOG-8502', address: '13 Dome Road, Dome',              sector: 'Sector B', status: 'completed', offsetMs: -20 * D - 3 * H },
  { id: 'LOG-8503', address: '7 Ga East Rd, Ashaley Botwe',     sector: 'Sector A', status: 'missed',    offsetMs: -20 * D - 4 * H },
  { id: 'LOG-8504', address: '30 Madina Road, Madina',          sector: 'Sector C', status: 'completed', offsetMs: -20 * D - 5 * H },
  { id: 'LOG-8505', address: '2 Legon Boundary Rd, Legon',      sector: 'Sector A', status: 'completed', offsetMs: -20 * D - 6 * H },
]

const DEMO_LOGS: CollectionLog[] = LOG_TEMPLATES.map((t) => ({
  id: t.id,
  address: t.address,
  sector: t.sector,
  status: t.status,
  createdAt: NOW + t.offsetMs,
}))

// ── Factory ─────────────────────────────────────────────────────────────────

/** Returns a realistic, pre-populated demo dataset for first-launch experience. */
export function emptyData(): AppData {
  return {
    version: DATA_VERSION,
    collectors: DEMO_COLLECTORS,
    logs: DEMO_LOGS,
    shift: { ...SHIFT_DEFAULTS },
    clearedAlerts: [],
  }
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)

function validate(raw: unknown): string | null {
  if (!isRecord(raw)) return 'not an object'
  if (raw.version !== DATA_VERSION) return `version ${String(raw.version)} is outdated`
  if (!Array.isArray(raw.collectors) || !Array.isArray(raw.logs) || !Array.isArray(raw.clearedAlerts)) return 'missing collections'
  if (!raw.collectors.every((c) => isRecord(c) && typeof c.id === 'string' && typeof c.name === 'string')) return 'invalid collectors'
  if (!isRecord(raw.shift) || typeof raw.shift.start !== 'string' || typeof raw.shift.end !== 'string') return 'invalid shift timing'
  return null
}

export const localStorageRepository: DataRepository = {
  load() {
    let text: string | null = null
    try {
      text = localStorage.getItem(KEY)
    } catch {
      return { status: 'empty' }
    }
    if (!text) return { status: 'empty' }
    try {
      const parsed: unknown = JSON.parse(text)
      const problem = validate(parsed)
      if (problem) return { status: 'invalid', reason: problem }
      // Keep only records the UI can trust; drop malformed or duplicate entries.
      const data = parsed as AppData
      const { logs, report: logReport } = normalizeLogs(data.logs)
      const { collectors, report: collectorReport } = normalizeCollectors(data.collectors)
      if (import.meta.env.DEV && logReport.rejected + logReport.duplicates + collectorReport.rejected + collectorReport.duplicates > 0) {
        console.warn('EcoTrack: dropped stored records that failed validation', { logs: logReport, collectors: collectorReport })
      }
      return { status: 'ok', data: { ...data, logs, collectors } }
    } catch {
      return { status: 'invalid', reason: 'unreadable JSON' }
    }
  },
  save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data))
    } catch {
      /* storage blocked or full: the session keeps working in memory */
    }
  },
  clear() {
    try {
      localStorage.removeItem(KEY)
    } catch {
      /* ignore */
    }
  },
}
