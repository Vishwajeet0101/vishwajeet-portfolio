import { motion } from 'framer-motion'
import { ArrowRight, BarChart3, LayoutPanelTop, MonitorSmartphone, Server } from 'lucide-react'
import { SectionHeading } from '../components/SectionHeading'
import { SERVICES } from '../utils/constants'
import { scrollToSection } from '../utils/scroll'

const MotionArticle = motion.article
const MotionDiv = motion.div

/** Icon keys live in constants.js so the data file stays import-free of UI. */
const ICONS = {
  layout: LayoutPanelTop,
  app: MonitorSmartphone,
  chart: BarChart3,
  server: Server,
}

export function Services() {
  return (
    <section id="services" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="05"
          label="Services"
          accent="hire me for."
          intro="Four things, each one already shipped at least once in the work above. If your project is outside these, say so anyway — I will tell you honestly whether I am the right person."
        >
          What you can
        </SectionHeading>

        <div className="mt-10 grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2">
          {SERVICES.map((service, index) => {
            const Icon = ICONS[service.icon] ?? LayoutPanelTop
            return (
              <MotionArticle
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="group bg-[var(--page-bg)] p-6 transition-colors duration-500 hover:bg-[var(--surface-1)] sm:p-9"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-[var(--line-strong)] text-[var(--text-primary)] transition-colors duration-300 group-hover:border-accent group-hover:text-accent">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="mono text-sm text-[var(--text-muted)] transition-colors duration-300 group-hover:text-accent">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="font-display mt-7 text-2xl leading-tight text-[var(--text-primary)] sm:text-[1.75rem]">
                  {service.title}
                </h3>

                <p className="mt-4 text-[15px] leading-relaxed text-[var(--text-muted)]">
                  {service.summary}
                </p>

                <ul className="mt-7 flex flex-wrap gap-2">
                  {service.deliverables.map((item) => (
                    <li key={item} className="chip">
                      {item}
                    </li>
                  ))}
                </ul>
              </MotionArticle>
            )
          })}
        </div>

        {/* One CTA under the grid: the whole section exists to land here. */}
        <MotionDiv
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4"
        >
          <button
            type="button"
            onClick={() => scrollToSection('contact')}
            className="btn-pill btn-pill-accent"
          >
            Discuss your project
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
          <p className="text-[15px] leading-relaxed text-[var(--text-muted)]">
            Scope and a fixed price before any code is written.
          </p>
        </MotionDiv>
      </div>
    </section>
  )
}
