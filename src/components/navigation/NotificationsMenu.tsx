import { Bell, CheckCircle2, Info, TriangleAlert } from 'lucide-react'
import { Popover } from '@/components/ui/Popover'
import { useAppStore, useData } from '@/store/StoreProvider'
import { clearAlerts } from '@/store/commands'
import { RECENT_ALERTS } from '@/content/original'
import { cn } from '@/lib/cn'

const ICON = { warn: TriangleAlert, ok: CheckCircle2, info: Info } as const
const TONE = { warn: 'text-warn-text bg-warn-soft', ok: 'text-ok-text bg-ok-soft', info: 'text-info bg-info-soft' } as const

/** "Recent alerts" exactly as captured in the original (D/23), with a working Clear all. */
export function NotificationsMenu() {
  const store = useAppStore()
  const cleared = useData((d) => d.clearedAlerts)
  const alerts = RECENT_ALERTS.filter((a) => !cleared.includes(a.id))

  return (
    <Popover
      label="Recent alerts"
      className="w-[min(92vw,320px)]"
      trigger={({ toggle, ...aria }) => (
        <button
          type="button"
          onClick={toggle}
          {...aria}
          aria-label={alerts.length ? `Recent alerts, ${alerts.length}` : 'Recent alerts'}
          className="relative grid size-10 place-items-center rounded-lg text-on-night-2 transition-colors hover:bg-white/10 hover:text-on-night"
        >
          <Bell aria-hidden strokeWidth={1.75} className="size-[18px]" />
          {alerts.length > 0 && <span aria-hidden className="absolute right-2.5 top-2.5 size-2 rounded-full bg-brand ring-2 ring-night" />}
        </button>
      )}
    >
      {() => (
        <div>
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="text-[15px] font-bold text-ink">Recent alerts</p>
            <button
              type="button"
              disabled={alerts.length === 0}
              onClick={() => store.run((d) => clearAlerts(d, alerts.map((a) => a.id)))}
              className="text-[12px] font-medium text-accent-text hover:underline disabled:cursor-default disabled:text-ink-3 disabled:no-underline"
            >
              Clear all
            </button>
          </div>
          {alerts.length === 0 ? (
            <p className="px-4 py-8 text-center text-[13px] text-ink-3">No alerts.</p>
          ) : (
            <ul className="p-1.5">
              {alerts.map((a) => {
                const Icon = ICON[a.tone]
                return (
                  <li key={a.id} className="flex items-center gap-3 rounded-lg px-2.5 py-2.5">
                    <span className={cn('grid size-8 shrink-0 place-items-center rounded-lg', TONE[a.tone])}>
                      <Icon aria-hidden className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-medium text-ink">{a.title}</span>
                      <span className="block text-[12px] text-ink-3">{a.when}</span>
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </Popover>
  )
}
