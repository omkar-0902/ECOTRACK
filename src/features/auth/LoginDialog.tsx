import { useRef, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Eye, EyeOff, Lock, Mail, User, X } from 'lucide-react'
import { useAuth } from '@/app/providers/AuthProvider'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { Brand } from '@/components/layout/Brand'
import { Button, IconButton } from '@/components/ui/Button'
import { TextField } from '@/components/ui/Controls'
import { LOGIN } from '@/content/original'
import { safeReturnPath } from '@/services/auth'
import { CAPABILITIES } from '@/content/product'
import { ContourLines } from './ContourLines'
import { cn } from '@/lib/cn'

export type AuthMode = 'signin' | 'signup'

/** Sign-in and create-account dialog. `onSwitch` flips between the two modes. */
export function LoginDialog({ open, mode = 'signin', onClose, onSwitch }: { open: boolean; mode?: AuthMode; onClose: () => void; onSwitch?: (mode: AuthMode) => void }) {
  return createPortal(<AnimatePresence>{open && <Surface mode={mode} onClose={onClose} onSwitch={onSwitch} />}</AnimatePresence>, document.body)
}

type Errors = { name?: string; email?: string; key?: string; form?: string }

const COPY = {
  signin: {
    title: 'Welcome back 👋',
    subtitle: 'Good to see you. Sign in and pick up where you left off.',
    submit: LOGIN.submit,
    switchPrompt: 'New here?',
    switchAction: 'Create an account',
    notice: 'Demo access: this build has no authentication server, so any email and access key will open the demo console. Your details are not checked or sent anywhere.',
  },
  signup: {
    title: 'New here? Let’s get you set up',
    subtitle: 'Takes about a minute. Your city’s whole collection day, in one place.',
    submit: 'Create account',
    switchPrompt: 'Already have an account?',
    switchAction: 'Sign in',
    notice: 'Heads up: account sign-up isn’t live yet. There’s no account server in this build, so creating an account just opens the demo console. Nothing you type is saved or sent.',
  },
} as const

const EMAIL = /^\S+@\S+\.\S+$/

