import { lazy, Suspense } from 'react'
import { createBrowserRouter, Link, Navigate, useLocation } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { useAuth } from './providers/AuthProvider'
import { PublicLayout } from '@/features/public/PublicLayout'
import OverviewPage from '@/features/public/OverviewPage'

const FeaturesPage = lazy(() => import('@/features/public/FeaturesPage'))
const HowItWorksPage = lazy(() => import('@/features/public/HowItWorksPage'))
const PreviewPage = lazy(() => import('@/features/public/PreviewPage'))
const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage'))
const TrackingPage = lazy(() => import('@/features/tracking/TrackingPage'))
const ReportsPage = lazy(() => import('@/features/reports/ReportsPage'))
const RewardsPage = lazy(() => import('@/features/rewards/RewardsPage'))
const CollectorsPage = lazy(() => import('@/features/collectors/CollectorsPage'))

function RequireAuth() {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  return <AppShell />
}

function NotFound() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="text-sm text-ink-3">404</p>
      <h1 className="text-xl font-semibold text-ink">There's no page at this address</h1>
      <div className="mt-2 flex gap-2">
        <Link to="/dashboard" className="inline-flex h-9 items-center rounded-md bg-accent px-4 text-sm font-semibold text-accent-ink hover:bg-accent-hover">
          Dashboard
        </Link>
        <Link to="/overview" className="inline-flex h-9 items-center rounded-md border border-line-strong px-4 text-sm text-ink hover:bg-hover">
          Home
        </Link>
      </div>
    </div>
  )
}

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="flex-1" aria-busy="true" />}>{children}</Suspense>
}

/**
 * Public site: four independent routes (/ redirects to /overview). /login renders
 * Overview with the sign-in dialog open. Console routes are unchanged.
 */
export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/overview" replace /> },
  {
    Component: PublicLayout,
    children: [
      { path: '/overview', Component: OverviewPage },
      { path: '/login', Component: OverviewPage },
      { path: '/features', element: <Lazy><FeaturesPage /></Lazy> },
      { path: '/how-it-works', element: <Lazy><HowItWorksPage /></Lazy> },
      { path: '/preview', element: <Lazy><PreviewPage /></Lazy> },
    ],
  },
  {
    Component: RequireAuth,
    children: [
      { path: '/dashboard', Component: DashboardPage },
      { path: '/tracking', Component: TrackingPage },
      { path: '/reports', Component: ReportsPage },
      { path: '/rewards', Component: RewardsPage },
      { path: '/collectors', Component: CollectorsPage },
    ],
  },
  { path: '*', Component: NotFound },
])
