import { useEffect, useRef, type RefObject } from 'react'

const trapStack: object[] = []

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Keeps keyboard focus inside `ref` while active, closes on Escape,
 * and returns focus to the previously focused element afterwards.
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean, onEscape?: () => void) {
  // Held in a ref so re-renders with a new callback don't re-run the trap (which would steal focus).
  const escapeRef = useRef(onEscape)
  useEffect(() => {
    escapeRef.current = onEscape
  })
  useEffect(() => {
    if (!active) return
    const previous = document.activeElement as HTMLElement | null
    const node = ref.current
    const focusFirst = () => {
      if (!node) return
      const preferred = node.querySelector<HTMLElement>('[data-autofocus]')
      const first = preferred ?? node.querySelector<HTMLElement>(FOCUSABLE)
      ;(first ?? node).focus({ preventScroll: true })
    }
    const raf = requestAnimationFrame(focusFirst)
    const token = {}
    trapStack.push(token)

    const onKey = (e: KeyboardEvent) => {
      // Only the top-most trap (e.g. a confirm dialog over a drawer) handles keys.
      if (trapStack[trapStack.length - 1] !== token) return
      if (e.key === 'Escape' && escapeRef.current) {
        e.stopPropagation()
        escapeRef.current()
        return
      }
      if (e.key !== 'Tab' || !node) return
      const items = [...node.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null || el === document.activeElement)
      if (items.length === 0) {
        e.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey, true)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('keydown', onKey, true)
      trapStack.splice(trapStack.indexOf(token), 1)
      if (previous && document.contains(previous)) previous.focus({ preventScroll: true })
    }
  }, [active, ref])
}
