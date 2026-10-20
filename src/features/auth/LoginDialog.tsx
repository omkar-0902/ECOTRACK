import { useRef, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Eye, EyeOff, Lock, Mail, X } from 'lucide-react'
import { useAuth } from '@/app/providers/AuthProvider'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { Brand } from '@/components/layout/Brand'
import { Button, IconButton } from '@/components/ui/Button'
import { TextField } from '@/components/ui/Controls'
import { ACCOUNT, LOGIN } from '@/content/original'
import { CAPABILITIES } from '@/content/product'
import { ContourLines } from '@/features/public/Sections'

export function LoginDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return createPortal(<AnimatePresence>{open && <Surface onClose={onClose} />}</AnimatePresence>, document.body)
}

type Errors = { email?: string; key?: string; form?: string }

function Surface({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useFocusTrap(ref, true, onClose)
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [key, setKey] = useState('')
  const [remember, setRemember] = useState(true)
  const [showKey, setShowKey] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const next: Errors = {}
    if (!email.trim()) next.email = 'Enter your Network ID (email).'
    else if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = 'Enter a complete email address.'
    if (!key) next.key = 'Enter your security access key.'
    setErrors(next)
    if (next.email || next.key) {
      ref.current?.querySelector<HTMLInputElement>(next.email ? 'input[type=email]' : 'input[autocomplete=current-password]')?.focus()
      return
    }
    setBusy(true)
    try {
      await signIn(email, key, remember)
      const from = (location.state as { from?: string } | null)?.from
      navigate(from && from !== '/login' ? from : '/dashboard', { replace: true })
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'Sign-in failed. Try again.' })
    } finally {
      setBusy(false)
    }
  }

  const modules = CAPABILITIES.filter((c) => c.status === 'available')

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center overflow-y-auto p-3 sm:items-center sm:p-6">
      <motion.div aria-hidden className="fixed inset-0 bg-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        initial={{ opacity: 0, y: 12, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 6, transition: { duration: 0.12 } }}
        transition={{ type: 'spring', stiffness: 420, damping: 38 }}
        className="relative grid w-full max-w-[940px] overflow-hidden rounded-lg bg-panel shadow-e3 md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]"
      >
        <form onSubmit={submit} noValidate className="flex flex-col px-6 pb-7 pt-5 sm:px-10 sm:pb-10 sm:pt-7">
          <div className="flex items-center justify-between">
            <span className="md:hidden">
              <Brand />
            </span>
            <IconButton label="Close" onClick={onClose} className="-mr-2 ml-auto">
              <X aria-hidden className="size-4" />
            </IconButton>
          </div>
          <h2 id="login-title" className="mt-6 text-[30px] font-bold leading-tight text-ink md:mt-4">
            {LOGIN.title}
          </h2>
          <p className="mt-2 text-[16px] text-ink-2">{LOGIN.subtitle}</p>

          {errors.form && (
            <p role="alert" className="mt-5 rounded-lg border border-crit/30 bg-crit-soft px-3.5 py-2.5 text-[13px] text-crit-text">
              {errors.form}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-4">
            <TextField
              label={LOGIN.email}
              icon={<Mail aria-hidden className="size-4" />}
              data-autofocus
              type="email"
              autoComplete="username"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <div className="relative">
              <TextField
                label={LOGIN.key}
                icon={<Lock aria-hidden className="size-4" />}
                type={showKey ? 'text' : 'password'}
                autoComplete="current-password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                error={errors.key}
              />
              <button
                type="button"
                onClick={() => setShowKey((s) => !s)}
                aria-label={showKey ? 'Hide access key' : 'Show access key'}
                className="absolute right-1.5 top-[30px] grid size-8 place-items-center rounded-md text-ink-3 hover:bg-hover hover:text-ink"
              >
                {showKey ? <EyeOff aria-hidden className="size-4" /> : <Eye aria-hidden className="size-4" />}
              </button>
            </div>
          </div>

          <label className="mt-5 inline-flex min-h-6 w-fit items-center gap-2.5 text-[14px] text-ink-2">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="size-[18px] rounded accent-[var(--et-accent-text)]" />
            {LOGIN.remember}
          </label>

          <Button type="submit" variant="primary" size="xl" loading={busy} className="mt-7 w-full flex-row-reverse" icon={busy ? undefined : <ArrowRight aria-hidden className="size-4" />}>
            {LOGIN.submit}
          </Button>
          <p className="mt-5 rounded-lg border border-line bg-muted px-4 py-3 text-[13px] leading-5 text-ink-2">
            This build has no authentication server, so the access key is not verified. Use the administrator account <span className="font-semibold text-ink">{ACCOUNT.email}</span> with any key.
          </p>
        </form>

        <aside className="on-night relative isolate hidden flex-col overflow-hidden bg-night px-10 py-10 md:order-first md:flex">
          <ContourLines className="-z-10" />
          <Brand tone="night" />
          <div className="mt-12">
            <p className="text-[28px] font-bold leading-tight text-on-night">{LOGIN.panelTitle}</p>
            <p className="mt-3 max-w-xs text-[15px] leading-6 text-on-night-2">{LOGIN.panelBody}</p>
          </div>
          <ul className="mt-auto flex flex-col pt-10">
            {modules.map((m) => (
              <li key={m.id} className="flex items-start gap-3.5 border-t border-night-line py-4 last:pb-0">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-night-2 text-brand">
                  <m.icon aria-hidden strokeWidth={1.75} className="size-4" />
                </span>
                <span>
                  <span className="block text-[15px] font-semibold text-on-night">{m.name}</span>
                  <span className="block text-[13px] leading-snug text-on-night-3">{m.summary.split('.')[0]}.</span>
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </motion.div>
    </div>
  )
}
