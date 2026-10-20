import { ArrowUp, Mail } from 'lucide-react'
import { useClock } from '../hooks/useClock'
import { NAV_LINKS, SITE } from '../utils/constants'
import { scrollToSection } from '../utils/scroll'
import { IconGitHub, IconLinkedIn, IconX } from './BrandIcons'

/** Only renders a social row for links that exist in SITE. */
const SOCIALS = [
  { href: SITE.github, label: 'GitHub', icon: IconGitHub },
  { href: SITE.linkedin, label: 'LinkedIn', icon: IconLinkedIn },
  { href: SITE.x, label: 'X', icon: IconX },
].filter((s) => Boolean(s.href))

export function Footer() {
  const time = useClock()

  return (
    <footer className="border-t border-[var(--line)] px-4 pb-10 pt-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-x-8 gap-y-12 lg:grid-cols-12">
          {/* Closing CTA — the last thing on the page is still an invitation. */}
          <div className="lg:col-span-5">
            <p className="label text-[var(--text-muted)]">{SITE.availability}</p>
            <p className="font-display mt-4 text-[1.75rem] leading-tight text-[var(--text-primary)] sm:text-[2.25rem]">
              Have something to build?
            </p>
            <a href={`mailto:${SITE.email}`} className="story-link mt-6">
              <Mail className="h-4 w-4" />
              {SITE.email}
            </a>
          </div>

          <nav className="lg:col-span-4 lg:col-start-7" aria-label="Footer">
            <p className="label text-[var(--text-muted)]">Sections</p>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
              {NAV_LINKS.map(({ id, label }) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(id)}
                    className="link text-sm"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <p className="label text-[var(--text-muted)]">Elsewhere</p>
            <ul className="mt-5 space-y-3">
              {SOCIALS.map((social) => {
                const Icon = social.icon
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2.5 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {social.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className="rule mt-16 flex flex-col items-start justify-between gap-5 pt-7 sm:flex-row sm:items-center">
          <p className="label text-[var(--text-muted)]">
            © {new Date().getFullYear()} {SITE.name} · {SITE.location}
          </p>

          <p className="label text-[var(--text-muted)]">
            React · Tailwind · Framer Motion · {time} IST
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
      </div>
    </footer>
  )
}
