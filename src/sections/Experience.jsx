import { motion } from 'framer-motion'
import { EXPERIENCE } from '../utils/constants'
import { SectionHeading } from '../components/SectionHeading'

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="02"
          label="Experience"
          intro="Internships where I owned real operations and shipped software a live team works from."
        >
          Where I&apos;ve delivered impact
        </SectionHeading>

        <ul className="mt-14">
          {EXPERIENCE.map((job, index) => {
            const current = job.period.includes('Present')
            return (
              <motion.li
                key={job.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="rule grid gap-x-8 gap-y-6 py-10 lg:grid-cols-12 lg:py-12"
              >
                <div className="flex items-baseline gap-4 lg:col-span-3 lg:block">
                  <p className="mono flex items-center gap-2 text-[13px] text-[var(--text-primary)]">
                    {current && (
                      <span className="relative flex h-1.5 w-1.5 shrink-0">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                      </span>
                    )}
                    {job.period}
                  </p>
                  <p className="label text-[var(--text-muted)] lg:mt-3">{job.type}</p>
                </div>

                <div className="lg:col-span-9">
                  <h3 className="font-display text-2xl font-semibold leading-tight text-[var(--text-primary)] sm:text-3xl">
                    {job.role}
                  </h3>
                  <p className="mono mt-2.5 text-[13px] text-[var(--text-muted)]">
                    {job.company}
                    {job.companyNote ? ` · ${job.companyNote}` : ''}
                  </p>

                  <ul className="mt-7 max-w-2xl space-y-3">
                    {job.highlights.map((h) => (
                      <li key={h} className="flex gap-4 text-[15px] leading-relaxed text-[var(--text-muted)]">
                        <span aria-hidden className="mt-[0.6em] h-px w-4 shrink-0 bg-[var(--line-strong)]" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
