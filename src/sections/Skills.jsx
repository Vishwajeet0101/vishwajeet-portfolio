import { motion } from 'framer-motion'
import { SKILL_GROUPS } from '../utils/constants'
import { SectionHeading } from '../components/SectionHeading'

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="04"
          label="Skills"
          intro="The tools behind the projects above — not a list of everything I've touched."
        >
          Tech stack
        </SectionHeading>

        <dl className="mt-14">
          {SKILL_GROUPS.map((group, index) => (
            <motion.div
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
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  )
}
