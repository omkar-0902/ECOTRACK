import type { User } from '@/types/domain'
import { ACCOUNT } from '@/content/original'

/**
 * Local demo sign-in. There is no authentication server in this workspace, so
 * the access key is never checked: any email and key open the demo console as
 * the single demo administrator. This is NOT a security boundary — real
 * authentication, sessions and authorization must be enforced by the backend
 * (see docs/BACKEND_HANDOFF.md).
 */
export const ACCOUNT_USER: User = { name: ACCOUNT.name, email: ACCOUNT.email, role: ACCOUNT.role }

const KEY = 'ecotrack:session'

export async function signIn(email: string, _accessKey: string, remember: boolean): Promise<User> {
  await new Promise((r) => setTimeout(r, 500))
  // Every demo sign-in becomes the demo administrator. Storing that account's
  // email keeps restoreSession() working across reloads; the typed email is
  // deliberately not persisted.
  void email
  const record = JSON.stringify({ email: ACCOUNT.email, at: Date.now() })
  try {
    ;(remember ? localStorage : sessionStorage).setItem(KEY, record)
  } catch {
    /* session lives in memory only */
  }
  return ACCOUNT_USER
}

/**
 * Local demo sign-up. There is no account server, so nothing is created or
 * stored: the details are validated in the form for feedback only, and the
 * visitor is signed in to the demo console exactly as signIn does. The dialog
 * says so. Replace with a call to the real registration endpoint.
 */
export async function signUp(details: { name: string; email: string; password: string }, remember: boolean): Promise<User> {
  return signIn(details.email, details.password, remember)
}

export function restoreSession(): User | null {
  try {
    const raw = localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed === 'object' && parsed !== null && (parsed as { email?: unknown }).email === ACCOUNT.email) return ACCOUNT_USER
  } catch {
    /* corrupted session: treat as signed out */
  }
  return null
}

/**
 * Where to go after sign-in. Only same-app paths are allowed ("/reports"), so a
 * crafted value such as "//evil.example" or "https://…" can never redirect off-site.
 */
export function safeReturnPath(from: unknown, fallback = '/dashboard'): string {
  if (typeof from !== 'string' || !from.startsWith('/') || from.startsWith('//') || from.startsWith('/\\')) return fallback
  if (from === '/login' || from === '/signup') return fallback
  return from
}

export function signOut() {
  try {
    localStorage.removeItem(KEY)
    sessionStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
