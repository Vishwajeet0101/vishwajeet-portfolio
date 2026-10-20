import { useLayoutEffect, useState } from 'react'

const STORAGE_KEY = 'portfolio-theme-v2'

/* The site is designed dark-first like the reference: near-black page,
   serif display, orange accents. A choice the visitor actually made always
   wins on the next visit; the default is never written to storage. */
function getInitial() {
  if (typeof window === 'undefined') return 'dark'
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'light' || stored === 'dark' ? stored : 'dark'
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitial)

  useLayoutEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  // Only an explicit toggle is persisted — the default is never written, so it
  // stays free to change with the design.
  const toggle = () =>
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // Private mode / storage disabled: the theme still applies for this visit.
      }
      return next
    })

  return { theme, toggle, setTheme }
}
