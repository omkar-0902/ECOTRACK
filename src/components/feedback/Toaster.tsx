import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AlertTriangle, CheckCircle2, Info, OctagonAlert, X } from 'lucide-react'
import { cn } from '@/lib/cn'

export type ToastTone = 'success' | 'info' | 'warning' | 'error'

interface Toast {
  id: number
  tone: ToastTone
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}

type ToastInput = Omit<Toast, 'id'>

interface ToastApi {
  show: (t: ToastInput) => void
  success: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
  warning: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
}

const ToastContext = createContext<ToastApi | null>(null)

/** Durations scale with how much attention the message needs. */
const DURATION: Record<ToastTone, number> = { success: 4000, info: 5000, warning: 7000, error: 9000 }
const ICON = { success: CheckCircle2, info: Info, warning: AlertTriangle, error: OctagonAlert }
const TONE_CLASS: Record<ToastTone, string> = {
  success: 'text-ok-text',
  info: 'text-info',
  warning: 'text-warn-text',
  error: 'text-crit-text',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counter = useRef(0)

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), [])
  const show = useCallback((t: ToastInput) => {
    const id = ++counter.current
    setToasts((list) => [...list.slice(-3), { ...t, id }])
  }, [])

  const api = useMemo<ToastApi>(
    () => ({
      show,
      success: (title, description) => show({ tone: 'success', title, description }),
      info: (title, description) => show({ tone: 'info', title, description }),
      warning: (title, description) => show({ tone: 'warning', title, description }),
      error: (title, description) => show({ tone: 'error', title, description }),
    }),
    [show],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[1100] flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6">
        {/* Polite region for everything; errors are additionally announced assertively. */}
        <div role="status" aria-live="polite" className="sr-only">
          {toasts.filter((t) => t.tone !== 'error').map((t) => `${t.title}. ${t.description ?? ''}`).join(' ')}
        </div>
        <div role="alert" aria-live="assertive" className="sr-only">
          {toasts.filter((t) => t.tone === 'error').map((t) => `${t.title}. ${t.description ?? ''}`).join(' ')}
        </div>
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (paused) return
    const id = setTimeout(onDismiss, DURATION[toast.tone])
    return () => clearTimeout(id)
  }, [paused, toast.tone, onDismiss])
  const Icon = ICON[toast.tone]
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24, transition: { duration: 0.15 } }}
      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border border-line-strong bg-raised p-3.5 pr-2 shadow-e3"
    >
      <Icon aria-hidden className={cn('mt-0.5 size-[18px] shrink-0', TONE_CLASS[toast.tone])} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink">{toast.title}</p>
        {toast.description && <p className="mt-0.5 text-xs text-ink-2 break-anywhere">{toast.description}</p>}
        {toast.action && (
          <button
            type="button"
            onClick={() => {
              toast.action!.onClick()
              onDismiss()
            }}
            className="mt-2 text-xs font-medium text-accent-text underline-offset-4 hover:underline"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button type="button" onClick={onDismiss} aria-label="Dismiss notification" className="grid size-8 shrink-0 place-items-center rounded-md text-ink-3 hover:bg-hover hover:text-ink">
        <X aria-hidden className="size-4" />
      </button>
    </motion.div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}
