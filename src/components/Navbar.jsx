import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useContent } from '../content/useContent'
import { onLinkClick } from '../lib/router'
import { NAV_LINKS } from '../utils/constants'
import { goToSection } from '../utils/scroll'

const MotionHeader = motion.header
const MotionDiv = motion.div
const MotionLi = motion.li

const num = (i) => String(i + 1).padStart(2, '0')

/* Three lines that fold into an X. Animating the bars themselves (rather
   than swapping two icons) keeps the control from jumping as it toggles. */
function MenuIcon({ open }) {
  const bar = 'absolute left-0 h-px w-full bg-current'
  const spring = { duration: 0.3, ease: [0.22, 1, 0.36, 1] }

  return (
    <span aria-hidden className="relative block h-3 w-5">
      <motion.span
        className={bar}
        initial={false}
        animate={open ? { top: '50%', rotate: 45 } : { top: 0, rotate: 0 }}
        transition={spring}
      />
      <motion.span
        className={bar}
        style={{ top: '50%' }}
        initial={false}
        animate={open ? { opacity: 0, scaleX: 0.4 } : { opacity: 1, scaleX: 1 }}
        transition={spring}
      />
      <motion.span
        className={bar}
        initial={false}
        animate={open ? { top: '50%', rotate: -45 } : { top: '100%', rotate: 0 }}
        transition={spring}
      />
    </span>
  )
}

export function Navbar({ activeSection }) {
  const { site: SITE } = useContent()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Escape closes the overlay — it covers the whole page, so there has to be
  // a way out that isn't the pointer.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (id) => {
    goToSection(id)
    setOpen(false)
  }

  return (
    <>
      <MotionHeader
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-[80] transition-colors duration-300 ${
          scrolled && !open
            ? 'border-b border-[var(--line)] bg-[var(--page-bg)]/85 backdrop-blur-xl'
            : 'border-b border-transparent'
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => go('hero')}
            className="group flex items-center gap-3 text-left"
          >
            <span className="font-display text-xl leading-none text-[var(--text-primary)] sm:text-2xl">
              {SITE.name.split(' ')[0]} <span className="text-accent">.</span>
            </span>
            <span className="sr-only">{SITE.name} — home</span>
          </button>

          {/* The only nav control, at every width. */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center border border-[var(--line-strong)] text-[var(--text-primary)] transition hover:bg-[var(--surface-1)]"
            aria-expanded={open}
            aria-controls="nav-overlay"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <MenuIcon open={open} />
          </button>
        </nav>
      </MotionHeader>

      <AnimatePresence>
        {open && (
          <MotionDiv
            id="nav-overlay"
            className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-[var(--page-bg)] px-4 pb-10 pt-24 sm:px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ul className="mx-auto w-full max-w-6xl">
              {NAV_LINKS.map(({ id, label }, i) => {
                const on = activeSection === id
                return (
                  <MotionLi
                    key={id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.05 + i * 0.05,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="rule"
                  >
                    <button
                      type="button"
                      onClick={() => go(id)}
                      className="group flex w-full items-baseline gap-5 py-4 text-left sm:py-5"
                    >
                      <span className={`label ${on ? 'text-accent' : 'text-[var(--text-muted)]'}`}>
                        {num(i)}
                      </span>
                      <span
                        className={`font-display text-[clamp(1.75rem,7vw,3rem)] leading-tight transition-colors ${
                          on
                            ? 'text-[var(--text-primary)]'
                            : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {label}
                      </span>
                    </button>
                  </MotionLi>
                )
              })}
              {/* The blog is its own page, so this one navigates instead of
                  scrolling. */}
              <MotionLi
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.05 + NAV_LINKS.length * 0.05,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="rule"
              >
                <a
                  href="/blog"
                  onClick={(e) => {
                    setOpen(false)
                    onLinkClick(e)
                  }}
                  className="group flex w-full items-baseline gap-5 py-4 text-left sm:py-5"
                >
                  <span className="label text-[var(--text-muted)]">{num(NAV_LINKS.length)}</span>
                  <span className="font-display text-[clamp(1.75rem,7vw,3rem)] leading-tight text-[var(--text-muted)] transition-colors group-hover:text-[var(--text-primary)]">
                    Blog
                  </span>
                </a>
              </MotionLi>
            </ul>

            <p className="label mx-auto mt-auto w-full max-w-6xl pt-10 text-[var(--text-muted)]">
              {SITE.location}
            </p>
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  )
}
