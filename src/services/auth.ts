import type { User } from '@/types/domain'
import { ACCOUNT } from '@/content/original'

/**
 * Local sign-in. The original product authenticated against its backend, which
 * is not part of this workspace, so the access key cannot be verified here.
 * Only the administrator account shown in the original screenshots exists.
 * This is not a security boundary.
 */
export const ACCOUNT_USER: User = { name: ACCOUNT.name, email: ACCOUNT.email, role: ACCOUNT.role }

const KEY = 'ecotrack:session'

export async function signIn(email: string, accessKey: string, remember: boolean): Promise<User> {
  await new Promise((r) => setTimeout(r, 500))
  if (email.trim().toLowerCase() !== ACCOUNT.email) throw new Error('No operator is registered with this Network ID.')
  if (!accessKey) throw new Error('Enter your security access key.')
  const record = JSON.stringify({ email: ACCOUNT.email, at: Date.now() })
  try {
    ;(remember ? localStorage : sessionStorage).setItem(KEY, record)
  } catch {
    /* session lives in memory only */
  }
  return ACCOUNT_USER
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

export function signOut() {
  try {
    localStorage.removeItem(KEY)
    sessionStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
