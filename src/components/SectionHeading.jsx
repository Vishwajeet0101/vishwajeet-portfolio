import { motion } from 'framer-motion'

const MotionDiv = motion.div

/**
 * Editorial section header in the reference's grammar: an orange square
 * marker, a numbered mono label, and a wide serif title where the final
 * clause picks up italics. Pass the emphasised part via `accent`.
 */
export function SectionHeading({ index, label, children, accent, intro, className = '' }) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`rule grid gap-x-8 gap-y-6 pt-6 lg:grid-cols-12 ${className}`}
    >
      <p className="label flex items-baseline gap-3 text-[var(--text-muted)] lg:col-span-3">
        <span aria-hidden className="h-1.5 w-1.5 translate-y-[-1px] bg-accent" />
        <span>
          {index} / {label}
        </span>
      </p>

      <div className="lg:col-span-9">
        <h2 className="font-display max-w-4xl text-[clamp(1.75rem,3.8vw,3rem)] leading-[1.02] text-[var(--text-primary)]">
          {children}
          {accent && <span className="em-serif-italic"> {accent}</span>}
        </h2>
        {intro && (
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-[var(--text-muted)] sm:text-base">
            {intro}
          </p>
        )}
      </div>
    </MotionDiv>
  )
}
