import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, Download } from 'lucide-react'
import { useRef } from 'react'
import profileImg from '../assets/profile.jpg'
import { IconGitHub } from '../components/BrandIcons'
import { useClock } from '../hooks/useClock'
import { SITE } from '../utils/constants'
import { scrollToSection } from '../utils/scroll'

const TECH = [
  'Java',
  'Spring Boot',
  'Spring Security',
  'React',
  'Next.js',
  'TypeScript',
  'PostgreSQL',
  'MySQL',
  'Supabase',
  'Docker',
]

/** First name on its own line, the rest below it. */
const [FIRST_NAME, ...LAST_NAME] = SITE.name.split(' ')
const NAME_LINES = LAST_NAME.length ? [[FIRST_NAME], LAST_NAME] : [[FIRST_NAME]]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.075, delayChildren: 0.15 } },
}

const word = {
  // Must clear the mask's bottom padding, or the letter tops peek at rest.
  hidden: { y: '135%' },
  show: { y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
}

const fade = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

function MetaRow({ label, children }) {
  return (
    <div className="rule flex items-baseline gap-4 py-2.5">
      <span className="label w-20 shrink-0 text-[var(--text-muted)]">{label}</span>
      <span className="mono text-[13px] text-[var(--text-primary)]">{children}</span>
    </div>
  )
}

export function Hero() {
  const section = useRef(null)
  const reduceMotion = useReducedMotion()
  const time = useClock()

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ['start start', 'end start'],
  })
  const parallax = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -70])

  return (
    <section
      id="hero"
      ref={section}
      className="relative flex min-h-svh flex-col justify-between pt-28 sm:pt-32"
    >
      <div className="flex flex-1 items-center px-4 sm:px-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mx-auto grid w-full max-w-6xl grid-cols-1 items-end gap-x-10 gap-y-16 lg:grid-cols-12"
        >
          {/* ------------------------------------------------ type column */}
          <div className="min-w-0 lg:col-span-7">
            <motion.p
              variants={fade}
              className="label flex items-center gap-2.5 text-[var(--text-muted)]"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              Open to internships &amp; entry-level roles
            </motion.p>

            <h1 className="font-display mt-7 text-[clamp(2.75rem,10vw,6.5rem)] font-semibold leading-[0.92] text-[var(--text-primary)]">
              {NAME_LINES.map((line, i) => (
                <span key={i} className="flex flex-wrap gap-x-[0.28em]">
                  {line.map((w) => (
                    <span key={w} className="reveal-mask">
                      <motion.span variants={word} className="block">
                        {w}
                      </motion.span>
                    </span>
                  ))}
                </span>
              ))}
            </h1>

            <motion.p
              variants={fade}
              className="mt-8 max-w-xl text-[15px] leading-relaxed text-[var(--text-muted)] sm:text-lg"
            >
              <span className="text-[var(--text-primary)]">{SITE.title}</span> building
              secure, production-ready web applications — from Spring Boot services to
              Next.js products people use every day.
            </motion.p>

            <motion.div variants={fade} className="mt-10 flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => scrollToSection('projects')} className="btn btn-solid">
                View projects
                <ArrowDownRight className="h-3.5 w-3.5" />
              </button>
              <a
                href="/resume.pdf"
                download="Vishwajeet_Kumar_Nishad_Resume.pdf"
                className="btn"
              >
                <Download className="h-3.5 w-3.5" />
                Resume
              </a>
              <a href={SITE.github} target="_blank" rel="noreferrer" className="btn">
                <IconGitHub className="h-3.5 w-3.5" />
                GitHub
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </motion.div>
          </div>

          {/* --------------------------------------------- portrait column */}
          <motion.div
            variants={fade}
            style={{ y: parallax }}
            className="relative mx-auto w-full max-w-[320px] lg:col-span-3 lg:col-start-10 lg:mx-0 lg:max-w-none"
          >
            {/* Offset hairline frame — depth without a drop shadow. */}
            <span
              aria-hidden
              className="pointer-events-none absolute -right-2.5 -top-2.5 hidden h-full w-full border border-[var(--line)] sm:block"
            />

            <div className="portrait relative aspect-[4/5] overflow-hidden border border-[var(--line)] bg-[var(--surface-2)]">
              <img
                src={profileImg}
                alt={`Portrait of ${SITE.name}`}
                width={764}
                height={1024}
                className="portrait-img"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
              <span
                aria-hidden
                className="absolute left-3 top-3 h-3 w-3 border-l border-t border-accent"
              />
              <span
                aria-hidden
                className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-accent"
              />
            </div>

            <div className="mt-5">
              <MetaRow label="Based">{SITE.location}</MetaRow>
              <MetaRow label="Local">{time} IST</MetaRow>
              <MetaRow label="Building">Speedo CRM · Next.js</MetaRow>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ------------------------------------------------- full-bleed ticker */}
      <div className="rule mt-16">
        <div className="marquee py-5">
          <div className="marquee-track" aria-hidden>
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex shrink-0 items-center">
                {TECH.map((t) => (
                  <li key={t} className="label flex items-center text-[var(--text-muted)]">
                    <span className="px-6">{t}</span>
                    <span className="h-1 w-1 rounded-full bg-accent" />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        <p className="sr-only">Technologies: {TECH.join(', ')}</p>
      </div>
    </section>
  )
}
