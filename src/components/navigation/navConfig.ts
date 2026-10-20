import { Activity, Award, LayoutGrid, Map, Users, type LucideIcon } from 'lucide-react'
import { NAV_LABELS } from '@/content/original'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

/** The original five sections and their original routes (D/10, README route table). */
export const NAV: NavItem[] = [
  { to: '/dashboard', label: NAV_LABELS.dashboard, icon: LayoutGrid },
  { to: '/tracking', label: NAV_LABELS.tracking, icon: Map },
  { to: '/reports', label: NAV_LABELS.reports, icon: Activity },
  { to: '/rewards', label: NAV_LABELS.rewards, icon: Award },
  { to: '/collectors', label: NAV_LABELS.collectors, icon: Users },
]
