/**
 * Enquiry form. Renders only when site/config.ts names a real destination:
 *   endpoint — POSTs JSON and reports success only on a 2xx response
 *   email    — opens the visitor's email app with the message filled in
 */
import { useId, useState, type FormEvent } from 'react'
import { ArrowRight, CheckCircle2, Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { enquiryChannel } from './config'

type Fields = { name: string; organisation: string; email: string; message: string }
type Errors = Partial<Record<keyof Fields | 'form', string>>

const EMPTY: Fields = { name: '', organisation: '', email: '', message: '' }

function Field({ label, error, textarea, ...input }: { label: string; error?: string; textarea?: boolean } & React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId()
  const cls = cn(
    'w-full rounded-lg border bg-[var(--pub-glass)] px-4 text-[16px] text-[var(--pub-on-dark)] placeholder:text-[var(--pub-on-dark-3)] transition-colors focus:border-[var(--pub-leaf)] focus:outline-none',
    error ? 'border-[var(--pub-err)]' : 'border-[var(--pub-glass-line)] hover:border-[var(--pub-glass-line-hover)]',
    textarea ? 'min-h-[120px] py-3' : 'h-12',
  )
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[14px] font-medium text-[var(--pub-on-dark-2)]">
        {label}
      </label>
      {textarea ? <textarea id={id} aria-invalid={!!error || undefined} aria-describedby={error ? `${id}-e` : undefined} className={cls} {...input} /> : <input id={id} aria-invalid={!!error || undefined} aria-describedby={error ? `${id}-e` : undefined} className={cls} {...input} />}
      {error && (
        <p id={`${id}-e`} role="alert" className="text-[13px] text-[var(--pub-err)]">
          {error}
        </p>
      )}
    </div>
  )
}

export function ContactForm() {
  const channel = enquiryChannel()
  const [f, setF] = useState<Fields>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'opened'>('idle')
  if (!channel) return null

  const set = (k: keyof Fields) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const next: Errors = {}
    if (!f.name.trim()) next.name = 'Please enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) next.email = 'Please enter a valid email address.'
    if (!f.message.trim()) next.message = 'Please tell us a little about what you need.'
    setErrors(next)
    if (Object.keys(next).length) return

    if (channel.kind === 'email') {
      const subject = encodeURIComponent(`EcoTrack enquiry${f.organisation.trim() ? ` from ${f.organisation.trim()}` : ''}`)
      const body = encodeURIComponent(`${f.message.trim()}\n\n${f.name.trim()}${f.organisation.trim() ? `\n${f.organisation.trim()}` : ''}\n${f.email.trim()}`)
      window.location.href = `mailto:${channel.address}?subject=${subject}&body=${body}`
      setState('opened')
      return
    }

    setState('sending')
    try {
      const res = await fetch(channel.url, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(f) })
      if (!res.ok) throw new Error(String(res.status))
      setState('sent')
      setF(EMPTY)
    } catch {
      setState('idle')
      setErrors({ form: 'Your message could not be sent. Please try again in a moment.' })
    }
  }

  if (state === 'sent')
    return (
      <div role="status" className="flex flex-col items-start gap-3 rounded-2xl border border-[var(--pub-dark-line)] bg-[var(--pub-glass)] p-8">
        <CheckCircle2 aria-hidden className="size-8 text-[var(--pub-leaf-text)]" />
        <p className="text-[22px] font-bold text-[var(--pub-on-dark)]">Thank you. Your message has been sent.</p>
        <p className="text-[16px] text-[var(--pub-on-dark-2)]">We will reply to the email address you gave us.</p>
      </div>
    )

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5 rounded-2xl border border-[var(--pub-dark-line)] bg-[var(--pub-glass)] p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" autoComplete="name" value={f.name} onChange={set('name')} error={errors.name} />
        <Field label="Organisation" autoComplete="organization" value={f.organisation} onChange={set('organisation')} placeholder="City, municipality or company" />
      </div>
      <Field label="Work email" type="email" autoComplete="email" value={f.email} onChange={set('email')} error={errors.email} />
      <Field label="How can we help?" textarea value={f.message} onChange={set('message')} error={errors.message} placeholder="Tell us about your city or area, and what you would like to see." />
      {errors.form && (
        <p role="alert" className="text-[14px] text-[var(--pub-err)]">
          {errors.form}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" variant="primary" size="lg" loading={state === 'sending'} icon={channel.kind === 'email' ? <Mail aria-hidden className="size-4" /> : <ArrowRight aria-hidden className="size-4" />} trailingIcon={channel.kind !== 'email'}>
          {channel.kind === 'email' ? 'Write to us' : 'Send message'}
        </Button>
        <p role="status" className="text-[14px] text-[var(--pub-on-dark-3)]">
          {state === 'opened' ? 'Your email app should now be open with your message ready to send.' : channel.kind === 'email' ? 'Opens your email app with your message ready to send.' : null}
        </p>
      </div>
    </form>
  )
}
