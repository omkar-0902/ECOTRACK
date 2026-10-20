/** Domain models for the ECOTRACK console. All timestamps are epoch milliseconds. */

export type LatLng = { lat: number; lng: number }

/** A registered field operative (Collectors page: name, generated ECO-ID, contact number). */
export interface Collector {
  /** Generated credential in the ECO-C-#### format shown in the original product. */
  id: string
  name: string
  phone: string
  registeredAt: number
  /** Telemetry state. No telemetry source is connected, so new collectors are offline. */
  online: boolean
  /** Last reported position; null until a telemetry source reports one. */
  position: LatLng | null
}

export type LogStatus = 'completed' | 'pending' | 'missed'

/** A collection request / activity log entry (Collection Reports). */
export interface CollectionLog {
  id: string
  address: string
  sector: string
  status: LogStatus
  createdAt: number
}

export interface ShiftTiming {
  /** 24-hour "HH:MM" */
  start: string
  end: string
}

export interface User {
  name: string
  email: string
  role: string
}
