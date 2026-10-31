import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate, useOutletContext, useSearchParams } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Menu, Moon, Sun, X } from 'lucide-react'
import { useAuth } from '@/app/providers/AuthProvider'
import { useTheme } from '@/app/providers/ThemeProvider'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { Brand } from '@/components/layout/Brand'
import { Button, IconButton } from '@/components/ui/Button'
import { LoginDialog, type AuthMode } from '@/features/auth/LoginDialog'
import { PUBLIC_NAV } from '@/content/product'
import { FOOTER } from '@/content/original'
import { cn } from '@/lib/cn'
import { Container } from './site/ui'
import { PRODUCT_LINE } from './site/content'
import { CONTACT_PATH, enquiryChannel } from './site/config'
import './site/public.css'

type PublicContext = { openSignIn: () => void }

/** Pages use this to open the existing sign-in flow (or go to the console if already signed in). */
export function usePublicActions() {
  return useOutletContext<PublicContext>()
}

/** Per-route title and description for the public pages. */
const META: Record<string, { title: string; description: string }> = {
  '/overview': { title: 'EcoTrack | Smarter waste collection for cleaner cities', description: 'EcoTrack helps cities see what was collected, what was missed and where their crews are, so every pickup can be accounted for.' },
  '/features': { title: 'Features | EcoTrack', description: 'What EcoTrack does for city teams today, and what is planned for residents and collection crews.' },
  '/how-it-works': { title: 'How it works | EcoTrack', description: 'How a pickup moves from request to record, and what the EcoTrack console does for city teams today.' },
  '/preview': { title: 'Product preview | EcoTrack', description: 'See the EcoTrack municipal console with sample data, and concepts for the resident and crew apps.' },
  '/login': { title: 'Sign in | EcoTrack', description: 'Sign in to the EcoTrack municipal console.' },
  '/signup': { title: 'Create account | EcoTrack', description: 'Create an EcoTrack account for the municipal console.' },
}

