import { Component, type ErrorInfo, type ReactNode } from 'react'
import { RotateCcw, TriangleAlert } from 'lucide-react'

interface Props {
  children: ReactNode
  /** Short name of the protected area, used in the message. */
  area: string
  /** Changing this value resets the boundary (e.g. the route path). */
  resetKey?: unknown
  compact?: boolean
}
interface State {
  error: Error | null
  resetKey: unknown
}

/** Contains a failure to one widget or page so the rest of the app stays usable. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, resetKey: this.props.resetKey }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error }
  }

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
    if (props.resetKey !== state.resetKey) return { error: null, resetKey: props.resetKey }
    return null
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface for developers; the UI shows a recovery path instead of crashing.
    console.error(`[EcoTrack] ${this.props.area} failed`, error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div role="alert" className={`flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line-strong bg-panel text-center ${this.props.compact ? 'p-6' : 'p-10'}`}>
        <TriangleAlert aria-hidden className="size-5 text-warn-text" />
        <p className="text-sm font-medium text-ink">{this.props.area} couldn't be displayed</p>
        <p className="max-w-sm text-xs text-ink-3">The rest of EcoTrack is unaffected. Try again, or reload the page if this keeps happening.</p>
        <button type="button" onClick={() => this.setState({ error: null })} className="mt-2 inline-flex h-8 items-center gap-1.5 rounded-md border border-line-strong bg-raised px-3 text-xs font-medium text-ink hover:bg-hover">
          <RotateCcw aria-hidden className="size-3.5" />
          Try again
        </button>
      </div>
    )
  }
}
