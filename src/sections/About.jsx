import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ABOUT } from '../utils/constants'
import { useCountUp } from '../hooks/useCountUp'
import { SectionHeading } from '../components/SectionHeading'

function Stat({ label, value, suffix, start }) {
  const n = useCountUp(value, 1.4, start)
  return (
    <div className="rule pt-5">
      <p className="font-display text-4xl font-semibold tabular-nums leading-none text-[var(--text-primary)] sm:text-5xl">
        {n}
        <span className="text-accent">{suffix}</span>
      </p>
      <p className="label mt-3 text-[var(--text-muted)]">{label}</p>
    </div>
  )
}

export function About() {
  const block = useRef(null)
  const inView = useInView(block, { once: true, margin: '-80px' })

  return (
    <section
      id="about"
      ref={block}
      className="scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="01" label="About">
          Engineer who ships real software
        </SectionHeading>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 grid gap-x-8 gap-y-16 lg:grid-cols-12"
        >
          <p className="max-w-3xl text-lg leading-[1.65] text-[var(--text-muted)] sm:text-xl lg:col-span-9 lg:col-start-4">
            {ABOUT.summary}
          </p>

          <div className="grid grid-cols-2 gap-x-6 sm:grid-cols-4 sm:gap-x-10 lg:col-span-9 lg:col-start-4">
            {ABOUT.stats.map((s) => (
              <Stat key={s.label} {...s} start={inView} />
            ))}
          </div>

          <div className="lg:col-span-9 lg:col-start-4">
            <div className="grid gap-x-10 gap-y-12 md:grid-cols-2">
              <div>
                <p className="label text-[var(--text-muted)]">At a glance</p>
                <dl className="mt-5">
                  {ABOUT.facts.map(([k, v]) => (
                    <div key={k} className="rule flex flex-col gap-1 py-3.5 sm:flex-row sm:gap-6">
                      <dt className="label w-28 shrink-0 pt-1 text-[var(--text-muted)]">{k}</dt>
                      <dd className="text-sm leading-relaxed text-[var(--text-primary)]">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div>
                <p className="label text-[var(--text-muted)]">Education</p>
                <div className="rule mt-5 pt-4">
                  <p className="font-display text-xl font-semibold leading-snug text-[var(--text-primary)]">
                    {ABOUT.education.degree}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
                    {ABOUT.education.school}
                  </p>
                  <p className="mono mt-4 text-[13px] text-[var(--text-muted)]">
                    {ABOUT.education.period}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
