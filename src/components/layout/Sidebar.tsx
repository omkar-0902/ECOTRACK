import { NavLink, useNavigate } from 'react-router'
import { LogOut, Plus } from 'lucide-react'
import { NAV } from '@/components/navigation/navConfig'
import { useAuth, useUser } from '@/app/providers/AuthProvider'
import { Avatar } from '@/components/ui/Avatar'
import { DemoTag } from '@/components/ui/Status'
import { cn } from '@/lib/cn'
import { Brand } from './Brand'

/** Navigation drawer for screens narrower than lg, where the toolbar can't hold the module links. */
export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate()
  const user = useUser()
  const { signOut } = useAuth()

  return (
    <div className="on-night flex h-full flex-col bg-night">
      <div className="flex h-16 shrink-0 items-center border-b border-night-line px-5">
        <Brand tone="night" />
      </div>

      <nav aria-label="Console" className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
        <ul className="flex flex-col gap-1">
          {NAV.map((item) => (
            <li key={item.to} className="relative">
              <NavLink
                to={item.to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn('relative flex h-12 items-center gap-3 rounded-lg px-3.5 text-[15px] font-medium transition-colors', isActive ? 'bg-white/10 text-on-night' : 'text-on-night-2 hover:bg-white/5 hover:text-on-night')
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <span aria-hidden className="absolute -left-3 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-brand" />}
                    <item.icon aria-hidden strokeWidth={1.75} className={cn('size-[18px] shrink-0', isActive ? 'text-brand' : 'text-on-night-3')} />
                    <span className="flex-1 truncate">{item.label}</span>
                  </>
                )}
              </NavLink>
              {item.to === '/collectors' && (
                <button
                  type="button"
                  aria-label="Add collector"
                  onClick={() => {
                    navigate('/collectors?add=1')
                    onNavigate?.()
                  }}
                  className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-md text-on-night-3 hover:bg-white/10 hover:text-brand"
                >
                  <Plus aria-hidden className="size-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-6 px-3.5">
          <DemoTag tone="night" />
        </div>
      </nav>

      <div className="border-t border-night-line p-4">
        <div className="flex items-center gap-3">
          <Avatar name={user.name} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold text-on-night">{user.name}</p>
            <p className="truncate text-[12px] text-on-night-3">{user.email}</p>
          </div>
          <button type="button" onClick={signOut} aria-label="Sign out" title="Sign out" className="grid size-10 place-items-center rounded-lg text-on-night-3 hover:bg-white/10 hover:text-on-night">
            <LogOut aria-hidden className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
