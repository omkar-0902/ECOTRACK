import { emptyData, type DataRepository } from '@/data/repositories/demoRepository'
import type { AppData, CommandOutcome, CommandResult } from './types'

type Listener = () => void

/** Small external store: commands are pure functions over AppData; `run` applies one and persists. */
export function createAppStore(repo: DataRepository) {
  const loaded = repo.load()
  const startupIssue = loaded.status === 'invalid' ? loaded.reason : null
  let data: AppData = loaded.status === 'ok' ? loaded.data : emptyData()
  if (loaded.status !== 'ok') repo.save(data)
  const listeners = new Set<Listener>()

  return {
    startupIssue,
    getState: () => data,
    subscribe(listener: Listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    run<T>(command: (d: AppData) => CommandOutcome<T>): CommandResult<T> {
      const outcome = command(data)
      if (!outcome.ok) return outcome
      data = outcome.data
      repo.save(data)
      listeners.forEach((l) => l())
      return { ok: true, value: outcome.value }
    },
  }
}

export type AppStore = ReturnType<typeof createAppStore>
