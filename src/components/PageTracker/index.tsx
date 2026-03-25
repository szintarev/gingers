'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

function getSessionId(): string {
  let id = sessionStorage.getItem('_sid')
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36)
    sessionStorage.setItem('_sid', id)
  }
  return id
}

const lastTracked = new Map<string, number>()
const DEBOUNCE_MS = 2000

export function PageTracker() {
  const pathname = usePathname()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (pathname.startsWith('/admin')) return

    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(() => {
      const now = Date.now()
      if (now - (lastTracked.get(pathname) ?? 0) < DEBOUNCE_MS) return
      lastTracked.set(pathname, now)

      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: pathname, referrer: document.referrer, sessionId: getSessionId() }),
      }).catch(() => {})
    }, 300)

    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [pathname])

  return null
}
