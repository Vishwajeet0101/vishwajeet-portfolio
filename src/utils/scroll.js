import { navigate } from '../lib/router'
import { scrollToY } from '../lib/smoothScroll'

export function scrollToSection(id) {
  const el = document.getElementById(id)
  if (!el) return
  const navOffset = 80
  const top = el.getBoundingClientRect().top + window.scrollY - navOffset
  scrollToY(top)
}

/** Like scrollToSection, but from the blog it first returns to the home page. */
export function goToSection(id) {
  if (window.location.pathname === '/') {
    scrollToSection(id)
    return
  }
  navigate('/')
  // The home page mounts on the next render; wait for it before scrolling.
  requestAnimationFrame(() => requestAnimationFrame(() => scrollToSection(id)))
}
