import { motion } from 'framer-motion'
import { SKILL_GROUPS } from '../utils/constants'
import { SectionHeading } from '../components/SectionHeading'

const MotionDiv = motion.div

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="02"
          label="Skills"
          accent="actually use."
          intro="The tools behind the projects below — not a list of everything I have ever opened."
        >
          What I
        </SectionHeading>

        <dl className="mt-10">
          {SKILL_GROUPS.map((group, index) => (
            <MotionDiv
              key={group.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="rule grid gap-x-8 gap-y-4 py-7 lg:grid-cols-12"
            >
              <dt className="label pt-1 text-[var(--text-muted)] lg:col-span-3">
                {group.title}
              </dt>
              <dd className="flex flex-wrap items-baseline gap-x-6 gap-y-3 lg:col-span-9">
                {group.skills.map((s) => (
                  <span
                    key={s}
                    className="cursor-default border-b border-transparent pb-0.5 text-[15px] text-[var(--text-primary)] transition-colors duration-300 hover:border-accent sm:text-base"
                  >
                    {s}
                  </span>
                ))}
              </dd>
            </MotionDiv>
          ))}
        </dl>
      </div>
    </section>
  )
}
