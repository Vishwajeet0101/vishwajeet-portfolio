import { motion } from 'framer-motion'
import { SectionHeading } from '../components/SectionHeading'
import { useContent } from '../content/useContent'

const MotionLi = motion.li
const MotionSpan = motion.span

/**
 * Work process as a four-column track on desktop, a stacked list on mobile.
 * Deliberately different geometry from Experience (which owns the vertical
 * rail) so the two sections don't read as the same component twice.
 */
export function Process() {
  const { process: PROCESS } = useContent()
  return (
    <section id="process" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="05"
          label="Work process"
          accent="no surprises."
          intro="The same four steps on every project, whether it is a one-page site or an internal tool. You always know what happens next and what it costs."
        >
          Clear steps,
        </SectionHeading>

        <ol className="mt-10 grid gap-x-8 gap-y-10 lg:grid-cols-4">
          {PROCESS.map((phase, index) => (
            <MotionLi
              key={phase.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative"
            >
              {/* The hairline above each step draws itself in on reveal — the
                  page's one bit of line animation, cheap and transform-only. */}
              <MotionSpan
                aria-hidden
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="block h-px origin-left bg-[var(--line-strong)]"
              />

              <div className="flex items-baseline justify-between gap-4 pt-6">
                <span className="font-display text-4xl leading-none text-[var(--line-strong)] transition-colors duration-500 group-hover:text-accent sm:text-5xl">
                  {phase.step}
                </span>
                <span className="label text-[var(--text-muted)]">{phase.duration}</span>
              </div>

              <h3 className="font-display mt-6 text-xl leading-snug text-[var(--text-primary)] sm:text-2xl">
                {phase.title}
              </h3>

              <p className="mt-3.5 text-[15px] leading-relaxed text-[var(--text-muted)]">
                {phase.summary}
              </p>
            </MotionLi>
          ))}
        </ol>
      </div>
    </section>
  )
}
