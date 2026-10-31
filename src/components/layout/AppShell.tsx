import { Suspense, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary'
import { IconButton } from '@/components/ui/Button'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { PageSkeleton } from './PageHeader'

function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useFocusTrap(ref, open, onClose)

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[800] lg:hidden">
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%', transition: { duration: 0.18 } }}
            transition={{ type: 'spring', stiffness: 420, damping: 40 }}
            className="absolute inset-y-0 left-0 w-[min(84vw,288px)] shadow-e3"
          >
            <span className="absolute right-3 top-3 z-10">
              <IconButton variant="night" label="Close navigation" onClick={onClose}>
                <X aria-hidden className="size-5" />
              </IconButton>
            </span>
            <Sidebar onNavigate={onClose} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

/**
 * Architectural application shell.
 * The desktop operational workspace fits 100% within the browser viewport (strict viewport-fit).
 * On narrow / mobile screens, content flows with natural document height and page scrolling.
 */
export function AppShell() {
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname])

  return (
    <div className="et-workspace flex h-dvh flex-col overflow-hidden text-ink">
      <a
        href="#main"
        className="sr-only z-[2000] rounded-md bg-accent px-3 py-2 text-accent-ink focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        Skip to main content
      </a>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Topbar onOpenNav={() => setMobileOpen(true)} />

      {/* Pages fit this region on desktop; on narrow mobile screens it scrolls naturally. */}
      <main
        id="main"
        ref={mainRef}
        tabIndex={-1}
        className="relative flex min-h-0 flex-1 flex-col overflow-y-auto focus:outline-none"
      >
        <ErrorBoundary area="This page" resetKey={pathname}>
          <Suspense fallback={<PageSkeleton />}>
            <motion.div
              key={pathname}
              className="relative z-10 flex min-h-full flex-col lg:min-h-0 lg:flex-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.16 }}
            >
              <Outlet />
            </motion.div>
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  )
}
