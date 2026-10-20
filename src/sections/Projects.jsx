import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS, SITE } from "../utils/constants";
import { SectionHeading } from "../components/SectionHeading";

const MotionArticle = motion.article;
const MotionLi = motion.li;

const FEATURED = PROJECTS.filter((p) => p.featured);
const OTHERS = PROJECTS.filter((p) => !p.featured);

const num = (i) => String(i + 1).padStart(2, "0");

/** Link text has to match where the link actually goes — never "view live"
    on a project that has no public URL. */
function ctaFor(project) {
  if (project.live) return "Visit the live site";
  if (project.github) return "View the source";
  return "Request a walkthrough";
}

export function Projects() {
  return (
    <section id="projects" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="03"
          label="Selected work"
          accent="in daily use."
          intro="Built for real organisations, not for a tutorial. Two case studies with the problem, the build and the numbers — then everything else I have shipped."
        >
          Real projects,
        </SectionHeading>

        {/* -------------------------------------------------------- featured
            Browser-chrome screenshot on one side at ~42% width, and on the
            other the zero-padded number, discipline label, title,
            description and a persistent underlined link.

            The screenshot ALTERNATES sides down the list, so consecutive
            case studies do not read as one repeated template. Only the
            desktop grid flips (lg:order-*) — stacked on a phone the
            screenshot always leads, which keeps every card consistent. */}
        <div className="mt-10">
          {FEATURED.map((project, index) => {
            const imageRight = index % 2 === 1;
            return (
              <MotionArticle
                key={project.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="rule grid items-start gap-x-10 gap-y-6 py-10 lg:grid-cols-12 lg:py-12"
              >
                {/* Browser-chrome screenshot. */}
                <a
                  href={
                    project.live ||
                    project.github ||
                    `mailto:${project.demoMailto || SITE.email}`
                  }
                  target={project.live || project.github ? "_blank" : undefined}
                  rel="noreferrer"
                  className={`frame group/frame block lg:col-span-5 ${
                    imageRight ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <div className="frame-bar" aria-hidden>
                    <span className="frame-dots">
                      <i />
                      <i />
                      <i />
                    </span>
                    <span className="frame-url mono">{project.frame}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[var(--text-muted)]" />
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
                  <span className="label block border-t border-[var(--line)] px-4 py-3 text-[var(--text-muted)]">
                    {project.tagline || "Featured project"}
                  </span>
                </a>

                {/* Story column — takes whichever side the screenshot leaves. */}
                <div
                  className={`min-w-0 lg:col-span-7 ${
                    imageRight ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <span className="mono text-sm text-[var(--text-muted)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="label text-[var(--text-muted)]">
                      {project.discipline || "Product & engineering"}
                    </p>
                  </div>

                  <h3 className="font-display mt-5 max-w-xl text-[1.5rem] leading-[1.08] text-[var(--text-primary)] sm:text-[1.9rem]">
                    {project.title}
                  </h3>

                  {project.client && (
                    <p className="mono mt-3 text-[13px] text-[var(--text-muted)]">
                      Built for {project.client}
                    </p>
                  )}

                  {/* Problem before solution: a client reads the first line to
                    find out whether this project is anything like theirs. */}
                  {project.problem && (
                    <div className="mt-7 border-l border-[var(--line-strong)] pl-5">
                      <p className="label text-[var(--text-muted)]">
                        The problem
                      </p>
                      <p className="mt-2.5 max-w-xl text-[15px] leading-relaxed text-[var(--text-muted)]">
                        {project.problem}
                      </p>
                    </div>
                  )}

                  <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-[var(--text-primary)] sm:text-base">
                    {project.description}
                  </p>

                  <div className="mt-7 flex flex-wrap items-baseline gap-x-8 gap-y-4">
                    {project.metric && (
                      <p className="flex items-baseline gap-3">
                        <span className="font-display text-2xl tabular-nums text-[var(--text-primary)]">
                          {project.metric.value}
                        </span>
                        <span className="label text-[var(--text-muted)]">
                          {project.metric.label}
                        </span>
                      </p>
                    )}
                  </div>

                  <ul className="mt-7 flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <li key={tech} className="chip">
                        {tech}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={
                      project.live ||
                      project.github ||
                      `mailto:${project.demoMailto || SITE.email}`
                    }
                    target={
                      project.live || project.github ? "_blank" : undefined
                    }
                    rel="noreferrer"
                    className="story-link mt-8"
                  >
                    {ctaFor(project)}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </MotionArticle>
            );
          })}
        </div>

        {/* ---------------------------------------------------- index of rest */}
        <div className="mt-10">
          <p className="label text-[var(--text-muted)]">Also built</p>

          <ul className="mt-6">
            {OTHERS.map((project, index) => {
              const href = project.live || project.github;
              const kind = project.live ? "Live" : "Source";
              return (
                <MotionLi
                  key={project.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="rule"
                >
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="row group -mx-4 flex flex-col gap-4 px-4 py-7 transition-[padding] duration-500 hover:pl-6 focus-visible:pl-6 active:pl-6 lg:flex-row lg:items-center lg:gap-8"
                  >
                    <span className="label w-10 shrink-0 pt-1 text-[var(--text-muted)] transition-colors group-hover:text-accent group-focus-visible:text-accent group-active:text-accent">
                      {num(FEATURED.length + index)}
                    </span>

                    <div className="min-w-0 lg:w-[34%] lg:shrink-0">
                      <h4 className="font-display text-xl leading-snug text-[var(--text-primary)]">
                        {project.title}
                      </h4>
                      <p className="mono mt-2 text-[12px] leading-5 text-[var(--text-muted)]">
                        {project.stack.join(" / ")}
                      </p>
                    </div>

                    <p className="line-clamp-2 min-w-0 flex-1 text-sm leading-relaxed text-[var(--text-muted)]">
                      {project.description}
                    </p>

                    <span className="label flex shrink-0 items-center gap-2 text-[var(--text-muted)] transition-colors group-hover:text-[var(--text-primary)] group-focus-visible:text-[var(--text-primary)] group-active:text-[var(--text-primary)]">
                      {kind}
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5 group-active:translate-x-0.5 group-active:-translate-y-0.5" />
                    </span>
                  </a>
                </MotionLi>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
