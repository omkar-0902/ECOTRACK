type ClassValue = string | false | null | undefined | 0

/** Joins truthy class names. Kept tiny on purpose — no merge semantics needed. */
export function cn(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(' ')
}
