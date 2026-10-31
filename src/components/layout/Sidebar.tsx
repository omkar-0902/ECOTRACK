import { NavLink, useNavigate } from 'react-router'
import { HardDrive, LogOut, Plus } from 'lucide-react'
import { NAV } from '@/components/navigation/navConfig'
import { useAuth, useUser } from '@/app/providers/AuthProvider'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/cn'
import { Brand } from './Brand'

/** Modules the product marks as not yet available; shown with a quiet tag. */
const SOON = new Set(['/rewards'])

/**
 * Console navigation on the night frame. Persistent on desktop (lg+) and used
 * as the slide-in drawer below lg.
 */
export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate()
  const user = useUser()
  const { signOut } = useAuth()

  return (
    <div className="on-night flex h-full flex-col border-r border-night-line bg-night">
      <div className="flex h-16 shrink-0 items-center px-5">
        <Brand tone="night" />
      </div>

      <nav aria-label="Console" className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-3">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-on-night-3">Operations</p>
        <ul className="flex flex-col gap-0.5">
          {NAV.map((item) => (
            <li key={item.to} className="group relative">
              <NavLink
                to={item.to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'relative flex h-10 items-center gap-3 rounded-lg pl-3 text-[14px] font-medium transition-colors', item.to === '/collectors' ? 'pr-10' : 'pr-2.5',
                    isActive ? 'bg-night-3 text-on-night' : 'text-on-night-2 hover:bg-night-2 hover:text-on-night',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <span aria-hidden className="absolute -left-3 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-brand" />}
                    <item.icon aria-hidden strokeWidth={1.75} className={cn('size-[18px] shrink-0', isActive ? 'text-brand' : 'text-on-night-3 group-hover:text-on-night-2')} />
                    <span className="flex-1 truncate">{item.label}</span>
                    {SOON.has(item.to) && <span className="shrink-0 rounded-full bg-night-3 px-1.5 py-px text-[10px] font-semibold text-on-night-3">Soon</span>}
                  </>
                )}
              </NavLink>
              {item.to === '/collectors' && (
                <button
                  type="button"
                  aria-label="Add collector"
                  title="Add collector"
                  onClick={() => {
                    navigate('/collectors?add=1')
                    onNavigate?.()
                  }}
                  className="absolute right-1.5 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-on-night-3 transition-colors hover:bg-night-3 hover:text-brand"
                >
                  <Plus aria-hidden className="size-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Workspace status: says plainly where the data comes from. */}
      <div className="mx-3 mb-3 rounded-lg border border-night-line bg-night-2 px-3.5 py-3">
        <p className="flex items-center gap-2 text-[12px] font-semibold text-on-night">
          <HardDrive aria-hidden className="size-3.5 text-brand" />
          Demo workspace
        </p>
        <p className="mt-1 text-[12px] leading-[17px] text-on-night-3">Sample records, stored in this browser. No live data source is connected.</p>
      </div>

      <div className="border-t border-night-line p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
          <Avatar name={user.name} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-on-night">{user.name}</p>
            <p className="truncate text-[12px] text-on-night-3">{user.role}</p>
          </div>
          <button type="button" onClick={signOut} aria-label="Sign out" title="Sign out" className="grid size-9 place-items-center rounded-lg text-on-night-3 transition-colors hover:bg-night-2 hover:text-on-night">
            <LogOut aria-hidden className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