function MobileMenu({ open, onClose, onSignIn, onSignUp, signedIn }: { open: boolean; onClose: () => void; onSignIn: () => void; onSignUp: () => void; signedIn: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useFocusTrap(ref, open, onClose)
  const demo = enquiryChannel() !== null
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
            className="pub-chrome pub-sheet absolute inset-x-0 top-0 px-5 pb-6 pt-3 shadow-e3"
          >
            <div className="flex h-12 items-center justify-between">
              <Brand tone="night" />
              <IconButton variant="night" label="Close menu" onClick={onClose}>
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
                      className={({ isActive }) => cn('flex h-13 items-center border-b border-[var(--pub-dark-line)] text-[17px]', isActive ? 'font-semibold text-[var(--pub-on-dark)]' : 'text-[var(--pub-on-dark-2)]')}
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && <span aria-hidden className="mr-3 h-5 w-[3px] rounded-full bg-[var(--pub-leaf)]" />}
                          {n.label}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-6 flex flex-col gap-3">
              {demo && (
                <Link to={CONTACT_PATH} onClick={onClose} className="inline-flex h-12 items-center justify-center rounded-lg bg-accent text-[15px] font-medium text-accent-ink hover:bg-accent-hover">
                  Request a demo
                </Link>
              )}
              {!signedIn && (
                <Button
                  variant="inverse"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    onClose()
                    onSignUp()
                  }}
                >
                  Sign up
                </Button>
              )}
              <Button
                variant="light"
                size="lg"
                className="w-full"
                onClick={() => {
                  onClose()
                  onSignIn()
                }}
              >
                {signedIn ? 'Open console' : 'Sign in'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

/**
 * Pre-login site frame: charcoal header and footer around the routed pages.
 * The `et-public` class scopes the public-only styles.
 */
export function PublicLayout() {
  const { user } = useAuth()
  const { resolved, setPreference } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname, hash } = location
  const [params, setParams] = useSearchParams()
  const [menuOpen, setMenuOpen] = useState(false)
  const authRoute = pathname === '/login' || pathname === '/signup'
  const authMode: AuthMode = pathname === '/signup' || params.get('signup') === '1' ? 'signup' : 'signin'
  const loginOpen = !user && (authRoute || params.get('signin') === '1' || params.get('signup') === '1')
  const demo = enquiryChannel() !== null

  useEffect(() => {
    // Links such as /overview#contact land on their section once it has rendered.
    if (!hash) return
    const id = window.setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView(), 60)
    return () => window.clearTimeout(id)
  }, [pathname, hash])

  useEffect(() => {
    window.scrollTo({ top: 0 })
    const meta = META[pathname] ?? META['/overview']
    document.title = meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description)
  }, [pathname])

  const openSignIn = () => {
    if (user) navigate('/dashboard')
    else setParams({ signin: '1' })
  }
  const openSignUp = () => {
    if (user) navigate('/dashboard')
    else setParams({ signup: '1' })
  }
  const closeSignIn = () => {
    if (authRoute) navigate('/overview', { replace: true })
    else setParams({}, { replace: true })
  }
  // Switching keeps the page (and any "return to" target) and only swaps the mode.
  const switchAuth = (mode: AuthMode) => {
    if (authRoute) navigate(mode === 'signup' ? '/signup' : '/login', { replace: true, state: location.state })
    else setParams(mode === 'signup' ? { signup: '1' } : { signin: '1' }, { replace: true })
  }

  return (
    <div className="et-public flex min-h-dvh flex-col bg-canvas text-ink">
      <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-ink">
        Skip to content
      </a>
      <header className="pub-chrome sticky top-0 z-40 shrink-0 border-b border-[var(--pub-dark-line)]">
        <Container className="flex h-[68px] items-center gap-8">
          <Link to="/overview" aria-label="EcoTrack home" className="shrink-0">
            <Brand tone="night" />
          </Link>
          <nav aria-label="Site" className="hidden h-full md:block">
            <ul className="flex h-full items-center gap-1">
              {PUBLIC_NAV.map((n) => (
                <li key={n.to} className="h-full">
                  <NavLink
                    to={n.to}
                    className={({ isActive }) =>
                      cn('relative flex h-full items-center px-3 text-[15px] font-medium transition-colors', isActive ? 'text-[var(--pub-on-dark)]' : 'text-[var(--pub-on-dark-2)] hover:text-[var(--pub-on-dark)]')
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {n.label}
                        {isActive && <motion.span layoutId="public-nav" className="absolute inset-x-3 bottom-0 h-[3px] rounded-t-full bg-[var(--pub-leaf)]" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <IconButton variant="night" label={resolved === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} onClick={() => setPreference(resolved === 'dark' ? 'light' : 'dark')}>
              {resolved === 'dark' ? <Moon aria-hidden strokeWidth={1.75} className="size-[18px]" /> : <Sun aria-hidden strokeWidth={1.75} className="size-[18px]" />}
            </IconButton>
            {user ? (
              <span className="hidden sm:block">
                <Button variant="light" onClick={openSignIn} icon={<ArrowRight aria-hidden className="size-4" />} trailingIcon>
                  Open console
                </Button>
              </span>
            ) : (
              <>
                <span className="hidden sm:block">
                  <button type="button" onClick={openSignIn} className="h-10 rounded-lg px-3.5 text-[15px] font-medium text-[var(--pub-on-dark-2)] transition-colors hover:bg-[var(--pub-chrome-hover)] hover:text-[var(--pub-on-dark)] active:translate-y-px">
                    Sign in
                  </button>
                </span>
                <span className="hidden sm:block">
                  <Button variant="inverse" onClick={openSignUp}>
                    Sign up
                  </Button>
                </span>
              </>
            )}
            <span className="md:hidden">
              <IconButton variant="night" label="Open menu" onClick={() => setMenuOpen(true)}>
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

      <footer className="relative shrink-0 overflow-hidden bg-[var(--pub-charcoal)] text-[var(--pub-on-dark)] [--et-focus:var(--pub-leaf)]">
        <div aria-hidden className="pub-streets absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_55%)]" />
        <Container className="relative">
          {/* Directory */}
          <div className="grid gap-10 pb-14 pt-16 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))]">
            <div className="max-w-sm sm:col-span-2 lg:col-span-1">
              <Brand tone="night" />
              <p className="mt-5 text-[15px] leading-[1.65] text-[var(--pub-on-dark-2)]">{PRODUCT_LINE}. A municipal operations console for collection visibility, accountability and crew coordination.</p>
            </div>
            <nav aria-labelledby="footer-explore">
              <h2 id="footer-explore" className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[var(--pub-on-dark-3)]">
                Explore
              </h2>
              <ul className="mt-5 flex flex-col gap-3 text-[15px]">
                {PUBLIC_NAV.map((n) => (
                  <li key={n.to}>
                    <Link to={n.to} className="text-[var(--pub-on-dark-2)] transition-colors hover:text-[var(--pub-on-dark)]">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-labelledby="footer-platform">
              <h2 id="footer-platform" className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[var(--pub-on-dark-3)]">
                Platform
              </h2>
              <ul className="mt-5 flex flex-col gap-3 text-[15px]">
                <li>
                  <button type="button" onClick={openSignIn} className="text-[var(--pub-on-dark-2)] transition-colors hover:text-[var(--pub-on-dark)]">
                    Municipal console
                  </button>
                </li>
                <li className="flex items-center gap-2 text-[var(--pub-on-dark-3)]">
                  <Link to="/preview?for=resident" className="transition-colors hover:text-[var(--pub-on-dark)]">
                    Resident app
                  </Link>
                  <span className="rounded-full border border-[var(--pub-dark-line)] px-1.5 text-[11px]">Planned</span>
                </li>
                <li className="flex items-center gap-2 text-[var(--pub-on-dark-3)]">
                  <Link to="/preview?for=collector" className="transition-colors hover:text-[var(--pub-on-dark)]">
                    Crew app
                  </Link>
                  <span className="rounded-full border border-[var(--pub-dark-line)] px-1.5 text-[11px]">Planned</span>
                </li>
                {demo && (
                  <li>
                    <Link to={CONTACT_PATH} className="font-medium text-[var(--pub-leaf-text)] hover:underline">
                      Contact us
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
            <div>
              <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[var(--pub-on-dark-3)]">Privacy</h2>
              <p className="mt-5 text-[14px] leading-[1.65] text-[var(--pub-on-dark-2)]">
                No analytics or advertising cookies. Sample data stays in your browser's local storage; maps load tiles from OpenStreetMap.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-[var(--pub-dark-line)] py-6 text-[13px] text-[var(--pub-on-dark-3)]">
            <p>{FOOTER.legal}</p>
            <p>Console figures shown on this site are sample data.</p>
            <a href="#content" className="transition-colors hover:text-[var(--pub-on-dark)]">
              Back to top ↑
            </a>
          </div>
        </Container>
      </footer>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} onSignIn={openSignIn} onSignUp={openSignUp} signedIn={!!user} />
      <LoginDialog open={loginOpen} mode={authMode} onClose={closeSignIn} onSwitch={switchAuth} />
    </div>
  )
}
