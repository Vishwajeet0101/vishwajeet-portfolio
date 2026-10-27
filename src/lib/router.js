import { useSyncExternalStore } from 'react'
import { scrollToY } from './smoothScroll'

/* Three routes (home, blog, admin) don't justify a router dependency: the
   path lives in history, and popstate is the only event that changes it. */

function subscribe(onChange) {
  window.addEventListener('popstate', onChange)
  return () => window.removeEventListener('popstate', onChange)
}

export function usePath() {
  return useSyncExternalStore(subscribe, () => window.location.pathname)
}

export function navigate(to) {
  if (to === window.location.pathname) return
  window.history.pushState({}, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
  scrollToY(0, { immediate: true })
}

/** Client-side link; modifier-clicks still open a new tab as normal. */
export function onLinkClick(e) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
    return
  }
  e.preventDefault()
  navigate(e.currentTarget.getAttribute('href'))
}
