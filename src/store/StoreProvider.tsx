import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from 'react'
import { localStorageRepository } from '@/data/repositories/demoRepository'
import { createAppStore, type AppStore } from './store'
import type { AppData } from './types'

const StoreContext = createContext<AppStore | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => createAppStore(localStorageRepository))
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export function useAppStore(): AppStore {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useAppStore must be used inside <StoreProvider>')
  return store
}

/** Subscribe to the dataset. Selectors must return stable references. */
export function useData<T = AppData>(selector: (d: AppData) => T = (d) => d as unknown as T): T {
  const store = useAppStore()
  return useSyncExternalStore(store.subscribe, () => selector(store.getState()))
}
