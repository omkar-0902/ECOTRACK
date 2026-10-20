import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate, useOutletContext, useSearchParams } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Menu, Moon, Sun, X } from 'lucide-react'
import { useAuth } from '@/app/providers/AuthProvider'
import { useTheme } from '@/app/providers/ThemeProvider'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { Brand } from '@/components/layout/Brand'
import { Button, IconButton } from '@/components/ui/Button'
import { LoginDialog } from '@/features/auth/LoginDialog'
import { PUBLIC_NAV } from '@/content/product'
import { FOOTER } from '@/content/original'
import { cn } from '@/lib/cn'
import { Container, StatusPill } from './site/ui'
import { PRODUCT_LINE, TAGLINE } from './site/content'
import './site/public.css'

type PublicContext = { openSignIn: () => void }

/** Pages use this to open the existing sign-in flow (or go to the console if already signed in). */
export function usePublicActions() {
  return useOutletContext<PublicContext>()
}

function MobileMenu({ open, onClose, onSignIn, signedIn }: { open: boolean; onClose: () => void; onSignIn: () => void; signedIn: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useFocusTrap(ref, open, onClose)
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[700] md:hidden">
          <motion.div aria-hidden className="absolute inset-0 bg-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0, transition: { duration: 0.12 } }}
            className="absolute inset-x-0 top-0 border-b border-line bg-canvas px-4 pb-6 pt-3 shadow-e3"
          >
            <div className="flex h-12 items-center justify-between">
              <Brand />
              <IconButton label="Close menu" onClick={onClose}>
                <X aria-hidden className="size-5" />
              </IconButton>
            </div>
            <nav aria-label="Site" className="mt-3">
              <ul className="flex flex-col">
                {PUBLIC_NAV.map((n) => (
                  <li key={n.to}>
                    <NavLink
                      to={n.to}
                      onClick={onClose}
                      className={({ isActive }) => cn('flex h-13 items-center border-b border-line text-[17px]', isActive ? 'font-semibold text-ink' : 'text-ink-2')}
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && <span aria-hidden className="mr-3 h-5 w-[3px] rounded-full bg-brand" />}
                          {n.label}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            <Button
              variant="primary"
              size="lg"
              className="mt-6 w-full"
              onClick={() => {
                onClose()
                onSignIn()
              }}
            >
              {signedIn ? 'Open console' : 'Sign in to the console'}
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

/**
 * Pre-login site frame: light header, routed pages and footer. Each nav item
 * is its own route. The `et-public` class scopes the public-only styles.
 */
export function PublicLayout() {
  const { user } = useAuth()
  const { resolved, setPreference } = useTheme()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [params, setParams] = useSearchParams()
  const [menuOpen, setMenuOpen] = useState(false)
  const loginOpen = !user && (pathname === '/login' || params.get('signin') === '1')

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  const openSignIn = () => {
    if (user) navigate('/dashboard')
    else setParams({ signin: '1' })
  }
  const closeSignIn = () => {
    if (pathname === '/login') navigate('/overview', { replace: true })
    else setParams({}, { replace: true })
  }

  return (
    <div className="et-public flex min-h-dvh flex-col bg-canvas text-ink">
      <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-ink">
        Skip to content
      </a>
      <header className="sticky top-0 z-40 shrink-0 border-b border-line bg-canvas">
        <Container className="flex h-[68px] items-center gap-8">
          <Link to="/overview" aria-label="EcoTrack overview" className="shrink-0">
            <Brand />
          </Link>
          <nav aria-label="Site" className="hidden h-full md:block">
            <ul className="flex h-full items-center gap-1">
              {PUBLIC_NAV.map((n) => (
                <li key={n.to} className="h-full">
                  <NavLink
                    to={n.to}
                    className={({ isActive }) => cn('relative flex h-full items-center px-3 text-[15px] font-medium transition-colors', isActive ? 'text-ink' : 'text-ink-2 hover:text-ink')}
                  >
                    {({ isActive }) => (
                      <>
                        {n.label}
                        {isActive && <motion.span layoutId="public-nav" className="absolute inset-x-3 bottom-0 h-[3px] rounded-t-full bg-brand" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <IconButton label={resolved === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} onClick={() => setPreference(resolved === 'dark' ? 'light' : 'dark')}>
              {resolved === 'dark' ? <Moon aria-hidden strokeWidth={1.75} className="size-[18px]" /> : <Sun aria-hidden strokeWidth={1.75} className="size-[18px]" />}
            </IconButton>
            <span className="hidden sm:block">
              <Button variant="primary" onClick={openSignIn} icon={<ArrowRight aria-hidden className="size-4" />} trailingIcon>
                {user ? 'Open console' : 'Sign in'}
              </Button>
            </span>
            <span className="md:hidden">
              <IconButton label="Open menu" onClick={() => setMenuOpen(true)}>
                <Menu aria-hidden className="size-5" />
              </IconButton>
            </span>
          </div>
        </Container>
      </header>

      <main id="content" className="flex flex-1 flex-col">
        <motion.div key={pathname === '/login' ? '/overview' : pathname} className="flex flex-1 flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
          <Outlet context={{ openSignIn } satisfies PublicContext} />
        </motion.div>
      </main>

      <footer className="shrink-0 border-t border-line bg-[var(--pub-field)]">
        <Container className="grid gap-10 py-12 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="max-w-sm">
            <Brand />
            <p className="mt-4 text-[15px] font-semibold text-ink">{PRODUCT_LINE}</p>
            <p className="mt-1 text-[15px] italic text-ink-2">“{TAGLINE}”</p>
          </div>
          <nav aria-labelledby="footer-explore">
            <h2 id="footer-explore" className="text-[14px] font-bold text-ink">
              Explore
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5 text-[15px]">
              {PUBLIC_NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="text-ink-2 transition-colors hover:text-[var(--pub-forest)]">
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <button type="button" onClick={openSignIn} className="font-medium text-[var(--pub-forest)] hover:underline">
                  {user ? 'Open console' : 'Sign in'}
                </button>
              </li>
            </ul>
          </nav>
          <div>
            <h2 className="text-[14px] font-bold text-ink">On these pages</h2>
            <ul className="mt-4 flex flex-col gap-3 text-[14px] text-ink-2">
              <li className="flex flex-wrap items-center gap-2">
                <StatusPill status="available" /> works in this web build
              </li>
              <li className="flex flex-wrap items-center gap-2">
                <StatusPill status="planned" /> described in the EcoTrack proposal, not built yet
              </li>
              <li className="text-[13px] text-ink-3">Console data is a labelled demo dataset stored in your browser.</li>
            </ul>
          </div>
        </Container>
        <Container>
          <p className="border-t border-line py-5 text-[13px] text-ink-3">{FOOTER.legal}</p>
        </Container>
      </footer>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} onSignIn={openSignIn} signedIn={!!user} />
      <LoginDialog open={loginOpen} onClose={closeSignIn} />
    </div>
  )
}
