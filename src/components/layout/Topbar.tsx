import { NavLink, Link } from 'react-router'
import { ChevronDown, LogOut, Menu, Moon, Sun } from 'lucide-react'
import { useAuth, useUser } from '@/app/providers/AuthProvider'
import { useTheme } from '@/app/providers/ThemeProvider'
import { NotificationsMenu } from '@/components/navigation/NotificationsMenu'
import { Popover } from '@/components/ui/Popover'
import { Avatar } from '@/components/ui/Avatar'
import { IconButton } from '@/components/ui/Button'
import { DemoTag } from '@/components/ui/Status'
import { Brand } from '@/components/layout/Brand'
import { NAV } from '@/components/navigation/navConfig'
import { cn } from '@/lib/cn'

function ProfileMenu() {
  const user = useUser()
  const { signOut } = useAuth()
  return (
    <Popover
      label="Active account"
      className="w-64"
      trigger={({ toggle, ...aria }) => (
        <button type="button" onClick={toggle} {...aria} aria-label={`Account menu for ${user.name}`} className="flex h-10 items-center gap-2.5 rounded-lg pl-1 pr-2 transition-colors hover:bg-white/10">
          <Avatar name={user.name} size="sm" />
          <span className="hidden text-left xl:block">
            <span className="block text-[13px] font-semibold leading-tight text-on-night">{user.name}</span>
            <span className="block text-[12px] leading-tight text-on-night-3">{user.role}</span>
          </span>
          <ChevronDown aria-hidden className="size-4 text-on-night-3" />
        </button>
      )}
    >
      {() => (
        <div>
          <div className="border-b border-line px-4 py-3.5">
            <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-ink-3">Active account</p>
            <p className="mt-1.5 text-[15px] font-bold text-ink">{user.name}</p>
            <p className="text-[13px] text-ink-2">{user.email}</p>
            <p className="mt-0.5 text-[13px] text-ink-3">{user.role}</p>
          </div>
          <div className="p-1.5">
            <button type="button" onClick={signOut} className="flex h-10 w-full items-center gap-2.5 rounded-md px-2.5 text-[14px] font-medium text-crit-text hover:bg-crit-soft">
              <LogOut aria-hidden className="size-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </Popover>
  )
}

/** Console toolbar: the night brand frame shared with the public site. */
export function Topbar({ onOpenNav }: { onOpenNav: () => void }) {
  const { resolved, setPreference } = useTheme()
  return (
    <header className="no-print on-night relative z-30 shrink-0 border-b border-night-line bg-night">
      <div className="flex h-16 items-center gap-3 px-3 sm:px-6">
        <span className="lg:hidden">
          <IconButton variant="night" label="Open navigation" onClick={onOpenNav}>
            <Menu aria-hidden className="size-5" />
          </IconButton>
        </span>
        <Link to="/dashboard" aria-label="EcoTrack dashboard" className="shrink-0">
          <span className="sm:hidden">
            <Brand compact />
          </span>
          <span className="hidden sm:inline">
            <Brand tone="night" />
          </span>
        </Link>

        <nav aria-label="Console" className="ml-4 hidden h-full min-w-0 lg:block xl:ml-6">
          <ul className="flex h-full items-center gap-1">
            {NAV.map((item) => (
              <li key={item.to} className="h-full">
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn('relative flex h-full items-center gap-2 whitespace-nowrap px-2.5 text-[14px] font-medium transition-colors xl:px-3', isActive ? 'text-on-night' : 'text-on-night-2 hover:text-on-night')
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon aria-hidden strokeWidth={1.75} className={cn('hidden size-[18px] xl:block', isActive ? 'text-brand' : 'text-on-night-3')} />
                      {item.label}
                      {isActive && <span aria-hidden className="absolute inset-x-3 bottom-0 h-[3px] rounded-t-full bg-brand" />}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <span className="hidden md:block lg:hidden xl:block">
            <DemoTag tone="night" />
          </span>
          <IconButton variant="night" label={resolved === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} onClick={() => setPreference(resolved === 'dark' ? 'light' : 'dark')}>
            {resolved === 'dark' ? <Moon aria-hidden strokeWidth={1.75} className="size-[18px]" /> : <Sun aria-hidden strokeWidth={1.75} className="size-[18px]" />}
          </IconButton>
          <NotificationsMenu />
          <span aria-hidden className="mx-1.5 hidden h-6 w-px bg-night-line sm:block" />
          <ProfileMenu />
        </div>
      </div>
    </header>
  )
}
