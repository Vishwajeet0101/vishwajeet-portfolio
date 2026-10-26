import { navigate } from '../lib/router'

export function scrollToSection(id) {
  const el = document.getElementById(id)
  if (!el) return
  const navOffset = 80
  const top = el.getBoundingClientRect().top + window.scrollY - navOffset
  window.scrollTo({ top, behavior: 'smooth' })
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
