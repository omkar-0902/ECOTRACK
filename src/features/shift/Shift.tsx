import { useState } from 'react'
import { AlertCircle, Clock3, MoonStar } from 'lucide-react'
import { useAppStore, useData } from '@/store/StoreProvider'
import { setShiftTiming } from '@/store/commands'
import { Button } from '@/components/ui/Button'
import { Popover } from '@/components/ui/Popover'
import { useToast } from '@/components/feedback/Toaster'
import { DASHBOARD } from '@/content/original'
import { format12, formatDuration, isOvernight, shiftDuration, shiftProblem, type ShiftWindow } from '@/lib/shift'
import { shiftWindowText, useShiftWindow } from './useShiftWindow'
import { cn } from '@/lib/cn'

/**
 * Shift timing: the deployment start and operations-cease times for field
 * crews. The editor is shared by the dashboard panel and the top-bar control,
 * so both apply the same rules (setShiftTiming) and show the same states.
 */

function WindowDot({ w, className }: { w: ShiftWindow; className?: string }) {
  return (
    <span aria-hidden className={cn('relative inline-flex size-2 shrink-0', className)}>
      {w.state === 'within' && <span className="et-ping absolute inset-0 rounded-full bg-brand" />}
      <span className={cn('relative size-2 rounded-full', w.state === 'within' ? 'bg-brand' : w.state === 'invalid' ? 'bg-crit' : 'bg-ink-3')} />
    </span>
  )
}

/** The timing form: two time fields, a live summary (length, overnight, validation) and the save actions. */
export function ShiftEditor({ idPrefix, onSaved }: { idPrefix?: string; onSaved?: () => void }) {
  const fieldId = (name: string) => (idPrefix ? `${idPrefix}-${name}` : name)
  const store = useAppStore()
  const toast = useToast()
  const saved = useData((d) => d.shift)
  const [draft, setDraft] = useState(saved)
  const [base, setBase] = useState(saved)
  const [failure, setFailure] = useState<string | null>(null)
  // Saved elsewhere (the other editor): follow it, unless this editor has its own unsaved edits.
  if (base !== saved) {
    setBase(saved)
    if (draft.start === base.start && draft.end === base.end) setDraft(saved)
  }
  const dirty = draft.start !== saved.start || draft.end !== saved.end
  const problem = shiftProblem(draft)
  const length = shiftDuration(draft)

  const commit = () => {
    if (problem) return
    const res = store.run((d) => setShiftTiming(d, draft))
    if (res.ok) {
      setFailure(null)
      toast.success('Shift timing committed', `Deployment ${format12(draft.start)}, operations cease ${format12(draft.end)}.`)
      onSaved?.()
    } else {
      setFailure(res.error)
      toast.error('Shift timing not saved', res.error)
    }
  }
  const change = (key: 'start' | 'end') => (v: string) => {
    setFailure(null)
    setDraft((d) => ({ ...d, [key]: v }))
  }

  const invalid = problem === 'same'
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
        <TimeField id={fieldId('deploy')} label={DASHBOARD.shift.start.label} hint={DASHBOARD.shift.start.hint} value={draft.start} invalid={invalid} onChange={change('start')} autoFocus />
        <TimeField id={fieldId('cease')} label={DASHBOARD.shift.end.label} hint={DASHBOARD.shift.end.hint} value={draft.end} invalid={invalid} onChange={change('end')} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 border-t border-line pt-3">
        <div role="status" aria-live="polite" className="min-w-0 text-[13px] leading-5">
          {problem ? (
            <p className="flex items-center gap-1.5 font-medium text-crit-text">
              <AlertCircle aria-hidden className="size-4 shrink-0" />
              {problem === 'same' ? 'Start and cease must be different times.' : 'Enter both times as hours and minutes.'}
            </p>
          ) : (
            <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-ink-2">
              <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
                <Clock3 aria-hidden className="size-4 text-ink-3" />
                {formatDuration(length!)} shift
              </span>
              {isOvernight(draft) && (
                <span className="inline-flex items-center gap-1 text-ink-2">
                  <MoonStar aria-hidden className="size-3.5" /> ends the next day
                </span>
              )}
              <span className={dirty ? 'font-semibold text-warn-text' : 'text-ink-3'}>{dirty ? 'Unsaved changes' : 'Saved'}</span>
            </p>
          )}
          {failure && (
            <p role="alert" className="mt-1 text-crit-text">
              {failure}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setDraft(saved)
              setFailure(null)
            }}
            disabled={!dirty}
          >
            {DASHBOARD.shift.reset}
          </Button>
          <Button variant="primary" size="sm" onClick={commit} disabled={!dirty || !!problem}>
            {DASHBOARD.shift.commit}
          </Button>
        </div>
      </div>
    </div>
  )
}

function TimeField({ id, label, hint, value, invalid, onChange, autoFocus }: { id: string; label: string; hint: string; value: string; invalid?: boolean; onChange: (v: string) => void; autoFocus?: boolean }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-semibold text-ink">
        {label}
      </label>
      <input
        id={id}
        type="time"
        required
        data-autofocus={autoFocus || undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={`${id}-hint`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="tabular h-10 w-full rounded-lg border border-line-strong bg-panel px-3 text-[15px] font-medium text-ink transition-[border-color,box-shadow] duration-150 hover:border-ink-3 focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent-soft aria-[invalid=true]:border-crit aria-[invalid=true]:ring-crit-soft"
      />
      <p id={`${id}-hint`} className="text-[12px] leading-4 text-ink-3">
        {hint}
      </p>
    </div>
  )
}

/**
 * Top-bar control: always shows the saved shift and whether the current time
 * is inside it, and opens the editor in place from any console page.
 */
export function ShiftMenu() {
  const { shift, window: w } = useShiftWindow()
  const range = `${shift.start}–${shift.end}`
  return (
    <Popover
      label="Shift timing"
      className="w-[min(92vw,380px)]"
      trigger={({ toggle, ...aria }) => (
        <button
          type="button"
          onClick={toggle}
          {...aria}
          aria-label={`Shift timing ${format12(shift.start)} to ${format12(shift.end)}, ${shiftWindowText(w).toLowerCase()}. Edit shift timing`}
          className="group flex h-9 items-center gap-2 rounded-full border border-night-line bg-night-2 pl-2.5 pr-3 text-[13px] font-medium text-on-night transition-[background-color,border-color] duration-150 hover:border-white/20 hover:bg-night-3 active:translate-y-px aria-expanded:border-brand/50 aria-expanded:bg-night-3"
        >
          <WindowDot w={w} />
          {/* Full label where the top bar has room; the clock alone where the module nav needs the space */}
          <span className="hidden text-on-night-2 2xl:inline">Shift</span>
          <span className="tabular hidden sm:inline lg:hidden xl:inline">{range}</span>
          <Clock3 aria-hidden className="size-4 text-on-night-2 sm:hidden lg:block xl:hidden" />
        </button>
      )}
    >
      {(close) => (
        <div>
          <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-3.5">
            <div className="min-w-0">
              <p className="text-[15px] font-semibold text-ink">{DASHBOARD.shift.title}</p>
              <p className="mt-0.5 flex items-center gap-2 text-[13px] text-ink-2">
                <WindowDot w={w} />
                {shiftWindowText(w, true)}
              </p>
            </div>
          </div>
          <div className="p-4">
            <ShiftEditor idPrefix="shift-menu" onSaved={close} />
          </div>
        </div>
      )}
    </Popover>
  )
}
