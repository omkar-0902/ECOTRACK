import { useMemo } from 'react'
import { useTheme } from '@/app/providers/ThemeProvider'

/** Resolves design tokens to concrete colours for libraries that write SVG attributes (Recharts). */
export function useTokens() {
  const { resolved } = useTheme()
  return useMemo(() => {
    const css = getComputedStyle(document.documentElement)
    const v = (n: string) => css.getPropertyValue(n).trim()
    return { ok: v('--et-ok'), warn: v('--et-warn'), crit: v('--et-crit'), line: v('--et-line'), ink3: v('--et-ink-3'), panel: v('--et-panel'), hover: v('--et-hover'), theme: resolved }
  }, [resolved])
}
