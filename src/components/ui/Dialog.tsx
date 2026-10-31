import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { cn } from '@/lib/cn'
import { IconButton } from './Button'

let openCount = 0
function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    openCount++
    document.body.style.overflow = 'hidden'
    return () => {
      openCount--
      if (openCount === 0) document.body.style.overflow = ''
    }
  }, [active])
}

interface BaseProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  className?: string
}

function Surface({ onClose, title, description, children, footer, className }: Omit<BaseProps, 'open'>) {
  const ref = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descId = useId()
  useFocusTrap(ref, true, onClose)
  useScrollLock(true)
  return (
    <div className="fixed inset-0 z-[1000] flex items-end justify-center sm:items-center sm:p-6">
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
        onClick={onClose}
      />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        initial={{ y: 24, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 12, opacity: 0, transition: { duration: 0.14 } }}
        transition={{ type: 'spring', stiffness: 420, damping: 38 }}
        className={cn(
          'relative flex max-h-[100dvh] w-full flex-col bg-panel text-ink shadow-e3 focus:outline-none',
          'max-h-[92dvh] max-w-lg rounded-t-lg border border-line sm:rounded-lg',
          className,
        )}
      >
        <header className="flex items-start gap-3 border-b border-line px-6 pb-4 pt-6">
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-[20px] font-bold leading-7 text-ink">
              {title}
            </h2>
            {description && (
              <div id={descId} className="mt-1 text-[14px] text-ink-2">
                {description}
              </div>
            )}
          </div>
          <IconButton label="Close" onClick={onClose} className="-mr-2 -mt-1">
            <X aria-hidden className="size-4" />
          </IconButton>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <footer className="flex flex-wrap items-center justify-end gap-2 border-t border-line bg-muted px-6 py-4">{footer}</footer>}
      </motion.div>
    </div>
  )
}

export function Dialog({ open, ...rest }: BaseProps) {
  return createPortal(<AnimatePresence>{open && <Surface key="dialog" {...rest} />}</AnimatePresence>, document.body)
}
