import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { User } from '@/types/domain'
import { restoreSession, signIn as authSignIn, signOut as authSignOut } from '@/services/auth'

interface AuthContextValue {
  user: User | null
  signIn: (email: string, key: string, remember: boolean) => Promise<User>
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => restoreSession())
  const signIn = useCallback(async (email: string, key: string, remember: boolean) => {
    const u = await authSignIn(email, key, remember)
    setUser(u)
    return u
  }, [])
  const signOut = useCallback(() => {
    authSignOut()
    setUser(null)
  }, [])
  const value = useMemo(() => ({ user, signIn, signOut }), [user, signIn, signOut])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

export function useUser(): User {
  const { user } = useAuth()
  if (!user) throw new Error('useUser called without a signed-in user')
  return user
}
