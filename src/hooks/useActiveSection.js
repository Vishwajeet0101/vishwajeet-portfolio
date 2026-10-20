import { useEffect, useState } from 'react'
import { NAV_LINKS } from '../utils/constants'

/* Derived from NAV_LINKS (plus the hero) so adding a section to the nav is
   enough — this list can't drift out of sync with what's on the page. */
const SECTION_IDS = ['hero', ...NAV_LINKS.map((link) => link.id)]

/* Matches the offset scrollToSection lands on, so clicking a nav item always
   lights that same item. An IntersectionObserver band was picking whichever
   section merely overlapped it, which left the nav a step behind the click. */
const NAV_OFFSET = 96

export function useActiveSection() {
  const [active, setActive] = useState('hero')

  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      const line = window.scrollY + NAV_OFFSET + 1
      let current = SECTION_IDS[0]

      for (const id of SECTION_IDS) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= line) current = id
      }

      // The last section can be too short to reach the line; at the foot of
      // the page it is unambiguously the one being read.
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 2
      if (atBottom) current = SECTION_IDS[SECTION_IDS.length - 1]

      setActive(current)
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return active
}
