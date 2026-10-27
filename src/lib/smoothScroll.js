import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

/* Eased wheel/trackpad scrolling for the public pages. Touch keeps the
   phone's native momentum (Lenis leaves it alone by default), and anyone who
   asks for reduced motion gets plain scrolling. Every programmatic scroll goes
   through scrollToY so it rides the same easing instead of fighting it. */

let lenis = null

export function startSmoothScroll() {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  lenis = new Lenis({ autoRaf: true, lerp: 0.1 })
  return () => {
    lenis?.destroy()
    lenis = null
  }
}

export function scrollToY(top, { immediate = false } = {}) {
  if (lenis) lenis.scrollTo(top, { immediate, force: true })
  else window.scrollTo({ top, behavior: immediate ? 'instant' : 'smooth' })
}

/** Freezes the page behind an overlay such as the mobile menu. */
export function setScrollLocked(locked) {
  document.body.style.overflow = locked ? 'hidden' : ''
  if (locked) lenis?.stop()
  else lenis?.start()
}
