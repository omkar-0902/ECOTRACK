import { useMemo, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router'
import { Map, Phone, Plus, SearchX, User, Users, X } from 'lucide-react'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { useAppStore, useData } from '@/store/StoreProvider'
import { addCollector } from '@/store/commands'
import { EmptyState, Page, Panel } from '@/components/layout/PageHeader'
import { Button, IconButton } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Avatar } from '@/components/ui/Avatar'
import { SearchInput, SelectField, TextField } from '@/components/ui/Controls'
import { UnitStatusBadge } from '@/components/ui/Status'
import { useToast } from '@/components/feedback/Toaster'
import { CollectorTable } from '@/features/views/OpsViews'
import { COLLECTORS } from '@/content/original'
import type { Collector } from '@/types/domain'

const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export default function CollectorsPage() {
  const collectors = useData((d) => d.collectors)
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | 'online' | 'offline'>('all')
  const addOpen = params.get('add') === '1'
  const selectedId = params.get('collector')
  const selected = collectors.find((c) => c.id === selectedId) ?? null

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return collectors.filter((c) => (status === 'all' || (status === 'online') === c.online) && (!q || c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.phone.includes(q)))
  }, [collectors, search, status])
  const online = collectors.filter((c) => c.online).length

  return (
    <Page
      title={COLLECTORS.title}
      subtitle={COLLECTORS.subtitle}
      actions={
        <Button variant="primary" icon={<Plus aria-hidden className="size-4" />} onClick={() => setParam('add', '1')}>
          {COLLECTORS.add}
        </Button>
      }
    >
      <div className="grid gap-5 lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-6">
        <Panel label="Collector roster" fill>
          <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-line p-4">
            <SearchInput label="Search collectors" value={search} onChange={setSearch} placeholder="Search name, ECO-ID or phone" className="w-full sm:w-72" />
            <SelectField
              label="Status"
              value={status}
              onChange={(v) => setStatus(v as typeof status)}
              options={[
                { value: 'all', label: 'All statuses' },
                { value: 'online', label: 'Online' },
                { value: 'offline', label: 'Offline' },
              ]}
              className="w-40"
            />
            <p className="ml-auto text-[14px] text-ink-3">
              <span className="tabular font-medium text-ink">{collectors.length}</span> registered, <span className="tabular font-medium text-ink">{online}</span> online
            </p>
          </div>

          {collectors.length === 0 ? (
            <EmptyState
              icon={<Users aria-hidden className="size-5" />}
              title={COLLECTORS.empty}
              body="Register a collector to generate their ECO-ID credential."
              action={
                <Button variant="primary" size="sm" icon={<Plus aria-hidden className="size-3.5" />} onClick={() => setParam('add', '1')}>
                  {COLLECTORS.add}
                </Button>
              }
            />
          ) : filtered.length === 0 ? (
            <EmptyState icon={<SearchX aria-hidden className="size-5" />} title="No collectors match" body="Try a different search or status." />
          ) : (
            <div className="max-h-[520px] min-h-0 overflow-auto lg:max-h-none lg:flex-1">
              <CollectorTable collectors={filtered} selectedId={selectedId} onSelect={(id) => setParam('collector', id)} />
            </div>
          )}
        </Panel>

        <Panel label="Collector details" className="lg:min-h-0">
          {selected ? <CollectorDetail collector={selected} onClose={() => setParam('collector', null)} /> : <EmptyState icon={<User aria-hidden className="size-5" />} title="No collector selected" body="Select a collector in the roster to see their details." />}
        </Panel>
      </div>

      <Dialog open={addOpen} onClose={() => setParam('add', null)} title={COLLECTORS.form.title} description={COLLECTORS.form.subtitle}>
        {addOpen && (
          <AddCollectorForm
            onDone={(id) => {
              const next = new URLSearchParams(params)
              next.delete('add')
              next.set('collector', id)
              setParams(next, { replace: true })
            }}
          />
        )}
      </Dialog>
    </Page>
  )
}

function CollectorDetail({ collector: c, onClose }: { collector: Collector; onClose: () => void }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-start gap-3 border-b border-line bg-muted p-5">
        <Avatar name={c.name} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[18px] font-bold text-ink">{c.name}</p>
          <p className="text-[13px] text-ink-3">{c.id}</p>
        </div>
        <IconButton label="Close details" size="sm" onClick={onClose}>
          <X aria-hidden className="size-4" />
        </IconButton>
      </div>
      <dl className="divide-y divide-line px-5">
        <Detail label="Status">
          <UnitStatusBadge online={c.online} />
        </Detail>
        <Detail label={COLLECTORS.columns.phone}>
          <a href={`tel:${c.phone}`} className="tabular text-ink hover:underline">
            {c.phone}
          </a>
        </Detail>
        <Detail label="Registered">{dateFmt.format(c.registeredAt)}</Detail>
        <Detail label="Last reported position">{c.position ? <span className="tabular text-[12.5px]">{`${c.position.lat.toFixed(4)}, ${c.position.lng.toFixed(4)}`}</span> : 'None reported'}</Detail>
      </dl>
      {c.position && (
        <div className="p-5 pt-3">
          <ButtonLink to={`/tracking?unit=${encodeURIComponent(c.id)}`} variant="outline" className="w-full" icon={<Map aria-hidden className="size-4" />}>
            Show on Live Tracker
          </ButtonLink>
        </div>
      )}
    </div>
  )
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 text-[14px]">
      <dt className="text-ink-3">{label}</dt>
      <dd className="text-right text-ink">{children}</dd>
    </div>
  )
}

function AddCollectorForm({ onDone }: { onDone: (id: string) => void }) {
  const store = useAppStore()
  const toast = useToast()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState<{ name?: string; phone?: string; form?: string }>({})
  const [busy, setBusy] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (name.trim().length < 2) next.name = 'Enter the collector’s full name.'
    if (!/^\+?\d{10,15}$/.test(phone.replace(/[\s-]/g, ''))) next.phone = 'Enter a phone number of 10 to 15 digits.'
    setErrors(next)
    if (next.name || next.phone) return
    setBusy(true)
    const res = store.run((d) => addCollector(d, { name, phone }, Date.now()))
    setBusy(false)
    if (!res.ok) {
      setErrors({ form: res.error })
      return
    }
    toast.success('Credentials generated', `${res.value.name} is registered as ${res.value.id}.`)
    onDone(res.value.id)
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      {errors.form && (
        <p role="alert" className="rounded-lg border border-crit/30 bg-crit-soft px-3.5 py-2.5 text-[13px] text-crit-text">
          {errors.form}
        </p>
      )}
      <TextField label={COLLECTORS.form.name} icon={<User aria-hidden className="size-4" />} data-autofocus autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} placeholder={COLLECTORS.form.namePlaceholder} error={errors.name} />
      <TextField
        label={COLLECTORS.form.phone}
        icon={<Phone aria-hidden className="size-4" />}
        type="tel"
        inputMode="tel"
        autoComplete="off"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder={COLLECTORS.form.phonePlaceholder}
        hint="An ECO-ID credential is generated when you submit."
        error={errors.phone}
      />
      <Button type="submit" variant="primary" size="lg" loading={busy} className="mt-1 w-full">
        {COLLECTORS.form.submit}
      </Button>
    </form>
  )
}
