import { motion } from 'framer-motion'
import { ArrowDownRight, Send } from 'lucide-react'
import { HeroField } from '../components/HeroField'
import { useContent } from '../content/useContent'
import { scrollToSection } from '../utils/scroll'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
}

const fade = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

const word = {
  hidden: { y: '130%' },
  show: { y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
}

/* The portrait plate fades in on its own, slower than the type, so the face
   resolves out of the page rather than appearing with it. */
const plate = {
  hidden: { opacity: 0, scale: 1.04 },
  show: { opacity: 1, scale: 1, transition: { duration: 1.6, ease: [0.22, 1, 0.36, 1] } },
}

const MotionP = motion.p
const MotionDiv = motion.div
const MotionSpan = motion.span
const MotionUl = motion.ul
const MotionButton = motion.button

export function Hero() {
  const { site: SITE, about } = useContent()
  /** Hero proof strip: the three numbers a prospective client cares about. */
  const PROOF = about.stats.slice(0, 3)
  const [first, ...rest] = SITE.name.split(' ')
  const last = rest.join(' ')

  return (
    <section
      id="hero"
      className="relative flex min-h-svh flex-col justify-center overflow-hidden px-4 pb-12 pt-24 sm:px-6 sm:pt-28"
    >
      <MotionDiv
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto w-full max-w-6xl"
      >
        {/* Meta rail, split to the page edges. */}
        <MotionDiv
          variants={fade}
          className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2"
        >
          <p className="label flex items-center gap-2.5 text-[var(--text-muted)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            {SITE.availability}
          </p>
          <p className="label text-[var(--text-muted)]">{SITE.location}</p>
        </MotionDiv>

        {/* ------------------------------------------------ portrait + name
            The plate is an atmospheric backdrop, absolutely placed so the
            name sits across its lower third where the photograph goes dark.
            Every dimension is a min() of a viewport unit and a ceiling, so
            the arrangement holds from 320px up without a breakpoint. */}
        {/* `isolate` keeps the absolute plate inside this block's stacking
            context, so it can never paint over the copy that follows it. */}
        <div className="relative isolate mt-6 flex flex-col items-center">
          <MotionDiv
            variants={plate}
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-[min(60svh,540px)] w-[min(88vw,460px)] -translate-x-1/2"
          >
            <HeroField src={SITE.portrait} />
            {/* Edge-only mask: feathers the plate into the page without
                washing out the face, then fades its foot under the name. */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(62% 58% at 50% 42%, transparent 58%, var(--page-bg) 100%),' +
                  'linear-gradient(to bottom, transparent 52%, var(--page-bg) 88%)',
              }}
            />
          </MotionDiv>

          <h1 className="font-display relative z-10 mt-[min(38svh,340px)] text-center text-[clamp(2.5rem,9vw,5.5rem)] leading-[0.95] text-[var(--text-primary)]">
            <span className="reveal-mask inline-block">
              <MotionSpan variants={word} className="block">
                {first}
              </MotionSpan>
            </span>
            {/* An explicit space: JSX drops the whitespace between elements on
                separate lines, and without it the two inline-blocks are one
                unbreakable run that overflows a phone screen. */}
            {last && ' '}
            {last && (
              <span className="reveal-mask inline-block">
                <MotionSpan variants={word} className="em-serif-italic block">
                  {last}
                </MotionSpan>
              </span>
            )}
          </h1>
        </div>

        <MotionP
          variants={fade}
          className="relative z-10 mx-auto mt-5 max-w-xl text-center text-[0.9375rem] leading-relaxed text-[var(--text-muted)] sm:mt-6 sm:text-base"
        >
          {SITE.tagline}
        </MotionP>

        <MotionDiv
          variants={fade}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <MotionButton
            type="button"
            onClick={() => scrollToSection('contact')}
            className="btn-pill btn-pill-accent"
            whileHover={{ y: -1 }}
          >
            <Send className="h-3.5 w-3.5" />
            Start a project
          </MotionButton>
          <MotionButton
            type="button"
            onClick={() => scrollToSection('projects')}
            className="btn-pill btn-pill-ghost"
            whileHover={{ y: -1 }}
          >
            See the work
            <ArrowDownRight className="h-3.5 w-3.5" />
          </MotionButton>
        </MotionDiv>
      </MotionDiv>

      <MotionUl
        variants={fade}
        initial="hidden"
        animate="show"
        className="rule relative mx-auto mt-12 flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-5 sm:px-6"
      >
        {PROOF.map((s) => (
          <li key={s.label} className="flex items-baseline gap-2.5">
            <span className="font-display text-xl tabular-nums text-[var(--text-primary)] sm:text-2xl">
              {s.value}
              <span className="text-accent">{s.suffix}</span>
            </span>
            <span className="label text-[var(--text-muted)]">{s.label}</span>
          </li>
        ))}
      </MotionUl>
    </section>
  )
}
