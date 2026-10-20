import { motion } from 'framer-motion'
import { EXPERIENCE } from '../utils/constants'
import { SectionHeading } from '../components/SectionHeading'

const MotionLi = motion.li

/**
 * Experience, laid out the way a recruiter reads a LinkedIn profile: one
 * timeline rail down the left, a dot per entry (pulsing on the current role),
 * a company monogram instead of a text-only company line, the period and type
 * as a mono meta row, the role as the headline, then description-style
 * bullets and a "skills used" chip row.
 *
 * Geometry is fixed rather than breakpoint-dependent so the rail, the dot and
 * the monogram stay optically aligned at every width: 40px monogram, dot
 * centred on it at y=13, rail from y=27 down into the next entry's dot.
 */
export function Experience() {
  return (
    <section id="experience" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="04"
          label="Experience"
          accent="in production."
          intro="Where I work day to day, and what shipping software for a live team has taught me about building it."
        >
          Shipping software
        </SectionHeading>

        <ol className="mt-10">
          {EXPERIENCE.map((job, index) => {
            const current = job.period.includes('Present')
            const last = index === EXPERIENCE.length - 1

            return (
              <MotionLi
                key={job.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex gap-3 pb-12 sm:gap-6 sm:pb-14"
              >
                {/* The rail starts under this entry's dot and reaches into the
                    next one, so the line reads as continuous. The last entry
                    omits it — a timeline should stop, not trail off. */}
                {!last && (
                  <span
                    aria-hidden
                    className="absolute left-[7px] top-[27px] bottom-[-13px] w-px bg-[var(--line)] transition-colors duration-300 group-hover:bg-[var(--line-strong)]"
                  />
                )}

                {/* Timeline dot, centred on the monogram beside it. */}
                <span
                  aria-hidden
                  className="absolute left-0 top-[13px] h-3.5 w-3.5 rounded-full border-2 border-[var(--line-strong)] bg-[var(--page-bg)] transition-colors duration-300 group-hover:border-accent"
                >
                  {current && (
                    <>
                      <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-50" />
                      <span className="absolute inset-[3px] rounded-full bg-accent" />
                    </>
                  )}
                </span>

                {/* Reserves the dot's column so the monogram starts clear of it. */}
                <span aria-hidden className="w-3.5 shrink-0" />

                {/* Company monogram — the logo slot, in the page's own type. */}
                <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--line-strong)] bg-[var(--surface-1)] font-display text-base text-[var(--text-muted)] transition-colors duration-300 group-hover:border-accent group-hover:text-accent">
                  {job.mark}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <p className="mono text-[13px] text-[var(--text-primary)]">{job.period}</p>
                    <span
                      aria-hidden
                      className="h-1 w-1 rounded-full bg-[var(--line-strong)]"
                    />
                    <p className="label text-[var(--text-muted)]">{job.type}</p>
                  </div>

                  <h3 className="font-display mt-2.5 text-xl leading-snug text-[var(--text-primary)] sm:text-2xl">
                    {job.role}
                  </h3>
                  <p className="font-display mt-1 text-base leading-snug text-[var(--text-muted)]">
                    
                    {job.company}
                    {job.companyNote ? ` · ${job.companyNote}` : ''}
                  </p>

                  <ul className="mt-6 space-y-3">
                    {job.highlights.map((h) => (
                      <li key={h} className="flex gap-4 text-[15px] leading-relaxed text-[var(--text-muted)]">
                        <span aria-hidden className="mt-[0.6em] h-px w-4 shrink-0 bg-[var(--line-strong)]" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <li
                        key={skill}
                        className="label border border-[var(--line)] px-2.5 py-1.5 text-[var(--text-muted)] transition-colors duration-300 group-hover:border-[var(--line-strong)]"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </MotionLi>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
