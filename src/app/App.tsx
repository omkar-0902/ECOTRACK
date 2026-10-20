import { useEffect } from 'react'
import { RouterProvider } from 'react-router/dom'
import { MotionConfig } from 'motion/react'
import { ThemeProvider } from './providers/ThemeProvider'
import { AuthProvider } from './providers/AuthProvider'
import { StoreProvider, useAppStore } from '@/store/StoreProvider'
import { ToastProvider, useToast } from '@/components/feedback/Toaster'
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary'
import { router } from './router'

let startupNoticeShown = false

/** Tells the operator once if locally saved data was unreadable and had to be reset. */
function StartupNotice() {
  const store = useAppStore()
  const toast = useToast()
  useEffect(() => {
    if (store.startupIssue && !startupNoticeShown) {
      startupNoticeShown = true
      toast.warning('Saved data was reset', `The stored data was unusable (${store.startupIssue}).`)
    }
  }, [store, toast])
  return null
}

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <ToastProvider>
          <StoreProvider>
            <AuthProvider>
              <StartupNotice />
              <ErrorBoundary area="EcoTrack">
                <RouterProvider router={router} />
              </ErrorBoundary>
            </AuthProvider>
          </StoreProvider>
        </ToastProvider>
      </ThemeProvider>
    </MotionConfig>
  )
}
