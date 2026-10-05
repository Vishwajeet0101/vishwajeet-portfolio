import { motion } from 'framer-motion'
import { ArrowUpRight, Lock } from 'lucide-react'
import { IconGitHub } from '../components/BrandIcons'
import { PROJECTS } from '../utils/constants'
import { SectionHeading } from '../components/SectionHeading'

const FEATURED = PROJECTS.filter((p) => p.featured)
const OTHERS = PROJECTS.filter((p) => !p.featured)

const num = (i) => String(i + 1).padStart(2, '0')

function FeaturedLinks({ project }) {
  // The private-repo note only makes sense when there is nothing to click —
  // a live site next to "private repo" contradicts itself.
  const showPrivateNote = !project.github && !project.live

  return (
    <div className="mt-10 flex flex-wrap items-center gap-3">
      {project.live && (
        <a href={project.live} target="_blank" rel="noreferrer" className="btn btn-solid">
          Live site
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      )}
      {project.github && (
        <a href={project.github} target="_blank" rel="noreferrer" className="btn">
          <IconGitHub className="h-3.5 w-3.5" />
          Source
        </a>
      )}
      {/* Stitch's ghost CTA: secondary action next to the solid one. */}
      {project.live && project.github && (
        <a href={project.github} target="_blank" rel="noreferrer" className="btn btn-ghost">
          Explore codebase
          <ArrowUpRight className="h-3 w-3" />
        </a>
      )}
      {project.demoMailto && (
        <a href={`mailto:${project.demoMailto}`} className="btn btn-ghost">
          Request demo
          <ArrowUpRight className="h-3 w-3" />
        </a>
      )}
      {showPrivateNote && (
        <span className="label flex items-center gap-2 text-[var(--text-muted)]">
          <Lock className="h-3.5 w-3.5" />
          Private repository
        </span>
      )}
    </div>
  )
}

export function Projects() {
  return (
    <section id="projects" className="scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="03"
          label="Projects"
          intro="Full-stack systems built for real organisations — from a Spring Boot portal for my college to a production CRM a logistics sales team uses every day."
        >
          Selected work
        </SectionHeading>

        {/* -------------------------------------------------------- featured */}
        <div className="mt-14">
          {FEATURED.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="rule group grid gap-x-8 gap-y-8 py-12 lg:grid-cols-12 lg:py-16"
            >
              {/* Margin column: ghost numeral + the headline metric. */}
              <div className="flex items-start justify-between gap-6 lg:col-span-3 lg:block">
                <span
                  aria-hidden
                  className="font-display text-5xl font-semibold leading-none text-[var(--line-strong)] transition-colors duration-500 group-hover:text-accent sm:text-6xl"
                >
                  {num(index)}
                </span>
                {project.metric && (
                  <div className="panel px-5 py-5 lg:mt-8">
                    <p className="font-display text-3xl font-semibold tabular-nums leading-none text-[var(--text-primary)]">
                      {project.metric.value}
                    </p>
                    <p className="label mt-3 text-[var(--text-muted)]">{project.metric.label}</p>
                  </div>
                )}
              </div>

              <div className="min-w-0 lg:col-span-9">
                <p className="label text-accent">{project.eyebrow || 'Featured project'}</p>
                <h3 className="font-display mt-4 max-w-2xl text-[1.75rem] font-semibold leading-[1.1] text-[var(--text-primary)] sm:text-4xl">
                  {project.title}
                </h3>

                <figure className="frame group/frame mt-9">
                  <div className="frame-bar" aria-hidden>
                    <span className="frame-dots">
                      <i />
                      <i />
                      <i />
                    </span>
                    <span className="frame-url mono">{project.frame}</span>
                  </div>
                  <div className="frame-body">
                    <img
                      src={project.image}
                      alt=""
                      width={1280}
                      height={720}
                      className="frame-img"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </figure>

                <p className="mt-9 max-w-2xl text-[15px] leading-relaxed text-[var(--text-muted)] sm:text-base">
                  {project.description}
                </p>

                <ul className="mt-7 max-w-2xl space-y-3">
                  {project.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex gap-4 text-[15px] leading-relaxed text-[var(--text-muted)]"
                    >
                      <span aria-hidden className="mt-[0.6em] h-px w-4 shrink-0 bg-[var(--line-strong)]" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <ul className="mt-8 flex flex-wrap gap-2">
                  {project.stack.map((t) => (
                    <li key={t} className="chip">
                      {t}
                    </li>
                  ))}
                </ul>

                <FeaturedLinks project={project} />
              </div>
            </motion.article>
          ))}
        </div>

        {/* ---------------------------------------------------- index of rest */}
        <div className="mt-20">
          <p className="label text-[var(--text-muted)]">Also built</p>

          <ul className="mt-6">
            {OTHERS.map((project, index) => {
              const href = project.live || project.github
              const kind = project.live ? 'Live' : 'Source'
              return (
                <motion.li
                  key={project.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className="rule"
                >
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="row group -mx-4 flex flex-col gap-4 px-4 py-7 transition-[padding] duration-500 hover:pl-6 lg:flex-row lg:items-center lg:gap-8"
                  >
                    <span className="label w-10 shrink-0 pt-1 text-[var(--text-muted)] transition-colors group-hover:text-accent">
                      {num(FEATURED.length + index)}
                    </span>

                    <div className="min-w-0 lg:w-[34%] lg:shrink-0">
                      <h4 className="font-display text-xl font-semibold leading-snug text-[var(--text-primary)]">
                        {project.title}
                      </h4>
                      <p className="mono mt-2 text-[12px] leading-5 text-[var(--text-muted)]">
                        {project.stack.join(' / ')}
                      </p>
                    </div>

                    <p className="line-clamp-2 min-w-0 flex-1 text-sm leading-relaxed text-[var(--text-muted)]">
                      {project.description}
                    </p>

                    <span className="label flex shrink-0 items-center gap-2 text-[var(--text-muted)] transition-colors group-hover:text-[var(--text-primary)]">
                      {kind}
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </a>
                </motion.li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
