import { ArrowUp } from 'lucide-react'
import { useClock } from '../hooks/useClock'
import { SITE } from '../utils/constants'
import { scrollToSection } from '../utils/scroll'

export function Footer() {
  const time = useClock()

  return (
    <footer className="border-t border-[var(--line)] px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <p className="label text-[var(--text-muted)]">
          © {new Date().getFullYear()} {SITE.name}
        </p>

        <p className="label text-[var(--text-muted)]">
          Built with React, Tailwind &amp; Framer Motion · {time} IST
        </p>

        <button
          type="button"
          onClick={() => scrollToSection('hero')}
          className="label group flex items-center gap-2 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
        >
          Back to top
          <ArrowUp className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </footer>
  )
}