function Surface({ mode, onClose, onSwitch }: { mode: AuthMode; onClose: () => void; onSwitch?: (mode: AuthMode) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useFocusTrap(ref, true, onClose)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [key, setKey] = useState('')
  const [remember, setRemember] = useState(true)
  const [showKey, setShowKey] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [busy, setBusy] = useState(false)
  const signup = mode === 'signup'
  const copy = COPY[mode]

  const switchMode = () => {
    setErrors({})
    setKey('')
    onSwitch?.(signup ? 'signin' : 'signup')
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const next: Errors = {}
    if (signup && name.trim().length < 2) next.name = 'Add your name so your team knows it’s you.'
    if (!email.trim()) next.email = signup ? 'Enter your work email.' : 'Enter your Network ID (email).'
    else if (!EMAIL.test(email.trim())) next.email = 'Enter a complete email address.'
    if (signup ? key.length < 8 : !key) next.key = signup ? 'Use at least 8 characters.' : 'Enter your security access key.'
    setErrors(next)
    const first = next.name ? 'input[autocomplete=name]' : next.email ? 'input[type=email]' : next.key ? 'input[data-secret]' : null
    if (first) {
      ref.current?.querySelector<HTMLInputElement>(first)?.focus()
      return
    }
    setBusy(true)
    try {
      if (signup) await signUp({ name: name.trim(), email: email.trim(), password: key }, remember)
      else await signIn(email, key, remember)
      navigate(safeReturnPath((location.state as { from?: unknown } | null)?.from), { replace: true })
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : signup ? 'Couldn’t create the account. Try again.' : 'Sign-in failed. Try again.' })
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
        className="relative grid w-full max-w-[940px] overflow-hidden rounded-xl bg-panel shadow-e3 md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]"
      >
        <form key={mode} onSubmit={submit} noValidate className="flex flex-col px-6 pb-7 pt-5 sm:px-10 sm:pb-9 sm:pt-7">
          <div className="flex items-center gap-3">
            <span className="md:hidden">
              <Brand />
            </span>
            {/* The two auth types side by side */}
            <div role="group" aria-label="Account" className="ml-auto grid grid-cols-2 gap-1 rounded-lg bg-sunken p-1 md:ml-0">
              {(['signin', 'signup'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={mode === m}
                  onClick={() => mode !== m && switchMode()}
                  className={cn('h-8 rounded-md px-3.5 text-[13.5px] font-medium transition-[background-color,color,box-shadow] duration-150', mode === m ? 'bg-panel font-semibold text-ink shadow-e1 dark:bg-raised' : 'text-ink-2 hover:text-ink')}
                >
                  {m === 'signin' ? 'Sign in' : 'Sign up'}
                </button>
              ))}
            </div>
            <IconButton label="Close" onClick={onClose} className="-mr-2 md:ml-auto">
              <X aria-hidden className="size-4" />
            </IconButton>
          </div>

          <h2 id="login-title" className="mt-6 text-[28px] font-bold leading-tight tracking-[-0.01em] text-ink">
            {copy.title}
          </h2>
          <p className="mt-2 text-[15.5px] text-ink-2">{copy.subtitle}</p>

          {errors.form && (
            <p role="alert" className="mt-5 rounded-lg border border-crit/30 bg-crit-soft px-3.5 py-2.5 text-[13px] text-crit-text">
              {errors.form}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-4">
            {signup && <TextField label="Your name" icon={<User aria-hidden className="size-4" />} data-autofocus autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />}
            <TextField
              label={signup ? 'Work email' : LOGIN.email}
              icon={<Mail aria-hidden className="size-4" />}
              data-autofocus={signup ? undefined : true}
              type="email"
              autoComplete={signup ? 'email' : 'username'}
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <div className="relative">
              <TextField
                label={signup ? 'Create a password' : LOGIN.key}
                icon={<Lock aria-hidden className="size-4" />}
                type={showKey ? 'text' : 'password'}
                data-secret
                autoComplete={signup ? 'new-password' : 'current-password'}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                hint={signup ? 'At least 8 characters.' : undefined}
                error={errors.key}
              />
              <button
                type="button"
                onClick={() => setShowKey((s) => !s)}
                aria-label={showKey ? (signup ? 'Hide password' : 'Hide access key') : signup ? 'Show password' : 'Show access key'}
                className="absolute right-1.5 top-[30px] grid size-8 place-items-center rounded-md text-ink-3 transition-colors hover:bg-hover hover:text-ink"
              >
                {showKey ? <EyeOff aria-hidden className="size-4" /> : <Eye aria-hidden className="size-4" />}
              </button>
            </div>
          </div>

          <label className="mt-5 inline-flex min-h-6 w-fit items-center gap-2.5 text-[14px] text-ink-2">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="size-[18px] rounded accent-[var(--et-accent-text)]" />
            {signup ? 'Keep me signed in' : LOGIN.remember}
          </label>

          <Button type="submit" variant="primary" size="xl" loading={busy} trailingIcon className="mt-7 w-full" icon={busy ? undefined : <ArrowRight aria-hidden className="size-4" />}>
            {copy.submit}
          </Button>
          <p className="mt-4 text-center text-[14px] text-ink-2">
            {copy.switchPrompt}{' '}
            <button type="button" onClick={switchMode} className="font-semibold text-accent-text hover:underline">
              {copy.switchAction}
            </button>
          </p>
          <p className="mt-5 rounded-lg border border-line bg-muted px-4 py-3 text-[13px] leading-5 text-ink-2">{copy.notice}</p>
        </form>

        <aside className="on-night relative isolate hidden flex-col overflow-hidden bg-night px-10 py-10 md:order-first md:flex">
          <ContourLines className="-z-10" />
          <Brand tone="night" />
          <div className="mt-12">
            <p className="text-[28px] font-bold leading-tight text-on-night">{signup ? 'Glad you’re here.' : LOGIN.panelTitle}</p>
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
