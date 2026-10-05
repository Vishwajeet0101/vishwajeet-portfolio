import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { NAV_LINKS, SITE } from '../utils/constants'
import { scrollToSection } from '../utils/scroll'
import { ThemeToggle } from './ThemeToggle'

const num = (i) => String(i + 1).padStart(2, '0')

export function Navbar({ theme, toggleTheme, activeSection }) {
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

  const go = (id) => {
    scrollToSection(id)
    setOpen(false)
  }

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-[80] transition-colors duration-300 ${
          scrolled
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
            <span className="flex h-8 w-8 items-center justify-center bg-[var(--text-primary)] font-mono text-[11px] font-medium tracking-tight text-[var(--page-bg)]">
              VK
            </span>
            <span className="label hidden text-[var(--text-primary)] sm:inline">
              {SITE.name}
            </span>
          </button>

          <ul className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map(({ id, label }, i) => {
              const on = activeSection === id
              return (
                <li key={id} className="relative">
                  <button
                    type="button"
                    onClick={() => go(id)}
                    className={`label flex items-baseline gap-1.5 py-1 transition-colors ${
                      on
                        ? 'text-[var(--text-primary)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <span className={on ? 'text-accent' : 'opacity-50'}>{num(i)}</span>
                    {label}
                  </button>
                  {on && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-0 h-px w-full bg-accent"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle theme={theme} toggle={toggleTheme} />
            <button
              type="button"
              className="label flex h-9 items-center border border-[var(--line-strong)] px-3 text-[var(--text-primary)] transition hover:bg-[var(--surface-1)] lg:hidden"
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? 'Close' : 'Menu'}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex flex-col bg-[var(--page-bg)] px-4 pb-10 pt-24 sm:px-6 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ul className="mt-6">
              {NAV_LINKS.map(({ id, label }, i) => (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="rule"
                >
                  <button
                    type="button"
                    onClick={() => go(id)}
                    className="flex w-full items-baseline gap-5 py-5 text-left"
                  >
                    <span className="label text-accent">{num(i)}</span>
                    <span className="font-display text-3xl font-semibold text-[var(--text-primary)]">
                      {label}
                    </span>
                  </button>
                </motion.li>
              ))}
            </ul>

            <p className="label mt-auto pt-10 text-[var(--text-muted)]">{SITE.location}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
