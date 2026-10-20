type Cell = string | number | boolean | null | undefined

function escape(v: Cell) {
  if (v === null || v === undefined) return ''
  const s = String(v)
  // Neutralise spreadsheet formula injection, then quote when needed.
  const safe = /^[=+\-@\t\r]/.test(s) && !/^-?\d/.test(s) ? `'${s}` : s
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe
}

export function toCsv(headers: string[], rows: Cell[][]) {
  return [headers, ...rows].map((r) => r.map(escape).join(',')).join('\r\n')
}

/**
 * Triggers a real file download. Returns false if the browser blocked it,
 * so callers can show an error instead of a false success.
 */
export function downloadFile(filename: string, content: string, mime = 'text/csv;charset=utf-8') {
  try {
    const blob = new Blob(['﻿', content], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.rel = 'noopener'
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    return true
  } catch {
    return false
  }
}

export function stamp() {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`
}
